# VNU LIFE MAP — B2 competition prototype

Vietnamese, mobile-first campus map focused on **Homies B2 – ULIS** and **Nhà xe B2 – ULIS**, based on team-reported survey observations from **11 November 2026**. Deadline: **15 November 2026**.

Built with Next.js App Router, TypeScript, React, Tailwind CSS, React Leaflet/OpenStreetMap and local structured JSON. No backend, live parking integration or paid service is connected.

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

No credentials or environment variables are required. Optional **public, nonsecret build-time** tile URL/attribution settings are documented in `.env.example`. Review provider policy before use. No TLS bypass, tile proxy or automatic service failover exists. Map failures leave source-backed lists/details available.

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

**98 chairs** is an observed count, not official maximum capacity. Homies access requires a ULIS student card checked by supervising staff; unrestricted all-day access is not claimed. Detailed schedule slots were not supplied, and schedule validity remains pending confirmation.

**Approximately 480 motorcycles** is team-reported operational capacity. **Approximately 400** is a separately attributed historical guide figure. **Approximately 480–500** is a past survey observation, not current occupancy. B2 parking `capacity`/`occupancy` stay null in generic live-count fields; qualified observations are modeled separately. No available count or current percentage is computed. Provider is unknown. Card/camera workflow descriptions do not imply integration.

The two B2 records use `field_verified` scoped to the team's survey report; the original four OSM points remain `source_verified`. Dates distinguish survey 11/11 from report/record update 12/11. C3, Đa năng, C1T and all 11 candidates remain pending; no invented coordinates. All prior records and demo features are preserved.

## Structure

- `src/lib/models.ts`: domain models and separate observed/approximate B2 facts.
- `src/lib/data.ts`: repository boundary; UI does not import seed JSON directly.
- `src/data/b2.json`: two real team-reported records. Other seeds remain separate.
- `src/components/`: existing explorer/map/simulator plus B2 highlights/detail components.
- `src/lib/*test.ts`: filtering, null semantics, seed integrity, map recovery, demo events, boundaries/reset and B2 evidence isolation.

No individual students/staff, license plate/card records, photos or sensitive credentials are included. The source snapshot retains geographic evidence without contributor account identifiers.

## Competition handoff

- [B2 release, 2–3 minute Vietnamese demo script, limitations and final UAT](docs/b2-competition-release.md)
- [Final B2 QA and submission screenshots](docs/qa-b2-release.md)
- [Data provenance](docs/data-sources.md)
- [Vercel Preview settings and first-deployment constraint](docs/deployment-vercel.md)
- [General Chrome/Edge visual checklist](docs/visual-qa-checklist.md)

The user-supplied Vercel URL redirects to SSO for unauthenticated visitors; owner action is needed for no-login Preview access. No Production deploy or merge is authorized. Historical Sprint 1.1/1.2 QA documents record earlier seeds, not the final B2 marker counts.
