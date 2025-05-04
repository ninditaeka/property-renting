import { RoomType } from './propertyList.type';
import { Property } from './propertyList.type';

export interface RoomInfo {
  room_number_id: number | string;
  room_number: string;
  room_number_code: string;
  room_type: RoomType;
  property: Property;
}

export interface RoomInfoState {
  rooms: RoomInfo[];
  selectedRoom: RoomInfo | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface RoomInfoResponse {
  data: RoomInfo[];
  message?: string;
}

export interface SingleRoomResponse {
  data: RoomInfo;
  message?: string;
}

export interface RoomState {
  rooms: RoomInfo[];
  selectedRoom: RoomInfo | null;
  isLoading: boolean;
  error: string | null;
}
