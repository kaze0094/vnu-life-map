# Final B2 release QA — 12 November 2026

Branch: `sprint-1-campus-map`; PR #1. Deadline: 15 November 2026. Application release completed locally; no merge or Production deployment was performed.

## Checks run

All passed against the final application changes:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

**25 tests across four files**: existing filtering/null states, public-source invariants, unknown candidates, provider configuration/recovery, simulator entry/exit/accepted/rejected/reset/recommendations; plus B2 coordinates, chair-vs-capacity semantics, actual gate vs representative point, operational/historical/past-observation separation, real-count nulls, survey date, pending C3/Đa năng, route and mode separation.

Next.js production build includes static `/`, `/b2`, `/parking` plus server-rendered `/locations/[id]` and `/parking/[id]`. Standard Vercel Next.js runtime is required; no static-export-only setting. No environment variable, database or sensitive credential is required.

**30 local HTTP assertions** passed using `npm start`: homepage, B2 landing, parking list, every seeded real location detail (including both B2 records and pending records), all existing parking/demo detail routes, and unknown general/location/parking routes returning 404. B2 parking uses its specific detail component instead of generic live-count statistics.

## Browser QA

System Chromium / Playwright, desktop **1440 × 1000**, mobile **390 × 844**:

- Homepage CTA, B2 landing, both detail cards and cross-links work.
- All four primary views fit 390px without horizontal page overflow; Vietnamese navigation remains visible.
- Homies wording, access notice, unknown official maximum, survey date 11/11, separate report/update date 12/11, three schedule groups and five unknown amenities checked.
- Parking operational estimate, separate historical 400 figure, dated past 480–500 range, current unknown counts and no real simulator checked.
- Six real markers on explorer (two B2 plus four source-only), one correctly focused marker on each B2 detail; keyboard Enter and click/tap popup behavior checked. Parking popup says shared entrance/exit; Homies popup does not claim an entrance.
- B2 detail tile-failure link navigates to `/b2#b2-locations` and displays the two accessible list cards. Explorer's existing fallback/recovery domain tests remain passing.
- Mobile B2 search/category filtering, C3 and `da nang` pending results, empty/reset state, candidate unknown count, fictional entry/exit/reset, mode-switch isolation and no geographic map in demo checked.
- **No browser JavaScript errors** in the final run.

This is automated Chromium viewport QA, not physical-device or branded Chrome/Edge sign-off. The [final competition UAT](b2-competition-release.md#final-user-acceptance-checklist) must be run on the actual public URL.

## Submission screenshots

Captured from the **local production build**, not the protected Vercel deployment. Actual external tile requests fail here; gray basemap/fallback screenshots must not be described as verified live map imagery. No mocked geographic tiles, private photos, license plates, names of individuals or authentication pages are used in submission images.

- [Desktop homepage](screenshots/b2-release/desktop-home.png)
- [Desktop Homies B2](screenshots/b2-release/desktop-homies.png)
- [Desktop B2 parking](screenshots/b2-release/desktop-parking.png)
- [390px homepage](screenshots/b2-release/mobile-home.png)
- [390px Homies B2](screenshots/b2-release/mobile-homies.png)
- [390px B2 parking](screenshots/b2-release/mobile-parking.png)

## Changed file groups

- **Domain/seeds:** `src/data/b2.json` (new), `locations.json`, `sources.json`, `src/lib/models.ts`, `src/lib/data.ts`. Separate B2 evidence fields; old records retained; no XT candidate assigned to B2.
- **B2 UI/routes:** new `src/components/B2Highlights.tsx`, `B2Detail.tsx`, `DetailMap.tsx`, `src/app/b2/page.tsx`, `src/app/locations/[id]/page.tsx`.
- **Existing UI:** `Explorer.tsx`, `CampusMap.tsx`, `Header.tsx`, `Provenance.tsx`, `src/app/parking/[id]/page.tsx`, `src/app/globals.css`. Preserve navigation/filter/demo features; add B2 entry and accurate point-role/date labels.
- **Tests:** new `src/lib/b2.test.ts`; adapt legacy source-scope assertions to retained inventory plus B2 records.
- **Handoff:** README, data provenance, Vercel docs, this QA report, `docs/b2-competition-release.md` (script/summary/UAT/deployment), and submission screenshots.
- **Privacy:** retained OSM evidence snapshot removes contributor account name/ID; geographic/version evidence and OSM attribution remain. No project-team identities or raw survey photos were added.

## Outstanding blockers / known limitations

1. **Public Preview access:** user-supplied `https://vnu-life-2q8bgefqi-vnu-life-map.vercel.app` responds to an unauthenticated request with a redirect to Vercel SSO. No-login access is not achieved. Available tools expose no Vercel project settings/credential, so protection could not be changed here. An authorized owner must follow the [Preview access steps](b2-competition-release.md#vercel-preview--owner-actions) and test incognito. No bypass or Production mutation was attempted.
2. **Hosted version:** a supplied immutable deployment URL does not establish the new B2 commit is deployed. After pushing, confirm the Git-triggered Preview (if any) corresponds to the B2 release and use that deployment's URL. The agent does not infer a successful deployment from a Git push.
3. **External imagery:** Chromium in this environment reports `net::ERR_CERT_AUTHORITY_INVALID` for standard OSM tile requests. TLS remains enabled. Actual basemap imagery must be checked on the team's trusted network; no alternate service was used to evade restrictions. List/details/simulation still function.
4. **Schedule:** the user confirmed the survey date and instructed using the supplied facts without further verification. No actual schedule slots/document were supplied. Distinct staff/student/approved-group sections remain empty and schedule validity pending; no opening hours or all-day access are invented. This remains the only missing content for detailed schedule display.
5. **Known unknowns:** official maximum capacity, real-time parking count/free spaces, parking provider and amenities remain unknown as requested. Historical guide has no supplied public link; attribution is to the team's report, not a fetched document.

No Supabase, backend, AI API, real card/camera feed, payment system, automatic Production deployment or merge was added. [Competition script and limitations](b2-competition-release.md) explicitly distinguish the implemented fictional simulator from a future separately authorized integration.
