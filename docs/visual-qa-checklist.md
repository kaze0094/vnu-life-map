> **Superseded for the 13/11 Student-first release:** use [current handoff/UAT](final-student-release.md) and [current QA](qa-student-final.md). Older hours/UI/access observations below are historical.

> **Current B2 competition release:** use the [final B2 UAT checklist](b2-competition-release.md#final-user-acceptance-checklist). Earlier Sprint 1.2 counts/field-verification descriptions below are historical. The current map has two team-surveyed B2 points and four retained source-only points.

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

## Team user acceptance pass on the preview URL

Run this pass separately on **Chrome desktop**, **Edge desktop**, **Chrome mobile** and **Edge mobile**. Include a real 390px-class phone where possible; record actual viewport. Give each row a tester, pass/fail result and screenshot or issue reference. Use the same deployment-specific URL/commit across devices.

Before starting, record: URL, commit SHA, Vercel environment (**Preview**), browser/version, OS/device, viewport, network, timestamp, provider and access method. If protection blocks a teammate, resolve authorized tester access rather than changing application data or buying services.

| ID | Student/tester action | Acceptance result |
| --- | --- | --- |
| UAT-01 | Open `/` and `/parking` from the shared HTTPS URL | Both load; Vietnamese UI fits desktop and mobile with no console/hydration error |
| UAT-02 | Switch Bản đồ / Danh sách; search `cong nghe`, then reset | Navigation is clear, search/filter state is retained; reset restores results |
| UAT-03 | On homepage, view real map; tap/click or keyboard-open a marker | Four source-backed markers only; readable name, URL/date and source-only badge; no entrance or authorization claim |
| UAT-04 | Inspect basemap and attribution | Authorized imagery actually loads and attribution is visible; if unavailable, record failure separately rather than signing off map readiness |
| UAT-05 | Block tile requests/offline, then select list fallback | Clear nonblocking status; filtered list still works; fallback moves focus to list |
| UAT-06 | Restore network and retry basemap | Authorized successful tile loads clear warning; no endless retries or bypass needed |
| UAT-07 | Search `XT-P01`, open detail, then directly reload its URL | Pending status and unknown capacity, occupancy and entrance remain; no fictional simulator or map point appears |
| UAT-08 | Choose Học tập and search a nonexistent name | C1T stays list-only; no-results state has a working reset; zero results do not imply zero capacity |
| UAT-09 | Switch to Minh họa, select each fictional lot | Fiction is obvious; full/crowded/available states and counts are consistent; no geographic map, route or real-time claim |
| UAT-10 | Simulate exit from full, entry back to full, and exits until empty | Counts/free spaces/percentage agree; full entry and empty exit cannot succeed; alternatives are fictional lots with free spaces |
| UAT-11 | Reset; leave/re-enter demo; reload `/parking/SIM-P02` | Reset restores seed state; mode changes/reload reset local counts; fictional detail preselects SIM-P02 |
| UAT-12 | Open `/parking/not-a-location` and `/not-a-route` | Not-found UI; unknown routes are HTTP 404, without catch-all masking |
| UAT-13 | Tab through controls, use visible focus, and test 200% desktop zoom | Labels remain clear, controls operable, no clipped essential content or horizontal overflow |

Release decision: **pass / pass with documented basemap limitation / blocked**. Include tester names, outstanding issues and owner approval. Any live-data mixing, invented real-world values, missing provenance/fiction labels, or unexpected Production deployment classification blocks acceptance. A successful UAT pass does not authorize merging, promoting, deploying again, or connecting paid services.
