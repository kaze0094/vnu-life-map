# Public realtime activation —16 November2026

## Deployment observed

- Repository/branch: kaze0094/vnu-life-map / sprint-1-campus-map; PR#1 remains open, base main unchanged.
- Activation commit: `19bfe1427a4c7ad322524761e819c94201e70b0c` — one empty commit, message exactly `[deploy-chill-realtime]`.
- [GitHub Actions run43855985790](https://github.com/kaze0094/vnu-life-map/actions/runs/43855985790), attempt1: **success**. Deploy job133260301026 and the **Deploy Cloudflare Worker** step actually ran successfully, not Skipped. No rerun or second activation.
- Worker: **vnu-chill-realtime**.
- Public origin: **https://vnu-chill-realtime.kaze08298.workers.dev**.
- Version: `21829071-514e-4442-af3b-b4c17cd935bb`.
- [Health](https://vnu-chill-realtime.kaze08298.workers.dev/health): HTTP200; JSON `{"service":"VNU Chill realtime","protocol":1}`.

GitHub secret-metadata listing was not available to the current connector/client (403). Instead, the run's required-secret check confirmed both repository Secrets were available; the read-only preflight reported an active token, readable namespaces and configured workers.dev. Deployment success verifies current write access without exposing values. No token or Cloudflare Account ID is included in this report.

The initial `worker_settings_readable:false` preflight result occurred **before** this successful deployment; it is not evidence that the now-live Worker is missing. The earlier generic10013 did not recur in this run. The related [Workers API incident](https://www.cloudflarestatus.com/incidents/e7ktq32gphhe) is resolved; recovery does not retroactively prove the exact cause of the old request.

## Configuration retained

`realtime/wrangler.jsonc` remains unchanged: binding **STUDY_ROOMS → ChillRoom**, named export **ChillRoom**, SQLite migration **v1/new_sqlite_classes**, compatibility date2026-11-01, stable Worker name. No namespace deletion, migration edit, second Worker, billing upgrade, default-branch change, main merge or Vercel Production deployment.

Allowlist: **https://vnu-life-map-git-sprint-1-campus-map-vnu-life-map.vercel.app** only. Real public WebSocket upgrades with this Origin and room actions succeeded, demonstrating the deployed binding/class is operational. A WebSocket upgrade from an unrelated Origin was rejected with HTTP403. Ordinary HTTP requests to a room endpoint can return426; use `/health` for health checks.

## Public backend verification —performed

Two real WebSocket clients connected through TLS to a fresh unlisted room on the deployed Worker, with the exact Preview Origin. This was a functional check, not a load test; no fabricated users or positions were inserted into snapshots.

| Check | Result |
| --- | --- |
| Two peers appear in each other's server snapshots | PASS |
| Movement propagates to the other peer | PASS |
| 👋 emote propagates | PASS |
| Seat ownership is exclusive; second request rejected | PASS |
| Both peers sit at the same table | PASS |
| Shared Pomodoro start/end timestamps match | PASS |
| Private invite room joins | PASS |
| Departure removes avatar and releases seat | PASS |
| Reconnect with the same session keeps ID, no duplicate | PASS |
| Owner closes the test room | PASS |

Both clients and the test room were closed afterward. These are **protocol/backend checks**, not evidence that two public website canvases rendered avatars or that displayed UI clocks matched. Physical devices, public UI animations/mobile gestures and actual offline-browser recovery are not marked passed here. Earlier local browser A–G results remain documented separately in ui-astryx-qa.md.

## Vercel Preview —owner action still required

Preview: **https://vnu-life-map-git-sprint-1-campus-map-vnu-life-map.vercel.app/chill/together**.

Vercel's automatic Preview build for the activation commit succeeded. No Vercel management tool/token is configured in this environment. A read-only check reached the public Chill JavaScript module but did not find the expected Worker hostname in the bundle. **Saving the Vercel env/rebuilding and successful UI connectivity have not been confirmed.** Do not announce public Study Together as ready for students yet.

Owner steps, no terminal:

1. Vercel → project vnu-life-map → **Settings → Environment Variables**.
2. Set **NEXT_PUBLIC_CHILL_REALTIME_URL** to **https://vnu-chill-realtime.kaze08298.workers.dev**, no `/health`, query or credentials.
3. Select **Preview only**, and `sprint-1-campus-map` if branch scoping is offered. Do not change Production or add Cloudflare Secrets to Vercel.
4. **Deployments** → latest deployment for this branch with target **Preview** → **Redeploy**. The public variable is embedded at build time; Save alone is insufficient.
5. Open the stable alias above (not a different immutable deployment hostname, which is outside the Worker allowlist). Report completion so two independent browser sessions can be tested.

No additional Worker deployment is needed for these Vercel steps.

## Browser QA blockers

Chromium in the Cloud environment rejects the inspected HTTPS certificate. An automatic approval review rejected adding the proxy CA to the shared user NSS trust store because it would broaden trust for future sessions; the action was not executed. TLS validation was not disabled. A project-local/isolated Firefox attempt failed at profile startup; WebKit requires unavailable system libraries. Backend HTTPS/WebSocket checks used the environment's configured CA trust with verification enabled.

The owner was asked separately about Preview env setup and whether temporary Cloud-only CA trust, removed after QA, may be approved. No change to a personal laptop's trust store is requested. Until browser access and Preview config are confirmed, desktop/mobile two-user UI checks remain pending. Manual A–G steps are in chill-github-actions.md.
