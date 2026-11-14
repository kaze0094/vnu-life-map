import {describe,it,expect} from 'vitest';
import {tileProvider,tileHealth} from './map';
describe('public map configuration',()=>{
 it('keeps OSM attribution and accepts an explicit HTTPS provider with plain-text credit',()=>{
  expect(tileProvider().url).toBe('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
  const custom=tileProvider('https://tiles.example/{z}/{x}/{y}.png','Provider <credit>');
  expect(custom.error).toBeNull();expect(custom.attribution).toContain('openstreetmap.org/copyright');expect(custom.attribution).toContain('Provider &lt;credit&gt;');
 });
 it('fails closed for missing attribution, unsafe protocols, credentials, or incomplete templates',()=>{
  for(const [url,credit] of [['https://tiles.example/{z}/{x}/{y}.png',undefined],[undefined,'Provider'],['http://tiles.example/{z}/{x}/{y}.png','Provider'],['https://user:pass@tiles.example/{z}/{x}/{y}.png','Provider'],['https://tiles.example/{z}/{x}.png','Provider']]){const result=tileProvider(url,credit);expect(result.url).toBeNull();expect(result.error).toBeTruthy();expect(result.attribution).toContain('OpenStreetMap');}
 });
});
describe('tile failure recovery',()=>{
 it('retains failed tiles across load completion until that tile succeeds',()=>{
  let state=tileHealth({loading:true,failed:[]},{type:'error',key:'16/1/1'});
  state=tileHealth(state,{type:'success',key:'16/2/1'});expect(state.failed).toHaveLength(1);
  state=tileHealth(state,{type:'complete'});expect(state.loading).toBe(false);expect(state.failed).toHaveLength(1);
  state=tileHealth(state,{type:'success',key:'16/1/1'});expect(state.failed).toEqual([]);
 });
 it('clears failures for unloaded tiles and permits an explicit fresh attempt',()=>{
  const failed={loading:false,failed:['16/1/1']};expect(tileHealth(failed,{type:'unload',key:'16/1/1'}).failed).toEqual([]);
  expect(tileHealth(failed,{type:'retry'})).toEqual({loading:true,failed:[]});
  expect(tileHealth(failed,{type:'loading'}).failed).toHaveLength(1);
 });
});
