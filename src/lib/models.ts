export type Category = 'parking' | 'study' | 'facility';
export type DataMode = 'real' | 'demo';
export interface Source { id: string; name: string; url: string | null; description: string }
export interface Verification { status: 'pending_verification' | 'source_verified' | 'field_verified' | 'rejected'; verifiedAt: string | null; method?: 'public_source' | 'field_survey'; reviewer?: string }
export interface Campus { id: string; name: string; status: 'active' | 'coming_soon'; viewCenter: [number, number] | null; sourceId: string | null }
export interface Coordinates { lat: number; lng: number }
export interface Location { id: string; campusId: string; name: string; description: string; category: Category; coordinates: Coordinates | null; verification: Verification; sourceId: string; updatedAt: string; mode: DataMode; coordinateRole?: 'representative' | 'survey_point' | 'shared_gate'; operationalStatus: 'open' | 'closed' | null }
// A representative point must never be treated as an entrance. Null/absent means unknown.
export interface Parking extends Location { entranceCoordinates?: Coordinates | null; capacity: number | null; occupancy: number | null }

export interface HomiesDetails {
  kind: 'homies'; observedAt: string | null; reportedAt: string;
  seatingObserved: number; officialMaximumCapacity: number | null; feeVnd: number; access: string;
  schedule: {validity: 'pending_confirmation'; sourceId: string; staff: string[]; students: string[]; approvedGroups: string[]};
  amenities: Record<string, boolean | null>;
}
export interface B2ParkingDetails {
  kind: 'parking'; observedAt: string | null; reportedAt: string;
  operationalCapacityApprox: number; historicalCapacityApprox: number; historicalSourceId: string;
  reportedDifferenceApprox: number; differenceExplanation: string;
  observedMotorcycles: {min: number; max: number; approximate: boolean}; observedStatus: string;
  feePerEntryVnd: number; gateShared: boolean; entryProcess: string; exitProcess: string; cameraProcess: string;
  systemAvailableCount: number | null; realTimeOccupancy: number | null; provider: string | null;
}
export type B2Place = (Location & {details: HomiesDetails}) | (Parking & {details: B2ParkingDetails});
