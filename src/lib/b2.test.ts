import {describe,it,expect} from 'vitest';
import {b2,locations,parking,demo,repository,mappable,filterLocations,occupancyPercent,detailHref,sources} from './data';
import {availableCount,simulateEvent} from './simulation';
import type {Parking} from './models';
describe('B2 competition release evidence boundaries',()=>{
 it('maps exactly two team-reported survey points alongside four unchanged public-source points',()=>{
  expect(b2.map(item=>item.coordinates)).toEqual([{lat:21.037472,lng:105.782583},{lat:21.037722,lng:105.782389}]);
  expect(mappable(repository.list('real'))).toHaveLength(6);
  for(const item of b2){expect(item.verification.status).toBe('field_verified');expect(item.verification.method).toBe('field_survey');expect(item.verification.verifiedAt).toBe('2026-11-11');expect(item.details.observedAt).toBe('2026-11-11');expect(item.operationalStatus).toBeNull();expect(sources.find(source=>source.id===item.sourceId)).toBeTruthy();}
  expect(locations.filter(item=>item.verification.status==='source_verified')).toHaveLength(4);
 });
 it('stores counted chairs separately from official capacity, access, and unconfirmed schedule',()=>{
  const item=b2[0];expect(item.details.kind).toBe('homies');if(item.details.kind!=='homies')throw Error('Wrong fixture');
  expect(item.details.seatingObserved).toBe(98);expect(item.details.officialMaximumCapacity).toBeNull();expect(item.details.feeVnd).toBe(0);expect(item.details.access).toMatch(/thẻ sinh viên ULIS/i);
  expect(item.details.schedule.validity).toBe('pending_confirmation');expect(item.details.schedule.staff).toEqual([]);expect(item.details.schedule.students).toEqual([]);expect(item.details.schedule.approvedGroups).toEqual([]);expect(Object.values(item.details.amenities).every(value=>value===null)).toBe(true);
 });
 it('never uses approximate operational capacity or past observation as live parking counts',()=>{
  const item=repository.findParking('ULIS-PARKING-B2')!;const details=b2[1].details;
  if(details.kind!=='parking')throw Error('Wrong fixture');
  expect(item.capacity).toBeNull();expect(item.occupancy).toBeNull();expect(occupancyPercent(item.capacity,item.occupancy)).toBeNull();expect(availableCount(item)).toBeNull();expect(simulateEvent([item],item.id,'entry').accepted).toBe(false);
  expect(details.operationalCapacityApprox).toBe(480);expect(details.historicalCapacityApprox).toBe(400);expect(details.observedMotorcycles).toEqual({min:480,max:500,approximate:true});expect(details.realTimeOccupancy).toBeNull();expect(details.systemAvailableCount).toBeNull();expect(details.provider).toBeNull();expect(details.feePerEntryVnd).toBe(5000);
  expect(item.entranceCoordinates).toEqual({lat:21.037722,lng:105.782389});expect(item.coordinates).toEqual(item.entranceCoordinates);expect(item.coordinateRole).toBe('shared_gate');expect(details.gateShared).toBe(true);
 });
 it('retains pending candidates, C3 and Da nang with no invented coordinates',()=>{
  expect(parking).toHaveLength(11);for(const item of parking){expect(item.verification.status).toBe('pending_verification');expect(item.coordinates).toBeNull();expect(item.capacity).toBeNull();expect(item.occupancy).toBeNull();expect(item.entranceCoordinates).toBeNull();}
  for(const id of ['ULIS-HOMIES-C3','ULIS-DA-NANG']){const item=repository.findLocation(id)!;expect(item.verification.status).toBe('pending_verification');expect(item.coordinates).toBeNull();expect(mappable([item])).toEqual([]);}
 });
 it('searches B2 and preserves mode and route separation',()=>{
  expect(filterLocations(repository.list('real'),'B2','all','real')).toHaveLength(2);expect(filterLocations(repository.list('real'),'B2','parking','real')).toHaveLength(1);
  expect(detailHref(b2[0])).toBe('/locations/ULIS-HOMIES-B2');expect(detailHref(b2[1])).toBe('/parking/ULIS-PARKING-B2');
  expect(repository.list('demo')).toEqual(demo);expect(repository.list('demo').some(item=>item.id.startsWith('ULIS-'))).toBe(false);expect(mappable(demo)).toEqual([]);expect(repository.findParking(b2[0].id)).toBeUndefined();
  expect(simulateEvent(b2.filter(item=>item.category==='parking') as Parking[],'ULIS-PARKING-B2','entry').accepted).toBe(false);
 });
});
