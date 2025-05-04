import { PropertyState } from './propertyList.type';
import { RoomFacilityState } from './roomFacility.type';

// src/types/roomManagement.types.ts
export interface RoomFacility {
  id: string;
  facility_name: string;
  facility_description?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomTypeHavingFacility {
  id: string;
  room_type_id: string;
  room_facility_id: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  room_facility: RoomFacility;
}

export interface RoomNumber {
  id: string;
  room_number: string;
  room_type_id: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomType {
  id: string;
  property_id: string;
  room_type_name: string;
  room_type_code: string;
  room_type_price: number;
  room_size?: number;
  description?: string;
  quantity_room?: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  room_type_having_facilities: RoomTypeHavingFacility[];
  room_number: RoomNumber[];
}

export interface PriceHistory {
  id: string;
  startDate: string;
  endDate: string | null;
  roomNumberId: string;
  saleName?: string;
  discountType?: string;
  discountAmount?: number;
  finalPrice: number;
  propertyPriceHistoryCode: string;
}

export interface PriceInfo {
  roomTypeId: string;
  roomTypeName: string;
  roomTypeCode: string;
  basePrice: number;
  availableRooms: number;
  priceHistories: PriceHistory[];
}

export interface RoomsState {
  loading: boolean;
  success: boolean;
  error: string | null; // Adjust based on your error type
}

export interface RoomManagementState {
  roomTypes: RoomType[]; // Array of RoomType
  priceInfo: PriceInfo[]; // Array of PriceInfo
}
export interface RootState {
  property: PropertyState;
  roomManagement: RoomManagementState;
  roomFacilities: RoomFacilityState;
  rooms: RoomsState;
}

export interface RoomDetail {
  room_number: string;
  room_number_code: string;
  room_type: {
    id: string;
    name: string;
    price: number;
    description: string;
    photo: string;
  };
  property: {
    id: string;
    name: string;
    property_code: string;
    address: string;
    city: string;
    province: string;
  };
}
