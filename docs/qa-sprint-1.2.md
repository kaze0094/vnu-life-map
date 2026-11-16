# Sprint 1.2 — public preview preparation

Validated 2026-11-11 against a local Next.js production build. No hosted preview was created. No service connection, TLS bypass, paid service, database, card reader, AI API or payment integration was added.

## Automated checks

All passed after the final application changes:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

20 tests in 3 files cover filtering/null semantics, candidate invariants, exact preservation of the four source-backed coordinates, unknown entrances, demo isolation, entry/exit and full/empty boundaries, explicit rejection of missing IDs/real records/invalid lots, reset, recommendations, provider validation/attribution escaping, and per-tile failure recovery.

Build produces static `/` and `/parking` routes plus the dynamic Next.js `/parking/[id]` route. `npm start` served production pages for browser testing. The app uses the standard Next.js runtime; static-only export is unsuitable for the dynamic route. [Vercel documentation](deployment-vercel.md) records Node 22 and default Next.js build settings. Compatibility is prepared locally, not proven by a deployment.

## Browser checks performed

System headless Chromium via Playwright, desktop **1440 × 1000** and mobile viewport **390 × 844**:

- Four markers only; OSM attribution retained.
- Desktop keyboard focus/Enter opens a marker popup; mobile tap opens the same source details.
- Source badge, source URL/date, no-field-survey qualifier and non-entrance/non-authorization text are readable. Screenshot review caught an overlapping error overlay; final implementation moves status above the map canvas.
- Tile failure is nonblocking. Its list link selects the filtered list and moves focus to it on desktop and mobile.
- Mobile map/list navigation, search, empty state and reset work; no horizontal page overflow in tested mobile layout.
- Demo mode removes the geographic map. Entry/exit updates counts; the full-lot entry control is disabled. Reset restores fictional fixtures and announces reset. Rejection outcomes are tested at the domain level; reducer success messages are conditional on `accepted`.
- Real candidate detail retains unknown capacity/occupancy and unknown entrance. Fictional detail SIM-P02 selects the correct fictional lot and has no map.
- A separate **fixture-only** browser test aborts tile requests, then uses a synthetic 1px PNG after manual retry. The warning clears, loading completes and popups remain usable. This tests event wiring only: no real tile content is obtained or represented by the fixture. Unit tests additionally cover clearing failures when failed tiles succeed or unload and retaining partial failures after unrelated successes.
- No browser JavaScript errors in the final run.

## Screenshots from real application requests

These show the actual fallback state; they do **not** claim working basemap imagery. No synthetic tile fixtures were used for these screenshots.

- [Desktop popup and map fallback](screenshots/sprint-1.2/desktop-map-fallback.png)
- [Mobile popup and fallback](screenshots/sprint-1.2/mobile-popup.png)
- [Mobile fictional simulator](screenshots/sprint-1.2/mobile-simulator.png)

## Blockers and remaining release checks

Actual external tile images remain unverified in this environment: Chromium reports `net::ERR_CERT_AUTHORITY_INVALID` on `https://tile.openstreetmap.org/...` through the environment proxy. Sprint 1.1 also recorded a separate OSM access-denied response. TLS validation remains enabled, no alternative tile service was contacted, and no proxy/failover/block-evasion mechanism was introduced. Validate real imagery from a trusted, authorized network under the chosen provider's terms before public release.

Chrome/Edge branded browsers and physical mobile devices were not tested here. Complete [the manual desktop/mobile checklist](visual-qa-checklist.md), including provider attribution, zoom/pan, source links, offline recovery, keyboard/screen-reader behavior and device rendering. Field verification and institutional authorization remain absent; all 11 parking candidates stay pending and real occupancy unknown.

No Vercel project or Git deployment integration was created. Importing a project can trigger deployment; wait for explicit instruction. No merge was performed.
