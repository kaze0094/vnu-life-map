import b2Seed from '@/data/b2.json';
import locationSeed from '@/data/locations.json';
import parkingSeed from '@/data/parking.json';
import demoSeed from '@/data/demo.json';
import sourceSeed from '@/data/sources.json';
import campusSeed from '@/data/campuses.json';
import type { Parking, Source, Campus, Category, DataMode, Location, B2Place } from './models';
export const b2 = b2Seed as B2Place[];
export const locations = locationSeed as Location[];
export const parking = parkingSeed as Parking[];
export const demo = demoSeed as Parking[];
export const sources = sourceSeed as Source[];
export const campuses = campusSeed as Campus[];
// Replace this boundary with a Supabase adapter; UI does not import seed JSON.
export interface CampusRepository { list(mode: DataMode): Location[]; findParking(id: string): Parking | undefined; findLocation(id: string): Location | undefined }
export const repository: CampusRepository = { list: mode => mode === 'real' ? [...b2, ...locations, ...parking] : demo, findLocation: id => [...b2,...locations,...parking].find(item=>item.id===id), findParking: id => [...b2.filter(p=>p.category==='parking') as Parking[],...parking, ...demo.filter(p => p.category === 'parking')].find(p => p.id === id) };
export const categories: Record<Category, string> = {parking:'Gửi xe',study:'Học tập',facility:'Tiện ích'};
export function normalize(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim(); }
export function filterLocations<T extends Location>(items: T[], query: string, category: Category | 'all', mode: DataMode): T[] { return items.filter(item => item.mode === mode && (category === 'all' || item.category === category) && normalize(`${item.name} ${item.id}`).includes(normalize(query))); }
export function occupancyPercent(capacity: number | null, occupancy: number | null): number | null { if (capacity === null || occupancy === null || !Number.isFinite(capacity) || !Number.isFinite(occupancy) || capacity <= 0 || occupancy < 0 || occupancy > capacity) return null; return Math.round(occupancy / capacity * 100); }
export const unknown = (value: number | null) => value === null ? 'Chưa có dữ liệu' : value.toLocaleString('vi-VN');
export function mappable(items: Location[]) { return items.filter(item => item.mode === 'real' && (item.verification.status === 'source_verified' || item.verification.status === 'field_verified') && item.coordinates !== null && Number.isFinite(item.coordinates.lat) && Number.isFinite(item.coordinates.lng) && Math.abs(item.coordinates.lat) <= 90 && Math.abs(item.coordinates.lng) <= 180); }

export const detailHref = (item: Location) => item.category==='parking'?`/parking/${item.id}`:`/locations/${item.id}`;
export function isB2(item: Location): item is B2Place { return b2.some(place=>place.id===item.id); }

export type UtilityFilter = 'all' | 'homies' | 'parking';
export function filterUtilities(items: Location[], query: string, utility: UtilityFilter, mode: DataMode): Location[] {
  return filterLocations(items,query,'all',mode).filter(item=>utility==='all'||(utility==='homies'?item.utility==='homies':item.category==='parking'));
}
// An external directions tool chooses the route/origin. We never fabricate one.
export function directionsHref(item: Location): string | null {
  if (!mappable([item]).length) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${item.coordinates!.lat},${item.coordinates!.lng}&travelmode=walking`;
}
