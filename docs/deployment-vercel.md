# Vercel preview preparation — no deployment performed

This is a standard Next.js App Router application. It uses React 19, Node-compatible server-rendered `/parking/[id]` pages, and a client-only Leaflet component. It requires the Next.js runtime, not a static-export-only host. No database, API endpoint, filesystem writes, credentials, or paid service is needed. `npm run build` validates compilation and route generation, not an actual Vercel deployment.

## Before authorizing any preview

1. Review PR #1 and the public-source verification scope. No point is an entrance; parking candidates remain unverified and capacity/occupancy unknown. No institutional authorization is implied.
2. Complete [manual visual QA](visual-qa-checklist.md), especially basemap access from a trusted network. This environment has previously rejected tile certificates and encountered OSM service denial. Do not disable TLS verification, proxy tiles, rotate hosts to evade blocks, or switch services as an access workaround.
3. Choose an appropriate tile provider for the expected audience and obtain permission under its terms. The default standard OSM tile service is best effort and has no SLA. Review https://operations.osmfoundation.org/policies/tiles/ including visible attribution, browser identification/referrer, caching, traffic and no bulk/prefetch/offline download requirements. Never suppress the browser Referer. Do not set aggressive cache-busting or a referrer policy that conflicts with provider requirements.
4. If a public deployment needs another provider, select one whose terms expressly permit that independent deployment/use. Provider configuration is not a remedy for a blocked service. No alternative provider account or service has been connected in this sprint. Review any provider's cost/limits before setup; paid services need separate approval.

## Exact import/project settings

Prepare these settings; **do not click Deploy, import a project, link Git or execute a Vercel CLI deployment until explicitly authorized**.

| Setting | Value |
| --- | --- |
| Git provider / repository | GitHub · `kaze0094/vnu-life-map` |
| Repository URL | https://github.com/kaze0094/vnu-life-map |
| Source branch for the requested preview | `sprint-1-campus-map` |
| Branch URL | https://github.com/kaze0094/vnu-life-map/tree/sprint-1-campus-map |
| Framework preset | Next.js |
| Root directory | Repository root (`./`), not `src` |
| Node.js version | 22.x (matches CI; Next.js requires >=20.9) |
| Package manager / install | npm · `npm ci` using committed package-lock.json |
| Build command | `npm run build` |
| Output directory | Leave framework default; do not override to `out`, `dist` or `.next/static` |
| Development command | Leave framework default; not used to serve a hosted production build |
| Start command | No custom Vercel override; Vercel runs the Next.js output. `npm start` is for local smoke tests |
| Production branch | Keep `main`; never set `sprint-1-campus-map` as the production branch |
| Requested deployment environment | Preview, subject to the first-deployment constraint below |
| Environment variables | None required; optional public tile pair below, scoped to Preview / this branch |
| Database / storage / integrations | None; do not enable paid add-ons |
| Domain | Generated deployment URL only; no custom domain or production promotion |

If the selected account/plan asks for payment, stop; this task does not authorize a paid plan. Account eligibility and repository access must be checked by the project owner. No Vercel account or project settings have been inspected from this environment.

## Important: a new project's first deployment is Production

Vercel's current [environment documentation](https://vercel.com/docs/deployments/environments#first-deployment), reviewed 2026-11-11, says the **first deployment of a new project is always Production**, including a dashboard import, a non-production Git branch, and `vercel deploy --target=preview`. It uses Production-scoped variables. Omitting `--prod` does not avoid this first-deployment rule.

A retained failed/canceled deployment also counts as the first deployment; if every deployment is deleted, the next becomes first again. Do not intentionally create a failed deployment as a workaround. A new project's initial import is not a Preview-only operation.

**Before proceeding:** confirm whether the intended project already has a deployment in its history. If none exists, a strictly Preview-only first deployment is blocked by this platform behavior. Obtain separate authorization for an initial Production-classified bootstrap (and review what it publishes), or use an appropriate existing project with a deployment history. No bootstrap is authorized or performed here. The repository's `main` currently contains only a README, so importing its default branch is not a valid build of this application.

## Creating Preview from this branch without merging PR #1

These are instructions for the team to execute **only after deployment is explicitly authorized**, on a project that has already passed the first-deployment constraint above.

1. Select the intended Vercel project and confirm its linked repository is `kaze0094/vnu-life-map`. Check that the production branch remains `main`, and that deployment history is nonempty. Review any Git integration before enabling it: automatic deployments can occur on pushes.
2. Apply the import/build settings above. Leave both optional tile variables absent to use standard OSM under its policy, or supply the approved nonsecret pair in the Preview environment. Check branch-specific Preview overrides for `sprint-1-campus-map` as well as general Preview values.
3. Open **Deployments → Create Deployment**. Enter `sprint-1-campus-map` or its full branch URL. If selecting a commit SHA instead, select this branch's configuration when prompted. See [Vercel's Git-reference instructions](https://vercel.com/docs/git#creating-a-deployment-from-a-git-reference).
4. Verify the source branch and intended Preview environment before creating it. Do not choose Production, promote the deployment, change the production branch, or merge PR #1. Create the deployment only under the team's explicit deployment authorization.
5. On completion, verify **Environment: Preview**, the branch, commit SHA, build result and generated URL in deployment details. A `vercel.app` hostname alone does not prove the environment is Preview. Use the commit/deployment-specific URL for repeatable acceptance testing; the branch URL can move after later deployments.
6. Use the project's existing access-protection settings for authorized testers. Confirm that teammates can open the URL on their real devices; do not disable protection or upgrade plans automatically. Record the commit and run the checklist below.

If the dashboard cannot create the intended branch deployment, a CLI alternative for the same **existing, linked project with prior deployments** is `vercel deploy --target=preview` from a clean checkout of `sprint-1-campus-map`. This command deploys and is not run here. Inspect the local `.vercel` project/team link first; never use `--prod`, `--yes` to skip project checks, or promote the result. No CLI installation, credentials or linking is required for this preparation task.

No Git push or PR merge is required to use the dashboard's Create Deployment on the already-pushed branch. Future automatic previews require separately authorized Git integration and may run on later pushes.

## Optional public tile settings

Both variables must be set together in the Vercel **Preview** environment before building:

```text
NEXT_PUBLIC_MAP_TILE_URL=https://your-approved-provider.example/{z}/{x}/{y}.png
NEXT_PUBLIC_MAP_TILE_ATTRIBUTION=Required provider credit in plain text
```

The example host is a placeholder, not a configured provider. Omit both for the standard OSM default. URLs must use HTTPS and contain `{z}`, `{x}`, `{y}`; `{s}` subdomains are supported. Supply plain text credit (escaped by the app), alongside always-visible OSM attribution. If a provider requires other attribution formats/links or a different API, adapt the implementation and review terms before selecting it. Invalid or partial configuration disables tile requests and offers the list; it never silently changes providers.

`NEXT_PUBLIC_*` values are embedded into browser bundles at build time, visible to everyone, and require a rebuild when changed. Never put secret tokens, passwords, service-role keys or private URLs here. This sprint requires no keys. A future provider that mandates secrets requires a separate design and authorization, not pasting credentials into these variables. Browser requests go directly to the approved HTTPS tile URL; there is no tile proxy, automatic failover or backend tile cache.

## Local production check

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Check `/`, `/parking`, a real candidate such as `/parking/XT-P01`, a fictional detail such as `/parking/SIM-P02`, and an unknown ID. Validate on the intended preview hostname after deployment is separately authorized, including real tile imagery/attribution and source links.


## Task 4 local validation — 2026-11-11

Application code was unchanged. Lint, typecheck, all 20 tests and the Next.js 16.4.6 production build passed. Local validation used Node 24.22.1; Node 22 is the documented hosting/CI target, not a claimed Vercel-runtime test. No environment overrides were set for the local build: both public tile variables were absent, so the default OSM provider applies.

The production server was tested over HTTP, including every seeded parking-detail route:

| Route | Local expected/observed status | Content check |
| --- | --- | --- |
| `/` | 200 | Homepage |
| `/parking` | 200 | Parking listing |
| `/parking/XT-P01` … `/parking/XT-P11` | 200 for all 11 | Unknown capacity/occupancy/entrance; no simulator |
| `/parking/DEMO-01` | 200 | Legacy fictional parking detail |
| `/parking/SIM-P01` … `/parking/SIM-P03` | 200 for all 3 | Explicit fictional labels and simulator |
| `/parking/not-a-location` | 404 | Invalid parking ID |
| `/not-a-route` | 404 | Unknown route |

All 19 HTTP assertions passed. Browser/mobile evidence from Sprint 1.2 is retained in [QA report](qa-sprint-1.2.md); these local HTTP checks do not substitute for the real-device acceptance pass on the eventual URL. Public-source coordinates, provenance badges and demo/real separation are unchanged.

## Once the team supplies a preview URL

Provide the deployment-specific URL, source commit, environment shown in Vercel, failing path/action, browser/device and visible error. Do not send credentials or cookies. Then validate:

1. **Reachability and environment:** confirm HTTPS, Vercel access-protection behavior, branch/commit and Preview classification. An auth/protection page is not an app runtime failure.
2. **Routes:** open the route matrix above directly and reload detail pages. If they 404, first check source branch, root directory and framework settings. Do not mask failures with an SPA catch-all rewrite; this app needs Next.js server routing.
3. **Build/runtime errors:** inspect the deployment's build logs and runtime/function logs for the failing request, correlating timestamp and path. Build success does not establish runtime success. Confirm the installed Next/React versions come from the lockfile and that no static-export/output override was added.
4. **Map rendering:** if the map container or popups fail, capture browser console/hydration errors. Leaflet is client-only, so a server `window is not defined` error would indicate a changed import boundary. Verify attribution and the four source-only points, not entrance/navigation claims.
5. **Tile delivery:** inspect failed image URLs and Network status. Invalid/partial settings disable requests; fix the public pair and rebuild Preview. Settings are baked into JavaScript, so a changed variable needs a new build; compare commit/deployment URL to avoid testing stale bundles.
6. **Classify external failures:** certificate errors require trusted certificates/network, never disabled TLS. 401/403/provider denial requires legitimate provider permissions/policy resolution; 429 requires respecting rate limits, not automatic retry loops. DNS/offline failures should leave list and popups usable. A 200 response alone does not prove valid map imagery; check response content and the visible map.
7. **Recovery and isolation:** restore authorized tile access and retry manually, verify the warning clears, then switch to demo and confirm no geographic map/route remains. Real parking values stay unknown. Follow [team acceptance checklist](visual-qa-checklist.md#team-user-acceptance-pass-on-the-preview-url).

### Remaining safe-preview gates

- No URL or Vercel project history has been supplied, so first-deployment eligibility, account/plan access and actual hosting behavior cannot yet be verified.
- Actual basemap access failed in this cloud environment during Sprint 1.2; it must be tested on the team's trusted network. A list/simulator preview can still be tested with a documented basemap failure, but must not be signed off as a working geographic map.
- No field verification or institutional authorization is established. This does not require inventing data to enable a preview: retain all current source-only/pending labels, null states and fictional-data notices.
- Branded Chrome/Edge desktop/mobile acceptance remains to be recorded against the actual deployment URL.

## B2 competition release — current handoff

The final release adds `/b2`, `/locations/ULIS-HOMIES-B2`, `/parking/ULIS-PARKING-B2` and generic real `/locations/[id]` details. Retest direct loads and 404s; the original route matrix above is historical.

User supplied `https://vnu-life-2q8bgefqi-vnu-life-map.vercel.app` on 12/11/2026. Unauthenticated requests redirect to Vercel SSO, so this is not a no-login public Preview at the time of inspection. This is an access-protection issue, not evidence of application failure. No deployment environment or commit is inferred from the hostname. No protection bypass was attempted.

The B2 request authorizes preparing an accessible public **Preview**, not Production. An owner must confirm the existing project, Preview classification and latest commit; disable Vercel Authentication for the intended Preview scope if permitted; save; and retest incognito/mobile without a Vercel session. No dashboard mutation is possible through the available tooling here. Do not buy a plan or modify Production access. See [B2 owner steps and UAT](b2-competition-release.md#vercel-preview--owner-actions).


## Current Student-first validation — 13 November 2026

At the start of this session the existing branch Preview https://vnu-life-map-git-sprint-1-campus-map-vnu-life-map.vercel.app returned **HTTP 200**, with previous B2 content, to an unauthenticated request. The 12/11 SSO blocker is therefore historical for this URL at this check. Verify current behavior and commit after deploying the Student-first changes; do not assume every immutable deployment URL has the same protection scope.

This release adds no route requiring a backend: booking DEMO is client-only and uses one page's memory. No env/storage/payment/student authentication setup is needed. Keep Next.js output/runtime defaults. Follow [current Preview steps/UAT](final-student-release.md) and [current QA](qa-student-final.md) rather than old four-marker or pre-booking checklists.

## Chill Space / optional realtime — 13 November

The existing Next.js deployment remains compatible with Vercel. The realtime server runs separately on Cloudflare Durable Objects; Vercel does not host a persistent WebSocket server. No new variable is required to test private Chill Space. Study Together defaults to **Chưa kết nối realtime** until `NEXT_PUBLIC_CHILL_REALTIME_URL` is set in Preview and the branch redeployed. Follow [the exact activation steps](chill-realtime-setup.md); keep the Worker Origin allowlist matched to the URL used by testers. Do not promote Production or merge PR #1. A public endpoint has not been deployed by this change.

For a GitHub/Codex-only setup (no personal terminal), follow [the Vietnamese opt-in push Actions guide](chill-github-actions.md). The Worker allowlist is already the branch Preview origin. The deploy workflow only receives sprint branch pushes and skips deployment unless the pushed HEAD message contains the exact marker `[deploy-chill-realtime]`. No default-branch change, main commit or merge is needed. Codex will only create a marker commit after the owner saves Secrets and explicitly authorizes activation. Do not enable Cloudflare Workers Builds auto-deployment.
