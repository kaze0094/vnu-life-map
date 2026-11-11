# Manual visual QA — Sprint 1.2 public preview gate

Record browser/version, OS/device, viewport, date, network, tile provider, result and screenshot for every run. Complete on **Chrome and Edge desktop**, and **Chrome and Edge on a mobile device or 390px-wide emulator** (390 × 844 baseline). Headless Chromium is a useful automated check, not a substitute for branded-browser/device sign-off.

## Real campus map and list

- [ ] Homepage and `/parking` load without hydration/console errors at desktop and 390px widths; no clipped controls or horizontal page overflow at 100%/200% zoom.
- [ ] Keyboard Tab reaches search, category buttons, mode selector, map/list buttons, source links and parking details with visible focus. Leaflet zoom and popup controls remain usable. Screen-reader labels and Vietnamese document language are meaningful.
- [ ] On mobile, map/list buttons select the expected view. Changing views preserves search and category state. On desktop the map/list layout fits and list scroll is usable.
- [ ] Exactly four source-verified real markers appear for all categories; no candidate or demo point appears. Zoom/pan and click/tap markers; popup name, source URL, date and source-only badge are legible and do not imply an entrance, field visit, live data or institutional authorization.
- [ ] In an authorized network, actual basemap imagery loads correctly and OSM/provider attribution is visible and clickable. Do not sign off imagery based on mock tiles.
- [ ] Source links point to retained public references; dates are observation/source-check dates, not claims of present operation.
- [ ] Search by Vietnamese without accents and by XT-P01. Study filter shows C1T in list with no marker. No-results state gives useful reset controls.
- [ ] Each parking candidate remains pending with unknown capacity/occupancy/entrance and no claimed live availability. Unknown is never displayed as measured zero.

## Basemap failure and recovery

- [ ] Use browser offline/request blocking to simulate a tile failure (do not disable TLS). The warning is nonblocking; markers/popup controls still respond.
- [ ] “Xem danh sách địa điểm” opens the current filtered list and moves focus to it on mobile/desktop.
- [ ] Restore connectivity, then choose “Thử tải lại bản đồ”. Loading state appears; successful tile loads remove the warning without reload. A failure in a different current tile keeps the partial-error notice.
- [ ] Pan/zoom away from failed tiles: obsolete failures clear after those tiles unload. A new failure is reported independently.
- [ ] Retry while still offline remains safe, without an automatic infinite retry loop. All list features still work.
- [ ] For approved custom-provider testing, ensure correct HTTPS template and full credit. Partial/invalid config gives a list fallback and no alternate-service request.

## Fictional simulator

- [ ] Switching to demo removes all geographic map DOM/tiles/markers and prominently identifies fiction. No route or distance claim is shown.
- [ ] Three lots start full, crowded and available. Selecting a lot updates controls; entries/exits update occupied/free/percent consistently.
- [ ] Full lot cannot accept entry; empty lot cannot exit. A rejected event never announces success. Full lot alternatives contain only fictional lots with space.
- [ ] Reset restores original counts, full/crowded/available states, default selected lot and reset announcement. Leaving/re-entering demo and reloading also reset.
- [ ] Fictional detail pages remain labeled and isolated. Real details have no simulator. Invalid ID shows not-found UI.

## Release record

- Browser/version and device:
- Date/viewport/provider/network:
- Passes/failures and screenshot paths:
- Remaining blockers and reviewer:

Deployment requires a separate explicit instruction even after this checklist passes.
