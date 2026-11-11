export type Category = 'parking' | 'study' | 'facility';
export type DataMode = 'real' | 'demo';
export interface Source { id: string; name: string; url: string | null; description: string }
export interface Verification { status: 'pending_verification' | 'verified' | 'rejected'; verifiedAt: string | null }
export interface Campus { id: string; name: string; status: 'active' | 'coming_soon'; viewCenter: [number, number] | null; sourceId: string | null }
export interface Location { id: string; campusId: string; name: string; description: string; category: Category; coordinates: { lat: number; lng: number } | null; verification: Verification; sourceId: string; updatedAt: string; mode: DataMode; operationalStatus: 'open' | 'closed' | null }
export interface Parking extends Location { capacity: number | null; occupancy: number | null }
