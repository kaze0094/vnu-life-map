# VNU LIFE MAP — Sprint 1

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

There are no verified facility points in this sprint. The real map deliberately has no candidate pins. All 11 parking candidates have null coordinates, capacity, occupancy and operational status. The seed timestamp records data preparation, not a site inspection. Demo names and counts are fictional and have no coordinates. No parking-card or real-time occupancy connection exists. Do not use these candidates as navigation destinations.

See [data sources](docs/data-sources.md) and [verification checklist](docs/verification-checklist.md). No deployment, Supabase connection or paid service has been configured.
