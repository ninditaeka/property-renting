import { RoomType } from './propertyList.type';

export interface PropertyResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface PropertyCategory {
  id: string;
  name: string;
  description?: string;
}

export interface RoomNumber {
  id: string;
  room_number: string;
  room_type_id: string;
}

export interface PropertyFacility {
  id: string;
  name: string;
  facilityRelationId: string;
}

export interface Property {
  id: string;
  property_code: string;
  property_name: string;
  property_photo: string;
  description?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zip_code?: string;
  user_id: string;
  property_category_id: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  user: User;
  property_category: PropertyCategory;
}

export interface PropertyWithRoomTypes extends Property {
  room_types: RoomType[];
}

export interface PropertyWithFacilities extends Property {
  facilities: PropertyFacility[];
}

export interface PropertyWithDetails extends Property {
  room_types?: RoomType[];
  facilities?: PropertyFacility[];
}

// New interface for room details with availability information
export interface RoomDetail {
  room_type_id: string;
  room_type_name: string;
  description: string;
  room_type_price: number;
  quantity_room: number;
  room_photo: string;
  property_id: string;
  room_facilities: string;
}

// New interface for property availability details
export interface PropertyWithAvailability {
  property_details: {
    id: string;
    property_name: string;
    property_facilities: string;
    total_rooms: number;
    booked_rooms: number;
    availability_status: 'available' | 'fullbooked' | 'unavailable';
    lowest_price: number | null;
  };
  room_details: RoomDetail[];
}
