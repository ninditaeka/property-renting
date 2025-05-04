// Add these interfaces to your existing types/propertyList.type.ts file
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}
export interface RoomFacility {
  id: number;
  name: string;
}

export interface RoomTypeFacility {
  id: number;
  name: string;
}

export interface RoomType {
  id: number;
  room_type_name: string;
  description: string;
  room_type_price: number | null;
  quantity_room: number;
  room_photo: string;
  room_type_code: string;
  property: RoomTypeProperty;
  facilities: RoomTypeFacility[];
  availability: RoomTypeAvailability;
  pricing_details: RoomTypePricing | { message: string };
}

export interface GetRoomTypeWithFacilitiesAndAvailability {
  (roomTypeCode: string): Promise<ApiResponse<RoomType>>;
}

export interface RoomTypeProperty {
  property_name: string;
  address: string;
  city: string;
  province: string;
  property_code: string;
}
export interface PropertyInfo {
  property_name: string;
  address: string;
  city: string;
  province: string;
  property_code: string;
}

export interface RoomTypeAvailability {
  total_quantity: number;
  total_bookings: number;
  current_status: {
    date: string;
    occupied_rooms: number;
    available_rooms: number;
    is_available: boolean;
  };
  future_bookings: {
    check_in_date: string;
    check_out_date: string;
  }[];
}
export interface AvailabilityStatus {
  date: Date;
  occupied_rooms: number;
  available_rooms: number;
  is_available: boolean;
}

export interface FutureBooking {
  check_in_date: Date;
  check_out_date: Date;
}

export interface Availability {
  total_quantity: number;
  total_bookings: number;
  current_status: AvailabilityStatus;
  future_bookings: FutureBooking[];
}

export interface RoomTypePricing {
  current_best_price: number;
  standard_price: number;
  has_promotion: boolean;
  promotion_details: {
    standard_price: number;
    promotional_price: number;
    discount_type: string;
    discount_amount: number;
    sale_name: string;
    room_number: string;
    promotion_period: {
      starts: string;
      ends: string;
    };
  } | null;
}
