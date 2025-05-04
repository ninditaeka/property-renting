export interface CreateRoomRequest {
  property_id?: number | string;
  room_type_id?: number | string;
  room_number: string;
  room_facilities_ids: number[];
}
