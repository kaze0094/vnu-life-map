import parkingSeed from '@/data/parking.json';
import demoSeed from '@/data/demo.json';
import sourceSeed from '@/data/sources.json';
import campusSeed from '@/data/campuses.json';
import type { Parking, Source, Campus, Category, DataMode, Location } from './models';
export const parking = parkingSeed as Parking[];
export const demo = demoSeed as Parking[];
export const sources = sourceSeed as Source[];
export const campuses = campusSeed as Campus[];
// Replace this boundary with a Supabase adapter; UI does not import seed JSON.
export interface CampusRepository { list(mode: DataMode): Location[]; findParking(id: string): Parking | undefined }
export const repository: CampusRepository = { list: mode => mode === 'real' ? parking : demo, findParking: id => [...parking, ...demo.filter(p => p.category === 'parking')].find(p => p.id === id) };
export const categories: Record<Category, string> = {parking:'Gửi xe',study:'Học tập',facility:'Tiện ích'};
export function normalize(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim(); }
export function filterLocations<T extends Location>(items: T[], query: string, category: Category | 'all', mode: DataMode): T[] { return items.filter(item => item.mode === mode && (category === 'all' || item.category === category) && normalize(`${item.name} ${item.id}`).includes(normalize(query))); }
export function occupancyPercent(capacity: number | null, occupancy: number | null): number | null { if (capacity === null || occupancy === null || !Number.isFinite(capacity) || !Number.isFinite(occupancy) || capacity <= 0 || occupancy < 0 || occupancy > capacity) return null; return Math.round(occupancy / capacity * 100); }
export const unknown = (value: number | null) => value === null ? 'Chưa có dữ liệu' : value.toLocaleString('vi-VN');
export function mappable(items: Location[]) { return items.filter(item => item.mode === 'real' && item.verification.status === 'verified' && item.coordinates !== null); }
