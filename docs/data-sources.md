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


## Sprint 1.1 public campus location review — 2026-11-11

Reviewed the public OSM API extract at https://www.openstreetmap.org/api/0.6/map?bbox=105.781,21.036,105.784,21.041 . Names and node coordinates were read directly from its XML, without using InMapz. Exact selected node metadata is retained in [osm-source-snapshot.json](osm-source-snapshot.json), under ODbL with attribution to OpenStreetMap contributors.

| Record | Public source | Latitude | Longitude | Review scope |
| --- | --- | --- | --- | --- |
| XT-L01 · Đại học Công nghệ | https://www.openstreetmap.org/node/11609443061 | 21.0382738 | 105.7824572 | Public source cross-check |
| XT-L02 · Đại học Kinh tế | https://www.openstreetmap.org/node/11609443059 | See retained node and seed | See retained node and seed | Public source cross-check |
| XT-L03 · Trường Đại học Y Dược | https://www.openstreetmap.org/node/11609590538 | See retained node and seed | See retained node and seed | Public source cross-check |
| XT-L04 · Tòa E3 - Đại học Công Nghệ | https://www.openstreetmap.org/node/12573506643 | See retained node and seed | See retained node and seed | Public source cross-check |
| XT-L05 · C1T (library) | https://www.openstreetmap.org/way/605977394 | null | null | Library name/type found; point not verified |

Reviewer: Codex, public-source review. The four nodes carry university names/types and geographic points within the Xuân Thủy cluster. `verified` is explicitly scoped by `method: public_source`: it confirms consistency with the cited public geographic source on the review date, not a field visit, entrance survey, current availability, public access entitlement, institutional endorsement, or accuracy guarantee. Operational status stays null. No capacities, hours, or occupancy counts were added. Recheck against institutional evidence and field survey before navigation-sensitive use.

Nominatim also returned the UET node consistently, but it is the same underlying OSM dataset, not a second independent authority. The official UET website request returned HTTP 403 during this review, and Overpass endpoints were unavailable; neither was treated as affirmative evidence. No coordinates were derived from building outlines. Library C1T remains unplaced rather than using an inferred centroid.

### Simulation provenance and isolation

SIM-P01 (10/10), SIM-P02 (8/10), SIM-P03 (4/20) are deliberately fictional fixtures. Counts and capacities have no relationship to VNU. Crowded starts at 80%; full means zero free spaces. Recommendations consider only valid demo records with free spaces, descending by free spaces. No routing, coordinates, geographic markers or real operational connection exist. In-memory entry/exit events never modify repository seeds; real records are rejected by the simulation helpers.

### Candidate review records

Each candidate has an individual worksheet under `parking-verification/`. Proposed name, entrance coordinates, evidence and reviewer are unconfirmed. Source-checked campus points above are independent records and do not identify any candidate pin.
