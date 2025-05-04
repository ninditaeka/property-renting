import { PropertyFacility } from './propertyFacility.type';

export interface PropertyHavingFacility {
  id: number;
  property_id: number;
  property_facility_id: number;
  deleted: boolean;
  property_facility: {
    id: number;
    property_facility_name: string;
    createdAt?: string;
  };
}
export interface RoomFacility {
  id: number;
  room_facility_name: string;
}

export interface RoomTypeHavingFacility {
  id: number;
  room_type_id: number;
  room_facility_id: number;
  room_facility: RoomFacility;
  deleted?: boolean;
}

export interface RoomType {
  id: number;
  room_type_code: string;
  room_type_name: string;
  description: string;
  room_type_price: number;
  quantity_room: number;
  room_photo: string;
  property_id: number;
  deleted?: boolean;
  room_type_having_facilities?: RoomTypeHavingFacility[];
  room_number?: RoomNumber[];
  available_rooms?: number;
  is_available?: boolean;
}

export interface RoomNumber {
  id: number;
  room_number: string;
  room_type_id: number;
  property_id: number;
  deleted?: boolean;
  property_price_history?: PropertyPriceHistory[];
}

export interface PropertyPriceHistory {
  id: number;
  name_of_sale: string;
  discount_type: string;
  discount_amount: number;
  finall_price: number;
  start_date: Date;
  end_date: Date;
  room_number_id: number;
}

export interface PromotionDetails {
  name: string;
  discountType: string;
  discountAmount: number;
  roomNumber: string;
  roomType: string;
  startDate: Date;
  endDate: Date;
}
export interface PropertyFacilitiesResponse {
  status: string;
  message: string;
  data: PropertyFacility[];
}
export interface Property {
  id: number;
  property_code: string;
  property_name: string;
  province: string;
  city: string;
  address: string;
  description: string;
  property_photo: string;
  property_category_id: number;
  created_by: number;
  lowest_price?: number;
  price_source?: string;
  promotion_details?: PromotionDetails | null;
  deleted?: boolean;
  createdAt?: Date;
  room_types?: string | RoomType[];
  property_having_facilities?: PropertyHavingFacility[];
  room_types_count?: number;
  facilities?: { id: number; name: string }[];
}

export interface CreatePropertyRequest {
  property_name: string;
  province: string;
  city: string;
  address: string;
  description: string;
  property_photo?: string;
  property_category_id: number;
  // property_facility_ids: number[];
  property_having_facilities?: PropertyFacility[];
  room_types?: {
    room_type_name: string;
    description: string;
    room_type_price: number;
    quantity_room: number;
    room_photo: string;
  }[];
}

export interface CreatePropertyRequestFirst {
  property_name: string;
  province: string;
  city: string;
  address: string;
  description: string;
  property_photo?: string;
  property_category_id: number;
  property_facility_ids: number[];
  room_types?: {
    room_type_name: string;
    description: string;
    room_type_price: number;
    quantity_room: number;
    room_photo: string;
  }[];
}

export interface PropertyState {
  properties: Property[];
  property: Property | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Response types
export interface PropertyResponse {
  success: boolean;
  message?: string;
  property?: {
    id: number;
    property_name: string;
    property_code: string;
    address: string;
    city: string;
    province: string;
  };
  available_room_types?: (RoomType & {
    available_rooms: number;
    is_available: boolean;
  })[];
  error?: string;
}

export interface PropertiesResponse {
  success: boolean;
  count?: number;
  data: Property[];
  message?: string;
  error?: string;
}

export interface PropertyCategoryResponse {
  status: string;
  data: any;
  message?: string;
}

export interface SinglePropertyResponse {
  status: string;
  data: Property;
  message?: string;
}

export interface PreparedRoom extends Room {
  photoBase64?: string;
}

export interface Room {
  name: string;
  description: string;
  price: string;
  quantity: string;
  room_photo?: string;
  room_type_code: string;
  property_name?: string;
  room_type?: string;
  room_number?: string;
  facility?: string;
  property_id: number;
}
