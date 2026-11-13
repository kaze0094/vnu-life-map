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

Reviewer: Codex, public-source review. The four nodes carry university names/types and geographic points within the Xuân Thủy cluster. `source_verified` is explicitly scoped by `method: public_source`: it confirms consistency with the cited public geographic source on the review date, not a field visit, entrance survey, current availability, public access entitlement, institutional endorsement, or accuracy guarantee. Operational status stays null. No capacities, hours, or occupancy counts were added. Recheck against institutional evidence and field survey before navigation-sensitive use.

Nominatim also returned the UET node consistently, but it is the same underlying OSM dataset, not a second independent authority. The official UET website request returned HTTP 403 during this review, and Overpass endpoints were unavailable; neither was treated as affirmative evidence. No coordinates were derived from building outlines. Library C1T remains unplaced rather than using an inferred centroid.

### Simulation provenance and isolation

SIM-P01 (10/10), SIM-P02 (8/10), SIM-P03 (4/20) are deliberately fictional fixtures. Counts and capacities have no relationship to VNU. Crowded starts at 80%; full means zero free spaces. Recommendations consider only valid demo records with free spaces, descending by free spaces. No routing, coordinates, geographic markers or real operational connection exist. In-memory entry/exit events never modify repository seeds; real records are rejected by the simulation helpers.

### Candidate review records

Each candidate has an individual worksheet under `parking-verification/`. Proposed name, entrance coordinates, evidence and reviewer are unconfirmed. Source-checked campus points above are independent records and do not identify any candidate pin.


## Sprint 1.2 verification semantics

The four public node coordinates, source URLs and 2026-11-11 source-check dates are preserved, not re-surveyed. Their status is now `source_verified` (previously generic `verified` with a public-source method). `field_verified` is a distinct status reserved for documented field review; no current seed has that status. `verifiedAt` is the dated check associated with the status, not evidence of fresh operations. UI labels distinguish source check from field survey, and public-source checks imply neither institutional authorization nor an entrance location.

Parking now has a separate optional `entranceCoordinates` field. It is null on every parking seed, including fictional records. It must only be populated with independently documented entrance evidence and must never be inferred from the facility point or InMapz pins. XT-P01–XT-P11 remain pending, with capacity, occupancy, operational status and entrance coordinates null. No live observation or institutional approval was added in this sprint.

Tile-provider settings concern basemap imagery only; they do not change location provenance or verify points. Always retain OSM attribution and any approved provider's required credit. No automatic failover to another provider is permitted when access is denied.

## Final B2 release — 12 November 2026

The project team supplied the field facts and exact coordinate pairs in the competition release brief, and confirmed **11/11/2026** as the survey date. This is the evidence source; no independent field visit by the application or agent is claimed. `verifiedAt`/`details.observedAt` are `2026-11-11` (date only); `updatedAt`/`reportedAt` are `2026-11-12`. No time of day is invented.

| Record | Geographic role | Coordinates | Verification scope |
| --- | --- | --- | --- |
| ULIS-HOMIES-B2 | Survey location point; not a confirmed entrance | 21.037472, 105.782583 | field_verified, team survey report |
| ULIS-PARKING-B2 | Shared entrance/exit gate | 21.037722, 105.782389 | field_verified, team survey report |

Homies has **98 chairs counted by the team**, unknown official maximum, reported free fee, ULIS student-card check by supervising staff, and unverified amenities. Staff/student/approved-group schedule arrays remain empty because exact times were not supplied; schedule validity is pending confirmation. No all-day public access is inferred.

Parking stores approximate operational capacity (480), historical guide capacity (400), difference explanation (about 80 due to arrangement/vehicle sizes), and past observed range (about 480–500, full/extremely crowded) in **separate qualified fields**. Exact generic capacity, current occupancy, available count and real-time count remain null. These are never inputs to live available-space calculations. Fee is 5,000 VND/entry; card issue/return and camera station are descriptions from the report. Provider and live system access remain unknown/unavailable. No plate image or identifier is collected or included.

The historical examination guide is attributed to the team's supplied information. No public URL was supplied; the app does not pretend to have fetched that document. The user instructed using the supplied facts without further verification. We do not manufacture a citation or infer schedule times from that instruction.

Homies C3 and Đa năng are scope records only, pending with null coordinates/details. XT-P01–XT-P11 remain unchanged; **B2 parking has not been assigned to any inventory ID**. Original OSM names/coordinates/source-check dates remain intact and source-only. Public contributor account IDs were removed from the retained OSM snapshot; source/version/geographic evidence and OSM attribution remain.

Earlier sections describe earlier sprint states. The final real map has six eligible points (two team-reported B2 points plus four OSM-source points), never fictional markers. Source-only points are not upgraded to field verification.


## Student-first update — 13 November 2026

Owner specifies **06:45–20:00** for Homies B2 in the current prototype. Stored as `details.openingHours` with timezone Asia/Ho_Chi_Minh, scope prototype, and source `owner-prototype-hours`. This updates the earlier missing prototype-hour information; it does not fabricate group/staff schedules or institutional approvals. Survey date remains 11/11; the Homies record update is now 13/11, not a new survey. Real-time seats/current occupancy stay null.

Explicit `utility: homies` membership is added only to B2, C3 and Đa năng; Đa năng's display name is clarified to Homies Đa năng from the owner's current request, still pending. No fourth study location/C1T is reclassified. All original coordinates, 11 candidates and prior source-only status are preserved.

Booking inventory is a separate **three-seat fictional fixture** with some pre-held slots for demonstrating full state. It has no geographic coordinates and does not set any capacity/occupancy field on real records. Counts and booking IDs are local component state, never a VNU booking or live observation. Slot examples stay within 06:45–20:00, but are not a published official group schedule. Directions links only use confirmed real points and delegate routing/origin selection to an external map; a Homies point is not advertised as a verified entrance.
