// src/types/roomFacility.type.ts
export interface RoomFacilities {
  id: number;
  room_facility_name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomFacilityState {
  facilities: RoomFacilities[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
