export type Category = 'parking' | 'study' | 'facility';
export type DataMode = 'real' | 'demo';
export interface Source { id: string; name: string; url: string | null; description: string }
export interface Verification { status: 'pending_verification' | 'source_verified' | 'field_verified' | 'rejected'; verifiedAt: string | null; method?: 'public_source' | 'field_survey'; reviewer?: string }
export interface Campus { id: string; name: string; status: 'active' | 'coming_soon'; viewCenter: [number, number] | null; sourceId: string | null }
export interface Coordinates { lat: number; lng: number }
export interface Location { id: string; campusId: string; name: string; description: string; category: Category; coordinates: Coordinates | null; verification: Verification; sourceId: string; updatedAt: string; mode: DataMode; operationalStatus: 'open' | 'closed' | null }
// A representative point must never be treated as an entrance. Null/absent means unknown.
export interface Parking extends Location { entranceCoordinates?: Coordinates | null; capacity: number | null; occupancy: number | null }
