# VNU LIFE MAP — Student-first B2 prototype

Vietnamese, mobile-first campus map focused on **Homies B2 – ULIS** and **Nhà xe B2 – ULIS**, based on team-reported survey observations from **11 November 2026**. Deadline: **15 November 2026**.

Built with Next.js App Router, TypeScript, React, Tailwind CSS, React Leaflet/OpenStreetMap and local structured JSON. No live parking integration or paid service is connected. Study Together has a separate optional Cloudflare realtime server; no public endpoint is configured by default.

## Run and validate

Node.js 20.9+ (hosting/CI target: 22.x) and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production validation:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

No credentials or environment variables are required for the map or private Chill Space. Optional **public, nonsecret build-time** tile URL/attribution settings are documented in `.env.example`. Review provider policy before use. No TLS bypass, tile proxy or automatic service failover exists. Map failures leave source-backed lists/details available.

## Routes

- `/`: homepage, B2 highlights, campus map/search/filters and separate demo mode.
- `/b2`: competition entry point.
- `/locations/ULIS-HOMIES-B2`: chairs, access, unknown official maximum, pending schedule/amenities and survey-point map.
- `/parking/ULIS-PARKING-B2`: shared gate, qualified operational capacity, separate historical/past observations, fees and null current occupancy.
- `/locations/[id]`: preserved real-location details, including pending C3/Đa năng.
- `/parking`: real candidate inventory plus B2 parking; fictional mode is explicitly separated.
- `/parking/XT-P01` … `/parking/XT-P11`: unchanged pending candidates with unknown coordinates/counts.
- `/parking/SIM-P01` … `/parking/SIM-P03`: isolated fictional simulation, no map/route.
- Unknown detail IDs return 404.

## Evidence boundaries

**98 chairs** is an observed count, not official maximum capacity. Homies access requires a ULIS student card checked by supervising staff; unrestricted all-day access is not claimed. Detailed group/staff schedule slots were not supplied; current prototype hours are provided separately below.

**Approximately 480 motorcycles** is team-reported operational capacity. **Approximately 400** is a separately attributed historical guide figure. **Approximately 480–500** is a past survey observation, not current occupancy. B2 parking `capacity`/`occupancy` stay null in generic live-count fields; qualified observations are modeled separately. No available count or current percentage is computed. Provider is unknown. Card/camera workflow descriptions do not imply integration.

The two B2 records use `field_verified` scoped to the team's survey report; the original four OSM points remain `source_verified`. Dates distinguish survey 11/11 from report/record update 12/11. C3, Đa năng, C1T and all 11 candidates remain pending; no invented coordinates. All prior records and demo features are preserved.

## Structure

- `src/lib/models.ts`: domain models and separate observed/approximate B2 facts.
- `src/lib/data.ts`: repository boundary; UI does not import seed JSON directly.
- `src/data/b2.json`: two real team-reported records. Other seeds remain separate.
- `src/components/`: existing explorer/map/simulator plus B2 highlights/detail components.
- `src/lib/*test.ts`: filtering, null semantics, seed integrity, map recovery, demo events, boundaries/reset and B2 evidence isolation.

No individual students/staff, license plate/card records, photos or sensitive credentials are included. The source snapshot retains geographic evidence without contributor account identifiers.

## Student-first release — 13 November 2026

Homepage is now a compact 12-utility grid followed immediately by the map. Only Homies and Nhà xe are active; coming-soon categories are disabled. Explicit Homies tags include B2, C3 and Đa năng; C1T remains separate. Compact popups/details expose actions first, with audit metadata behind an expandable section. Directions open an external map for verified real geographic points only; no route is fabricated.

Homies prototype hours are **06:45–20:00**, supplied by the project owner on 13/11. Entry still requires a ULIS student card/staff check. Real availability stays null. Booking is **DEMO only**, with a separate three-seat fictional inventory per slot; it never changes the 98-chair observation or real occupancy. Choose a date, reserve one seat, cancel, check in/out, advance the demo clock for no-show/expiry, or reset. Duplicate active holds and full-slot requests are rejected. State exists only in one mounted page and is lost on reload; it is not a secure shared reservation service.

- `src/lib/booking.ts`, `BookingDemo.tsx`: pure state machine and demo UI; no API/storage/identity/QR integration.
- `src/components/LocationPanel.tsx`: compact real-location information and safe actions; parking never has a booking button.
- `src/lib/student-experience.test.ts`, `booking.test.ts`: explicit Homies membership, directions/mode boundaries, time transitions, duplication/capacity/reset checks.

## Competition handoff

- [Current feature summary, 2–3 minute script, UAT and Preview steps](docs/final-student-release.md)
- [Future ULIS B2 pilot / occupancy architecture / roles / privacy / resource estimates](docs/ulis-b2-pilot-plan.md)
- [Student-first QA and current desktop/mobile screenshots](docs/qa-student-final.md)
- [Data provenance](docs/data-sources.md)
- [Vercel settings and first-deployment constraint](docs/deployment-vercel.md)

The branch Preview returned HTTP 200 without login at the beginning of the 13/11 validation session; verify its latest commit after push before submission. Historical 11–12/11 QA/UI/SSO observations remain archived and do not describe this release. No Production deploy, merge, paid service or backend is authorized in this sprint.

## VNU Chill Space — 13 November 2026

The current homepage adds Chill Space to the existing 12 campus utilities (13 entries). `/chill`, `/chill/private` and `/chill/together` add a lazy-loaded procedural 3D room without rebuilding the campus application. Private focus progress/wishes stay on-device. Shared rooms use real Cloudflare Durable Object WebSockets, not localStorage or fake participants. Without a public endpoint Preview explicitly says **Chưa kết nối realtime**.

- [Features, controls and competition script](docs/chill-space.md)
- [Dashboard-only activation: Cloudflare token → GitHub opt-in push workflow → Vercel Preview](docs/chill-github-actions.md)
- [Local development and realtime architecture](docs/chill-realtime-setup.md)
- [Actual multiplayer QA, limitations, screenshots and UAT](docs/qa-chill-space.md)

`npm run typecheck` checks both Next and Worker. `npm run realtime:check` performs a local deployment dry-run only; `npm run test:realtime` and `npm run test:chill-browser` require the running local services described in setup. No public Worker was deployed, no account registered, no main merge or Production deployment performed. Earlier handoff documents describe the earlier map-only release.

### Opt-in Worker deployment from GitHub

`.github/workflows/deploy-chill-realtime.yml` receives only pushes to `sprint-1-campus-map`. A lightweight gate checks the **pushed HEAD commit** for the case-sensitive literal `[deploy-chill-realtime]`; normal pushes skip the entire deployment job. Other branches, main and PRs cannot trigger deployment. The gate reads the event JSON without shell interpolation or secrets. The deployment retains read-only GitHub permissions, pinned actions, exact-SHA checkout, secret checks and lint/types/tests/build/Worker dry-run before Wrangler deploy.

Keep the default branch as `main`; no workflow registration on main is needed for this push trigger. After the owner saves `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in GitHub Actions repository Secrets and explicitly confirms deployment, Codex may create and push **one empty marker commit**. The first owner-authorized activation8061e73 failed with10013; no further activation is authorized by the diagnostic preparation. Re-running a marked run can redeploy; do not rerun without reviewing/authorizing it. See the [Vietnamese guide](docs/chill-github-actions.md) for activation and how to distinguish a successful deployment from a skipped job.

### Cloudflare10013 investigation

[Read the incident analysis and Dashboard steps](docs/cloudflare-error-10013.md) before retrying. Configuration/class export/SQLite migration match; the failed run coincided closely with a reported Workers API incident. Workers Scripts Edit remains the required account-scoped permission; no extra permissions or plan upgrade is justified by10013 alone. The deployment job now has sanitized, GET-only preflight and post-failure diagnostics without automatic retries. `npm run test:diagnostics` checks request restrictions and secret redaction with mocks. Public account probes and a new deployment have not been run by Codex.

### Astryx UI/UX tooling

Repository-local [Astryx skill and usage](docs/astryx-ui-tooling.md) is installed for future UI work. CLI/core0.7.16 are pinned development dependencies (Node22.13+); `npm run astryx -- search 'mobile navigation'` reads the design reference. UI initialization/theme integration has not been applied, so the existing campus/Chill screens remain unchanged.
