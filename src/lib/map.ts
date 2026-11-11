// Public build-time configuration only. Never put secret keys in NEXT_PUBLIC_*.
const osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
export function tileProvider(url?: string, credit?: string) {
  if (!url && !credit) return {url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png', attribution:osmAttribution, error:null};
  try {
    if (!url || !credit?.trim() || !['{z}','{x}','{y}'].every(token => url.includes(token))) throw new Error('Incomplete provider');
    const parsed = new URL(url.replaceAll('{s}', 'a').replaceAll('{z}', '1').replaceAll('{x}', '1').replaceAll('{y}', '1'));
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error('HTTPS required');
    return {url, attribution:`${osmAttribution} · ${escapeHtml(credit)}`, error:null};
  } catch {
    // Fail closed: never silently switch services when a provider is blocked/misconfigured.
    return {url:null, attribution:osmAttribution, error:'Cấu hình bản đồ nền chưa hợp lệ. Vui lòng dùng danh sách địa điểm.'};
  }
}
export interface TileHealth { loading: boolean; failed: string[] }
export type TileHealthEvent = {type:'loading'|'complete'|'retry'} | {type:'error'|'success'|'unload'; key:string};
export function tileHealth(state: TileHealth, event: TileHealthEvent): TileHealth {
  switch(event.type) {
    case 'retry': return {loading:true, failed:[]};
    case 'loading': return {...state, loading:true};
    case 'complete': return {...state, loading:false};
    case 'error': return {...state, failed:Array.from(new Set([...state.failed,event.key]))};
    case 'success': case 'unload': return {...state, failed:state.failed.filter(key=>key!==event.key)};
  }
}
