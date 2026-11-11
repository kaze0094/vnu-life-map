import {describe,it,expect} from 'vitest';
import {demo,parking,locations,sources,mappable,repository} from './data';
import {simulateEvent,parkingState,availableCount,recommendAlternatives,resetSimulation} from './simulation';
const lots=demo.filter(lot=>lot.id.startsWith('SIM-'));
describe('Sprint 1.1 seeds',()=>{
 it('includes real non-parking locations with traceable sources and scoped verification',()=>{
  expect(locations.length).toBeGreaterThanOrEqual(3);
  expect(repository.list('real')).toHaveLength(locations.length+parking.length);
  for(const location of locations){expect(location.mode).toBe('real');expect(location.operationalStatus).toBeNull();expect(sources.find(s=>s.id===location.sourceId)?.url).toMatch(/^https:\/\/www.openstreetmap.org\//);if(location.verification.status==='source_verified'){expect(location.verification.verifiedAt).toMatch(/^2026-11-11/);expect(location.verification.method).toBe('public_source');expect(location.coordinates).not.toBeNull();}}
  expect(mappable(locations)).toHaveLength(4);
  expect(locations.find(l=>l.coordinates===null)?.verification.status).toBe('pending_verification');
 });
 it('isolates all fictional lots, including any mistakenly verified ones, from the map',()=>{
  expect(lots).toHaveLength(3);for(const lot of lots){expect(lot.coordinates).toBeNull();expect(lot.mode).toBe('demo');expect(lot.sourceId).toBe('demo');}
  expect(mappable([...parking,...locations,...demo])).toEqual(mappable(locations));
  expect(mappable([{...lots[0],coordinates:{lat:21,lng:105},verification:{status:'source_verified',verifiedAt:'2026-11-11'}}])).toEqual([]);
  expect(mappable([{...locations[0],coordinates:{lat:NaN,lng:105}}])).toEqual([]);
 });
});
describe('simulated parking events',()=>{
 it('starts full, crowded and available and calculates available counts',()=>{expect(lots.map(parkingState)).toEqual(['full','crowded','available']);expect(lots.map(availableCount)).toEqual([0,2,16]);});
 it('updates entry and exit immutably',()=>{const result=simulateEvent(lots,lots[2].id,'entry');expect(result.accepted).toBe(true);const entered=result.lots;expect(entered[2].occupancy).toBe(5);expect(lots[2].occupancy).toBe(4);expect(availableCount(entered[2])).toBe(15);expect(simulateEvent(entered,lots[2].id,'exit').lots[2].occupancy).toBe(4);});
 it('rejects entry into full lots and exit from empty lots',()=>{expect(simulateEvent(lots,lots[0].id,'entry').lots[0]).toBe(lots[0]);const empty={...lots[0],occupancy:0};expect(simulateEvent([empty],empty.id,'exit').lots[0]).toBe(empty);const oneLeft={...lots[0],occupancy:9};expect(parkingState(simulateEvent([oneLeft],oneLeft.id,'entry').lots[0])).toBe('full');expect(parkingState(simulateEvent([lots[0]],lots[0].id,'exit').lots[0])).toBe('crowded');});
 it('never changes real candidates or unknown/invalid counts',()=>{for(const lot of [parking[0],{...lots[0],mode:'real' as const},{...lots[0],capacity:null},{...lots[0],occupancy:-1},{...lots[0],capacity:1.5},{...lots[0],coordinates:{lat:21,lng:105}}]){expect(simulateEvent([lot],lot.id,'entry').lots[0]).toBe(lot);expect(availableCount(lot)).toBeNull();}});
 it('recommends only other valid fictional lots with space, ranked by availability',()=>{expect(recommendAlternatives([...lots,...parking],lots[0].id).map(l=>l.id)).toEqual([lots[2].id,lots[1].id]);expect(recommendAlternatives(lots,lots[1].id)).toEqual([]);expect(recommendAlternatives(lots,'missing')).toEqual([]);expect(recommendAlternatives(lots.map(l=>({...l,occupancy:l.capacity})),lots[0].id)).toEqual([]);});
});

describe('explicit event outcomes and reset',()=>{
 it('rejects full, empty, missing IDs and real-mode records explicitly',()=>{
  expect(simulateEvent(lots,lots[0].id,'entry')).toEqual({lots,accepted:false,reason:'full'});
  const empty=[{...lots[0],occupancy:0}];expect(simulateEvent(empty,empty[0].id,'exit')).toEqual({lots:empty,accepted:false,reason:'empty'});
  expect(simulateEvent(lots,'no-such-lot','entry')).toEqual({lots,accepted:false,reason:'not_found'});
  expect(simulateEvent(parking,parking[0].id,'entry')).toEqual({lots:parking,accepted:false,reason:'real_record'});
  const invalid=[{...lots[0],capacity:null}];expect(simulateEvent(invalid,invalid[0].id,'entry')).toEqual({lots:invalid,accepted:false,reason:'invalid_lot'});
 });
 it('returns fresh reset fixtures after accepted and rejected events without changing seeds',()=>{
  const changed=simulateEvent(resetSimulation(lots),lots[2].id,'entry');
  expect(changed.accepted).toBe(true);expect(changed.lots[2].occupancy).toBe(5);
  const reset=resetSimulation(lots);expect(reset).toEqual(lots);expect(reset).not.toBe(lots);expect(reset[0]).not.toBe(lots[0]);
  expect(reset[2].occupancy).toBe(4);expect(lots[2].occupancy).toBe(4);
  const rejected=simulateEvent(reset,lots[0].id,'entry');expect(rejected.accepted).toBe(false);expect(resetSimulation(lots)).toEqual(lots);
 });
 it('preserves source coordinates and keeps entrances unknown for all parking seeds',()=>{
  expect(locations.slice(0,4).map(l=>l.coordinates)).toEqual([{lat:21.0382738,lng:105.7824572},{lat:21.0379689,lng:105.7828716},{lat:21.040311,lng:105.7816961},{lat:21.0382596,lng:105.7826979}]);
  for(const lot of [...parking,...demo.filter(l=>l.category==='parking')])expect(lot.entranceCoordinates).toBeNull();
  expect(locations.every(l=>l.verification.status!=='field_verified')).toBe(true);
 });
});
