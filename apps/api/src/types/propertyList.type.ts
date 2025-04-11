export interface RoomTypeInput {
  room_type_name: string;
  description: string;
  room_type_price: number;
  quantity_room: number;
  room_photo: string;
}

export interface CreatePropertyRequest {
  property_name: string;
  province: string;
  city: string;
  address: string;
  description: string;
  property_photo: string;
  property_category_id: number;
  property_facility_ids: number[];
  room_types: RoomTypeInput[];
}

export interface CreateRoomRequest {
  property_id: number;
  room_type_id: number;
  property_name: string;
  room_type: string;
  price: number;
  room_number: string;
  room_facilities_ids: number[];
  description: string;
}
