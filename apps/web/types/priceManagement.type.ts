// src/types/priceManagement.type.ts
export interface PriceManagementData {
  price_id: number | string;
  price_history_code: string;
  property_name: string; // Property name is included here
  property_code: string;
  room_number: string;
  room_number_id: string;
  room_number_code: string;
  room_type_name: string;
  room_type_code: string;
  base_price: number;
  name_of_sale: string;
  discount_type: string;
  discount_amount: number;
  final_price: number;
  start_date: string | '';
  end_date: string | '';
  created_at: string;
}

export interface PriceFilters {
  property_id?: number;
  property_code?: string;
  room_type_id?: number;
  room_type_code?: string;
  room_number_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface RoomNumberData {
  room_number: string;
  room_number_code: string;
  id: number | string;
}

export interface RoomNumberState {
  data: RoomNumberData[];
  loading: boolean;
  error: string | null;
}

export interface PriceManagementState {
  data: PriceManagementData[]; // Ensure this is always an array
  loading: boolean;
  error: string | null;
}
