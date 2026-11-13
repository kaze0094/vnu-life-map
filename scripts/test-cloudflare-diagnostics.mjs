import {test} from 'node:test';
import assert from 'node:assert/strict';
import {diagnoseCloudflare} from './cloudflare-diagnostics.mjs';

const account = 'a'.repeat(32), token = 'diagnostic-test-token-never-output';
const env = {CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: token};
const response = (body, status = 200) => ({status, json: async () => body});

test('uses only GETs, no redirects, does not send credentials to public status or expose API data', async () => {
  const calls = [];
  const report = await diagnoseCloudflare({env, fetchImpl: async (url, options) => {
    calls.push({url, options});
    if (url.includes('cloudflarestatus.com')) {
      assert.equal(options.headers.Authorization, undefined);
      return response({incidents: [{id: 'e7ktq32gphhe', name: 'Workers API incident', status: 'monitoring', body: token}]});
    }
    assert.equal(options.headers.Authorization, `Bearer ${token}`);
    if (url.endsWith('/tokens/verify')) return response({success: true, result: {status: 'active', id: token}});
    if (url.endsWith('/settings')) return response({success: false, errors: [{code: 10013, message: `${account} ${token}`}], result: {url}} , 503);
    return response({success: true, result: url.endsWith('/subdomain') ? {subdomain: token} : []});
  }});
  assert.equal(calls.length, 5);
  assert(calls.every(call => call.options.method === 'GET' && call.options.redirect === 'error'));
  assert.equal(report.token_active, true);
  assert.equal(report.worker_settings_readable, false);
  assert.equal(report.probes.find(probe => probe.probe === 'worker_settings').http, 503);
  assert.deepEqual(report.probes.find(probe => probe.probe === 'worker_settings').error_codes, [10013]);
  const text = JSON.stringify(report);
  assert(!text.includes(token)); assert(!text.includes(account));
  assert.deepEqual(report.unresolved_workers_incidents, ['https://www.cloudflarestatus.com/incidents/e7ktq32gphhe']);
});

test('supports account-owned token verification without requesting extra User Read permissions', async () => {
  const report = await diagnoseCloudflare({env, fetchImpl: async url => {
    if (url.endsWith('/user/tokens/verify')) return response({success: false, errors: [{code: 10000}]}, 403);
    if (url.includes(`/accounts/${account}/tokens/verify`)) return response({success: true, result: {status: 'active'}});
    return response({success: false}, 404);
  }});
  assert.equal(report.token_active, true);
  assert.equal(report.worker_settings_readable, false);
  assert.equal(report.namespaces_readable, false);
  assert.equal(report.unresolved_workers_incidents, null);
});

test('does not leak exceptions, retry, or interpret network/HTML failures as successful checks', async () => {
  let calls = 0;
  const report = await diagnoseCloudflare({env, fetchImpl: async url => {
    calls++;
    if (url.includes('cloudflarestatus.com')) return {status: 502, json: async () => {throw Error(token);}};
    throw Error(`${url} ${token}`);
  }});
  assert.equal(calls, 6);
  assert.equal(report.token_active, null);
  assert.equal(report.workers_dev_configured, null);
  assert.equal(report.unresolved_workers_incidents, null);
  assert(!JSON.stringify(report).includes(token)); assert(!JSON.stringify(report).includes(account));
});

test('missing/malformed secrets fail before making any API requests', async () => {
  await assert.rejects(diagnoseCloudflare({env: {}, fetchImpl: () => assert.fail('No network expected')}));
});
