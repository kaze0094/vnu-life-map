# Data sources and limitations

## Campus basemap / view center

OpenStreetMap tiles: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png. Attribution links to https://www.openstreetmap.org/copyright (ODbL). Default campus view center is **21.0388103, 105.7818897**, returned by Nominatim on 2026-11-11 for “Vietnam National University 144 Xuan Thuy Hanoi”: https://nominatim.openstreetmap.org/search?q=Vietnam+National+University+144+Xuan+Thuy+Hanoi&format=json&limit=1 . Source feature: https://www.openstreetmap.org/relation/21663316 . This is a sourced viewport center, not a verified entrance or parking position. No location marker is inferred from it.

## Parking candidates

The user's project brief describes an InMapz screenshot containing 11 red pins. The screenshot itself was not provided or inspected. XT-P01–XT-P11 are arbitrary inventory IDs, not an identification of actual pin positions or order. Identity, geographic coordinates, capacity, occupancy, pricing, access and operational status remain unknown. Verification status is `pending_verification`; verifiedAt is null. No proprietary map artwork was accessed, scraped or copied.

`updatedAt` is the seed record preparation date (2026-11-11), not evidence of field verification. No availability or operational claims are made.

## Demo

DEMO records are synthetic names and illustrative counts, explicitly labeled, separated by mode and excluded from real map points. All demo coordinates are null. No occupancy number in demo mode is a measurement.

## Future updates

Only add real geographic points after documenting a permissible source and reviewing the location. Store source URL/reference, observation date, reviewer, coordinate accuracy and field notes. Preserve null values when facts are unknown; never convert unknown to zero. Occupancy ratios require finite positive capacity and a valid count between zero and capacity. Unknown/invalid inputs return null.

There is no integration with parking-card systems. Future live data requires institutional authorization, documented provenance, freshness rules and privacy review. Public OSM tile hosting is best effort; before launch at scale choose a compliant tile provider and review its policies.
