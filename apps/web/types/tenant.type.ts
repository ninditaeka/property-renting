// Define interfaces for API responses
export interface PropertyFacility {
  id: number;
  property_facility_name: string;
}

export interface RoomFacility {
  id: number;
  room_facility_name: string;
}

export interface RoomNumber {
  id: number;
  room_number: string;
  room_number_code: string;
}

export interface RoomTypeHavingFacility {
  room_facility: RoomFacility;
}

export interface RoomType {
  id: number;
  room_type_name: string;
  description: string;
  room_type_price: number;
  quantity_room: number;
  room_photo: string;
  room_type_code: string;
  room_number: RoomNumber[];
  room_type_having_facilities: RoomTypeHavingFacility[];
}

export interface PropertyCategory {
  id: number;
  property_category_name: string;
  description: string;
}

export interface PropertyHavingFacility {
  property_facility: PropertyFacility;
}

export interface Property {
  id: number;
  property_name: string;
  property_code: string;
  property_photo: string;
  address: string;
  city: string;
  province: string;
  property_category: PropertyCategory;
  room_types: RoomType[];
  property_having_facilities: PropertyHavingFacility[];
}

export interface RoomInfo {
  room_number_id: number;
  room_number: string;
  room_number_code: string;
  room_type: {
    id: number;
    room_type_name: string;
    room_type_price: number;
    room_photo: string;
    description: string;
  };
  property: {
    id: number;
    property_name: string;
    property_code: string;
    property_photo: string;
    address: string;
    city: string;
    province: string;
  };
}

export interface PriceManagementItem {
  price_id: number;
  price_history_code: string;
  user_code: string;
  user_name: string;
  property_name: string;
  property_code: string;
  room_number: string;
  room_number_code: string;
  room_type_name: string;
  room_type_code: string;
  base_price: number;
  name_of_sale: string;
  discount_type: string;
  discount_amount: number;
  final_price: number;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
export interface PriceManagementQueryParams {
  property_id?: number;
  property_code?: string;
  room_type_id?: number;
  room_type_code?: string;
  room_number_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface TenantState {
  properties: {
    items: Property[];
    isLoading: boolean;
    error: string | null;
    selectedProperty: Property | null;
  };
  rooms: {
    items: RoomInfo[];
    isLoading: boolean;
    error: string | null;
    selectedRoom: RoomInfo | null;
  };
  priceManagement: {
    items: PriceManagementItem[];
    isLoading: boolean;
    error: string | null;
    filters: PriceManagementQueryParams;
  };
}
