export interface RoomNumber {
  id: number;
  room_number: string;
  room_number_code: string;
  room_type: {
    room_type_price: number;
    room_type_name: string;
  };
  base_price: number;
}

export interface PriceSeason {
  id: number;
  property_id: number;
  room_numbers_id: number;
  name_of_sale: string;
  start_date: string;
  end_date: string;
  discount_type: 'nominal' | 'percentage';
  discount_amount: number;
  finall_price: number;
  createdAt?: string;
  updatedAt?: string;
  property?: {
    property_name: string;
    property_code: string;
  };
  room_numbers?: {
    room_number: string;
    room_number_code: string;
    room_type: {
      room_type_name: string;
      room_type_price: number;
    };
  };
}

export interface CreatePriceSeasonPayload {
  property_id?: any;
  room_numbers_id?: any;
  name_of_sale: string;
  start_date: string;
  end_date: string;
  discount_type: 'nominal' | 'percentage';
  discount_amount?: number;
  finall_price?: number;
}
