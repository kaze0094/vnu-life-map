import {describe,it,expect} from 'vitest';
import {parking,demo,filterLocations,occupancyPercent,unknown,mappable,repository} from './data';
describe('campus data integrity',()=>{
 it('keeps all eleven candidates unknown and off the map',()=>{expect(parking.map(p=>p.id)).toEqual(Array.from({length:11},(_,i)=>`XT-P${String(i+1).padStart(2,'0')}`));for(const p of parking){expect(p.coordinates).toBeNull();expect(p.capacity).toBeNull();expect(p.occupancy).toBeNull();expect(p.operationalStatus).toBeNull();expect(p.verification.status).toBe('pending_verification');}expect(mappable(parking)).toEqual([])});
 it('filters Vietnamese without accents and searches record ids',()=>{expect(filterLocations(parking,'xac minh','parking','real')).toHaveLength(11);expect(filterLocations(parking,'xt-p01','all','real')).toHaveLength(1);expect(filterLocations(parking,'','study','real')).toHaveLength(0)});
 it('isolates demo records even in a mixed collection',()=>{expect(filterLocations([...parking,...demo],'','all','real')).toHaveLength(11);expect(filterLocations([...parking,...demo],'','all','demo')).toHaveLength(demo.length);expect(mappable(demo)).toHaveLength(0);expect(repository.findParking('DEMO-02')).toBeUndefined()});
 it('distinguishes unknown from zero',()=>{expect(unknown(null)).toBe('Chưa có dữ liệu');expect(unknown(0)).toBe('0')});
});
describe('occupancy calculation',()=>{
 it('calculates known occupancy including empty and full',()=>{expect(occupancyPercent(100,35)).toBe(35);expect(occupancyPercent(20,0)).toBe(0);expect(occupancyPercent(20,20)).toBe(100)});
 it('rejects unknown, invalid, and inconsistent counts',()=>{for(const [c,o] of [[null,0],[100,null],[0,0],[-1,0],[10,-1],[10,11],[Infinity,1],[10,NaN]] as [number|null,number|null][]){expect(occupancyPercent(c,o)).toBeNull()}});
});
