import type { Parking } from './models';
export type ParkingState = 'unknown' | 'available' | 'crowded' | 'full';
export type ParkingEvent = 'entry' | 'exit';
export function isSimulated(lot: Parking): boolean {
  return lot.mode === 'demo' && lot.coordinates === null && lot.entranceCoordinates == null && lot.capacity !== null && lot.occupancy !== null && Number.isInteger(lot.capacity) && Number.isInteger(lot.occupancy) && lot.capacity > 0 && lot.occupancy >= 0 && lot.occupancy <= lot.capacity;
}
export function availableCount(lot: Parking): number | null {
  return isSimulated(lot) ? lot.capacity! - lot.occupancy! : null;
}
export function parkingState(lot: Parking): ParkingState {
  const available = availableCount(lot);
  if (available === null) return 'unknown';
  if (available === 0) return 'full';
  return lot.occupancy! / lot.capacity! >= 0.8 ? 'crowded' : 'available';
}
export type RejectionReason = 'not_found' | 'real_record' | 'invalid_lot' | 'full' | 'empty';
export type SimulationResult = {lots: Parking[]; accepted: true} | {lots: Parking[]; accepted: false; reason: RejectionReason};
export function resetSimulation(seed: Parking[]): Parking[] {
  return seed.map(lot=>({...lot,verification:{...lot.verification}}));
}
export function simulateEvent(lots: Parking[], id: string, event: ParkingEvent): SimulationResult {
  const lot = lots.find(candidate=>candidate.id===id);
  if (!lot) return {lots,accepted:false,reason:'not_found'};
  if (lot.mode !== 'demo') return {lots,accepted:false,reason:'real_record'};
  if (!isSimulated(lot)) return {lots,accepted:false,reason:'invalid_lot'};
  if (event === 'entry' && lot.occupancy === lot.capacity) return {lots,accepted:false,reason:'full'};
  if (event === 'exit' && lot.occupancy === 0) return {lots,accepted:false,reason:'empty'};
  const occupancy = lot.occupancy! + (event === 'entry' ? 1 : -1);
  return {lots:lots.map(candidate=>candidate===lot?{...lot,occupancy}:candidate),accepted:true};
}
export function recommendAlternatives(lots: Parking[], selectedId: string): Parking[] {
  const selected = lots.find(lot => lot.id === selectedId);
  if (!selected || parkingState(selected) !== 'full') return [];
  return lots.filter(lot => lot.id !== selectedId && isSimulated(lot) && availableCount(lot)! > 0)
    .sort((a,b) => availableCount(b)! - availableCount(a)! || a.id.localeCompare(b.id));
}
