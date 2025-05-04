// // Updated booking.type.ts
// export interface ApiResponse<T> {
//   status: string;
//   message?: string;
//   data: T;
//   error?: string;
// }

// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   user_code: string;
// }

// export interface Booking {
//   id: number;
//   full_name: string;
//   phone_number: string;
//   property_id: number;
//   room_type_id: number;
//   user_id: number;
//   room_number_booking: number;
//   'check-in': string;
//   'check-out': string;
//   quantity_person: number;
//   total_price: number;
//   created_at?: string;
//   updated_at?: string;
// }

// export interface BookingFormData {
//   full_name: string;
//   phone_number: string;
//   property_id: number;
//   room_type_id: number;
//   room_number_booking: number;
//   'check-in': string;
//   'check-out': string;
//   total_price: number;
// }

// export interface FormattedBooking {
//   name: string;
//   property_name: string;
//   room_type_name: string;
//   room_number_booking: number;
//   'check-in': string;
//   'check-out': string;
// }

// export interface RoomPricing {
//   property_name: string;
//   room_type_name: string;
//   room_number: string;
//   stay_date: string;
//   price: number;
//   price_type: 'Default Price' | 'Special Price';
//   property_id?: number;
// }

// export interface AvailableRoom {
//   room_number: string;
//   room_type_id: number;
//   room_type_name: string;
//   property_id: number;
// }

// export interface LowestPriceRoom {
//   room_number: string;
//   price: number;
//   room_type_id: number;
//   room_type_name: string;
//   property_name?: string;
//   total_price?: string;
//   property_id?: number;
// }

// export interface BookingState {
//   selectedRoomType: {
//     id: number;
//     code: string;
//     name: string;
//   } | null;
//   selectedDates: {
//     'check-in': string | null;
//     'check-out': string | null;
//   };
//   selectedRoom: AvailableRoom | null;
//   guestDetails: {
//     fullName: string;
//     phoneNumber: string;
//     quantityPerson: number;
//   };
// }
// Updated booking.type.ts
export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
  error?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  user_code: string;
}

export interface Booking {
  id: number;
  full_name: string;
  phone_number: string;
  property_id: number;
  room_type_id: number;
  user_id: number;
  room_number_booking: number;
  'check-in': string;
  'check-out': string;
  quantity_person: number;
  total_price: number;
  created_at?: string;
  updated_at?: string;
}

export interface BookingFormData {
  full_name: string;
  phone_number: string;
  property_id: number;
  room_type_id: number;
  room_number_booking: number;
  'check-in': string;
  'check-out': string;
  total_price: number;
}

export interface FormattedBooking {
  name: string;
  property_name: string;
  room_type_name: string;
  room_number_booking: number;
  'check-in': string;
  'check-out': string;
}

export interface RoomPricing {
  property_name: string;
  room_type_name: string;
  room_number: string;
  stay_date: string;
  price: number;
  price_type: 'Default Price' | 'Special Price';
  property_id?: number;
}

export interface AvailableRoom {
  room_number: string;
  room_type_id: number;
  room_type_name: string;
  property_id: number;
}

export interface LowestPriceRoom {
  room_number: string;
  price: number;
  room_type_id: number;
  room_type_name: string;
  property_name?: string;
  total_price?: string;
  property_id?: number;
}

export interface BookingState {
  selectedRoomType: {
    id: number;
    code: string;
    name: string;
  } | null;
  selectedDates: {
    'check-in': string | null;
    'check-out': string | null;
  };
  selectedRoom: AvailableRoom | null;
  guestDetails: {
    fullName: string;
    phoneNumber: string;
    quantityPerson: number;
  };
}

// Added types for sorting and filtering functionality
export interface SortState {
  column: keyof Booking | null;
  direction: 'asc' | 'desc' | null;
}

export interface FilterState {
  name?: string;
  property?: string;
}

export interface DateRangeState {
  from: Date | null;
  to: Date | null;
}
