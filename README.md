# VNU LIFE MAP — Sprint 1.1

Mobile-first Vietnamese campus discovery application, built with Next.js App Router, TypeScript, Tailwind CSS 4, React Leaflet and OpenStreetMap. Initial area: Xuân Thủy, Hanoi. Hòa Lạc is disabled as coming soon.

## Run locally

Requires Node.js 20.9+ and npm. From this directory:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

No environment variables, database, API keys or paid services are needed. The browser downloads OpenStreetMap tiles over the internet; attribution remains visible. Comply with https://operations.osmfoundation.org/policies/tiles/ before scaling; no bulk downloads or offline prefetching.

## Features and structure

- `/`: interactive campus basemap, Vietnamese text search, category filters, list/map views and explicit real/demo selector.
- `/parking`: parking verification listing.
- `/parking/XT-P01` through `/parking/XT-P11`: candidate detail pages; unknown IDs return 404.
- `src/lib/models.ts`: Campus, Location, Parking, Source and Verification domain contracts.
- `src/lib/data.ts`: repository boundary and pure filtering/occupancy helpers; replace with an asynchronous Supabase adapter in a future sprint. Do not expose service-role credentials to client code. Add RLS, validated writes and review workflows before database rollout.
- `src/data/*.json`: structured seed data. UI consumes repository functions instead of JSON directly.
- `src/components/`: presentation components; Leaflet loads client-side only.
- `src/lib/data.test.ts`: candidate invariants, demo isolation, Vietnamese search, category filtering, unknown states and occupancy edge cases.

## Data limitations

Four campus facility points are source-checked against public OpenStreetMap nodes, with a fifth (C1T library) retained without coordinates pending point verification. These are representative facility points, not surveyed entrances or claims of current operations. The real map has no parking candidate pins. All 11 parking candidates have null coordinates, capacity, occupancy and operational status. The seed timestamp records data preparation, not a site inspection. Demo names and counts are fictional and have no coordinates. No parking-card or real-time occupancy connection exists. Do not use these candidates as navigation destinations.

See [data sources](docs/data-sources.md) and [verification checklist](docs/verification-checklist.md). No deployment, Supabase connection or paid service has been configured.


## Sprint 1.1 — real locations and simulation

`src/data/locations.json` adds public campus facilities to `repository.list('real')`. Four coordinate pairs are copied exactly from OSM nodes, independently of the InMapz description. `verification.method = public_source` means source cross-check only, not field verification or institutional endorsement. Source URLs, dates and retained OSM metadata are in `docs/data-sources.md` and `docs/osm-source-snapshot.json`. The library C1T remains in the verification list with null coordinates.

Switch “Chế độ dữ liệu” to “Minh họa” on either listing to try Smart Parking. Three fictional SIM-P lots begin full, crowded (80%), and available. Select a lot, simulate entries/exits, or reset. Full lots block entry; empty lots block exit. Alternatives rank fictional lots by available spaces, never by geographic distance. Demo mode removes the geographic map entirely; demo detail pages also show a labeled simulator. Counts are local component state, reset on unmount/reload and never persisted to seed files, real records, or other tabs. Legacy demo search records remain available.

On mobile, Bản đồ and Danh sách show separate views. Source links and verification scope are available in marker popups and cards. The map is filtered by the same search/category controls as the list; no results can be a valid unknown-data state.

Candidate worksheets: `docs/parking-verification/XT-P01.md` through `XT-P11.md`. No candidate has been renamed, assigned to an OSM facility, or geographically inferred.

Validation report and screenshots: [docs/qa-sprint-1.1.md](docs/qa-sprint-1.1.md). Browser interaction checks passed, but this environment could not load OSM tiles (proxy certificate rejection; a separate tile probe returned access denied). The UI reports tile failures and the list remains available. Recheck basemap imagery on an authorized network before release.
