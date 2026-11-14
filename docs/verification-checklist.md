# Parking verification checklist

Apply individually to XT-P01 through XT-P11. An inventory ID does not imply a known place.

- [ ] Obtain the user's original screenshot with permission; identify which candidate corresponds to which pin without copying its map artwork.
- [ ] Establish official/local name, campus and facility ownership with a traceable source.
- [ ] Verify position and actual entrance through permitted geographic data or an on-site survey; record coordinate precision and source.
- [ ] Confirm permitted vehicle types, access conditions, hours, fees and accessibility with the responsible operator.
- [ ] Confirm operational status with observation date; keep null until established.
- [ ] Confirm capacity with operator evidence; keep null if unavailable. Zero must mean measured zero.
- [ ] Occupancy stays null unless a reliable, authorized observation exists. Record observation time and expiry before displaying availability.
- [ ] Record reviewer identity, evidence reference, observation date and review decision. Do not put personal/sensitive evidence in public JSON.
- [ ] Set verifiedAt only after review; update record timestamp separately.
- [ ] Only a real record with source_verified or field_verified status and sourced representative coordinates may become a map point. Source checks never confirm an entrance or institutional approval. Keep rejected and pending records off the map.
- [ ] Recheck null/zero semantics, bounds, demo isolation, source attribution and mobile keyboard access.

Sprint 1 has no editing or review backend. Do not mark records verified just to populate the map. Future sprints should store evidence and field observations separately from public records and enforce approval with database permissions.

Sprint 1.2: Keep `Parking.entranceCoordinates` null until separate entrance evidence is reviewed. Never copy a representative point into the entrance field. `source_verified` records only a public-source cross-check; `field_verified` requires documented survey evidence.
