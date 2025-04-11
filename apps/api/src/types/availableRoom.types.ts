import { Property, RoomType, RoomFacility } from '@prisma/client';

// Room number interface
export interface RoomNumberType {
  id: number;
  room_number: string;
  room_type_id: number;
  deleted: boolean;
  room_number_code: string;
}

// Room type with relations interface
export interface RoomTypeWithRelations extends RoomType {
  room_type_having_facilities: {
    room_facility: RoomFacility;
  }[];
  room_number: RoomNumberType[];
  available_rooms?: number;
  is_available?: boolean;
}

// Property with room types interface
export interface PropertyWithRoomTypes extends Property {
  room_types: RoomTypeWithRelations[];
}

// Response structure interface
export interface PropertyResponse {
  success: boolean;
  property?: {
    id: number;
    property_name: string;
    property_code: string;
    address: string;
    city: string;
    province: string;
  };
  available_room_types?: RoomTypeWithRelations[];
  message?: string;
  error?: string;
}
