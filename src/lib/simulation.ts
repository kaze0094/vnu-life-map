import type { Parking } from './models';
export type ParkingState = 'unknown' | 'available' | 'crowded' | 'full';
export type ParkingEvent = 'entry' | 'exit';
export function isSimulated(lot: Parking): boolean {
  return lot.mode === 'demo' && lot.coordinates === null && lot.capacity !== null && lot.occupancy !== null && Number.isInteger(lot.capacity) && Number.isInteger(lot.occupancy) && lot.capacity > 0 && lot.occupancy >= 0 && lot.occupancy <= lot.capacity;
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
export function simulateEvent(lots: Parking[], id: string, event: ParkingEvent): Parking[] {
  return lots.map(lot => {
    if (lot.id !== id || !isSimulated(lot)) return lot;
    const count = lot.occupancy! + (event === 'entry' ? 1 : -1);
    if (count < 0 || count > lot.capacity!) return lot;
    return {...lot, occupancy: count};
  });
}
export function recommendAlternatives(lots: Parking[], selectedId: string): Parking[] {
  const selected = lots.find(lot => lot.id === selectedId);
  if (!selected || parkingState(selected) !== 'full') return [];
  return lots.filter(lot => lot.id !== selectedId && isSimulated(lot) && availableCount(lot)! > 0)
    .sort((a,b) => availableCount(b)! - availableCount(a)! || a.id.localeCompare(b.id));
}
