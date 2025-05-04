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

export interface PropertyResponse {
  id: number;
  property_name: string;
  province: string;
  city: string;
  address: string;
  description: string;
  property_photo: string;
  property_code: string;
  property_category: {
    id: number;
    property_category_name: string;
    description: string | null;
  };
  room_types: Array<{
    id: number;
    room_type_name: string;
    description: string;
    room_type_price: number;
    quantity_room: number;
    room_photo: string;
    room_type_code: string;
    room_number: Array<{
      id: number;
      room_number: string;
      room_number_code: string;
    }>;
    room_type_having_facilities: Array<{
      room_facility: {
        id: number;
        room_facility_name: string;
      };
    }>;
  }>;
  property_having_facilities: Array<{
    property_facility: {
      id: number;
      property_facility_name: string;
    };
  }>;
}

export interface GetPropertyByUserCodeParams {
  userCode: string;
}
