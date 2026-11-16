import {describe,it,expect} from 'vitest';
import {repository,filterUtilities,mappable,directionsHref,b2,locations,demo} from './data';
describe('student map and utility boundaries',()=>{
 it('uses explicit Homies membership and never classifies C1T or generic study facilities as Homies',()=>{
  const homies=filterUtilities(repository.list('real'),'','homies','real');expect(homies.map(item=>item.id)).toEqual(['ULIS-HOMIES-B2','ULIS-HOMIES-C3','ULIS-DA-NANG']);expect(mappable(homies).map(item=>item.id)).toEqual(['ULIS-HOMIES-B2']);expect(homies.find(item=>item.id==='XT-L05')).toBeUndefined();
 });
 it('preserves the parking inventory, all other records, source-only points and Vietnamese search',()=>{
  expect(filterUtilities(repository.list('real'),'','parking','real')).toHaveLength(12);expect(filterUtilities(repository.list('real'),'da nang','homies','real')).toHaveLength(1);expect(mappable(repository.list('real'))).toHaveLength(6);expect(locations.filter(item=>item.verification.status==='source_verified')).toHaveLength(4);
 });
 it('links directions only to confirmed real geographic points, without synthesizing routes or fictional destinations',()=>{
  expect(directionsHref(b2[0])).toContain('destination=21.037472,105.782583');expect(directionsHref(b2[1])).toContain('destination=21.037722,105.782389');
  for(const item of demo)expect(directionsHref(item)).toBeNull();for(const item of repository.list('real').filter(item=>item.verification.status==='pending_verification'))expect(directionsHref(item)).toBeNull();
 });
});
