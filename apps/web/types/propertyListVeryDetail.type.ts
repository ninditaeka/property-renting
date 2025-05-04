export interface Property {
  id: number;
  property_name: string;
  city: string;
  address: string;
  property_description: string;
  facilities: string;
  total_rooms: number;
  booked_rooms: number;
  availability_status: 'available' | 'unavailable' | 'fullbooked';
  lowest_price: number | null;
}

export interface PropertyFilters {
  city: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
}

export interface PropertyListResponse {
  properties: Property[];
  filters: PropertyFilters;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
