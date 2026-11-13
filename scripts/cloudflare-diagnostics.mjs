import {appendFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

const API = 'https://api.cloudflare.com/client/v4';
const STATUS = 'https://www.cloudflarestatus.com/api/v2/incidents/unresolved.json';

// Never return response messages, URLs, account details, headers or exception text.
// Only these allowlisted fields may reach Actions logs or the step summary.
async function readProbe(label, url, token, fetchImpl) {
  try {
    const response = await fetchImpl(url, {
      method: 'GET',
      headers: token ? {Authorization: `Bearer ${token}`} : {},
      redirect: 'error',
      signal: AbortSignal.timeout(12000),
    });
    let body;
    try { body = await response.json(); } catch { body = null; }
    const codes = Array.isArray(body?.errors)
      ? body.errors.map(error => error?.code).filter(code => Number.isInteger(code) && code >= 0 && code <= 2147483647).slice(0, 8)
      : [];
    return {
      safe: {probe: label, http: response.status, api_success: typeof body?.success === 'boolean' ? response.status >= 200 && response.status < 300 && body.success : null, error_codes: codes},
      body,
    };
  } catch {
    return {safe: {probe: label, http: null, api_success: false, error_codes: [], outcome: 'network_or_tls_error'}, body: null};
  }
}

export async function diagnoseCloudflare({env = process.env, fetchImpl = fetch} = {}) {
  const account = env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const token = env.CLOUDFLARE_API_TOKEN?.trim();
  if (!account || !/^[a-fA-F0-9]{32}$/.test(account) || !token) {
    throw new Error('Required GitHub repository secrets are missing or malformed. Values are never displayed.');
  }
  const prefix = `${API}/accounts/${account}`;
  let verify = await readProbe('user_token_verify', `${API}/user/tokens/verify`, token, fetchImpl);
  const probes = [verify.safe];
  // Account-owned tokens have their own verification endpoint. A failed user-token
  // probe alone is not proof that an account token is invalid.
  if (!verify.safe.api_success || verify.body?.result?.status !== 'active') {
    verify = await readProbe('account_token_verify', `${prefix}/tokens/verify`, token, fetchImpl);
    probes.push(verify.safe);
  }
  const checks = await Promise.all([
    readProbe('worker_settings', `${prefix}/workers/scripts/vnu-chill-realtime/settings`, token, fetchImpl),
    readProbe('durable_object_namespaces', `${prefix}/workers/durable_objects/namespaces`, token, fetchImpl),
    readProbe('workers_dev_subdomain', `${prefix}/workers/subdomain`, token, fetchImpl),
    readProbe('cloudflare_public_status', STATUS, null, fetchImpl),
  ]);
  probes.push(...checks.map(check => check.safe));
  const [settings, namespaces, subdomain, status] = checks;
  const bindings = settings.body?.result?.bindings;
  const binding = Array.isArray(bindings) ? bindings.find(item => item?.name === 'STUDY_ROOMS') : undefined;
  const tokenStatus = verify.safe.api_success ? verify.body?.result?.status : null;
  const namespaceList = namespaces.body?.result;
  const incidentList = status.body?.incidents;
  const workerIncidents = Array.isArray(incidentList)
    ? incidentList.filter(incident => typeof incident.name === 'string' && /workers/i.test(incident.name)
      && incident.status !== 'resolved' && /^[a-z0-9]{12}$/.test(incident.id)).slice(0, 5)
      .map(incident => `https://www.cloudflarestatus.com/incidents/${incident.id}`)
    : null;
  return {
    collected_at: new Date().toISOString(),
    mode: 'read_only_no_retries_no_deployment',
    token_active: tokenStatus === 'active' ? true : ['expired', 'disabled'].includes(tokenStatus) ? false : null,
    // A missing Worker/namespace is normal before a successful first deployment.
    worker_settings_readable: settings.safe.api_success,
    expected_binding_present: settings.safe.api_success && Array.isArray(bindings) ? binding?.type === 'durable_object_namespace' : null,
    migration_tag_matches_v1: settings.safe.api_success && typeof settings.body?.result?.migration_tag === 'string' ? settings.body.result.migration_tag === 'v1' : null,
    namespaces_readable: namespaces.safe.api_success && Array.isArray(namespaceList),
    workers_dev_configured: subdomain.safe.api_success ? Boolean(subdomain.body?.result?.subdomain) : null,
    unresolved_workers_incidents: workerIncidents,
    probes,
    interpretation: 'Read probes cannot prove write permissions, Free-plan entitlement, migration success or service recovery. A 404 before the first deploy can be expected; 10013 is not proof of a bad token. Do not change permissions, billing or migrations automatically.',
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const report = await diagnoseCloudflare();
    const output = JSON.stringify(report, null, 2);
    console.log(output);
    if (process.env.GITHUB_STEP_SUMMARY) {
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\n## Cloudflare read-only diagnostics\n\n\`\`\`json\n${output}\n\`\`\`\n`);
    }
  } catch {
    // Do not log the caught error: it may contain request URLs or credentials.
    console.error('Cloudflare diagnostics could not run. Check required repository secrets; no values are displayed.');
    process.exitCode = 1;
  }
}
