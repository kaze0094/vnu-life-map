# Sprint 1.1 validation

Checked 2026-11-11 with local production build, headless system Chromium via Playwright.

- Desktop 1440 × 1000 and mobile 390 × 844.
- Four source-backed markers; popup contains verification scope and source.
- Demo mode removes geographic map and exposes three simulated lots.
- Full lot blocks entry, exit decreases count, next entry restores full state.
- Full state offers available fictional alternatives.
- Switching back to real mode removes simulator; mobile list search finds XT-P01.
- Candidate detail shows unknown values; no simulator in real detail.
- Fictional detail SIM-P02 preselects that simulated lot and has no map.
- Invalid parking ID returns not-found UI.
- No mobile horizontal overflow; no browser JavaScript errors.
- Automated domain suite: 13 tests covering seeds, isolation, unknown states, entry/exit, capacity boundaries and recommendations.

## Screenshots

- [Desktop campus](screenshots/desktop-campus.png)
- [Desktop simulation](screenshots/desktop-simulation.png)
- [Mobile simulation](screenshots/mobile-simulation.png)
- [Mobile unknown candidate detail](screenshots/mobile-candidate.png)

## Basemap verification limit

The initial browser run returned `net::ERR_CERT_AUTHORITY_INVALID` for the environment proxy's OSM tile certificate. A separate HTTPS curl request (with normal inherited certificate trust) returned `x-blocked: Access denied. See https://operations.osmfoundation.org/policies/tiles/`. The screenshot therefore does not demonstrate loaded basemap imagery. No TLS validation bypass or tile-policy workaround was applied. The application now displays a tile-error notice and retains its independent list workflow. Map markers and popup behavior were tested, but geographic visual context must be rechecked from an authorized browser/network with trusted certificates and permitted tile access before release.

No deployment, database, paid service or live parking integration was used.
