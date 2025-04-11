export interface CreateRoomRequest {
  property_id: number;
  room_type_id: number;
  room_number: string;
  room_type_price: string;
  description: string;
  room_facilities_ids: number[];
}
