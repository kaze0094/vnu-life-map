import {describe,it,expect} from 'vitest';
import {SEATS,SOLO_SEAT,walkable,findPath,stepPosition,sanitizeProfile,validSegment} from './world';
describe('Chill movement and identity boundaries',()=>{
 it('blocks room walls, tables and chair footprints',()=>{expect(walkable({x:5,z:0})).toBe(false);expect(walkable({x:-2,z:0})).toBe(false);expect(walkable(SEATS[0])).toBe(false);expect(validSegment({x:0,z:2},{x:NaN,z:2})).toBe(false);expect(walkable({x:0,z:0},true)).toBe(false);});
 it('finds an unobstructed route around furniture to an explicitly selected chair',()=>{const path=findPath({x:0,z:3},SEATS[1]);expect(path.length).toBeGreaterThan(2);expect(path.at(-1)).toEqual(SEATS[1]);for(const p of path)expect(walkable(p,false,[SEATS[1].id])).toBe(true);expect(findPath({x:0,z:2.7},SOLO_SEAT,true).length).toBeGreaterThan(0);});
 it('slides along blocked geometry and sanitizes untrusted profiles',()=>{expect(stepPosition({x:4.3,z:2},1,0).x).toBe(4.3);const p=sanitizeProfile({nick:'<script> thật 😺',shirt:'javascript:bad',style:'evil'});expect(p.nick).not.toContain('<');expect(p.style).toBe('short');expect(p.shirt).toMatch(/^#/);expect(sanitizeProfile({nick:'a'.repeat(60)}).nick).toHaveLength(18);});
});
