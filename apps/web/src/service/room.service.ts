'use client';
import axios from 'axios';

import { Room } from '../../types/propertyList.type';
import { ApiResponse } from '../../types/propertyCategory.type';
import { CreateRoomRequest } from '../../types/room.type';
import { getAuthToken } from '../../utils/auth.utils';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000';

export const createRoom = async (
  roomData: CreateRoomRequest,
): Promise<ApiResponse<Room>> => {
  try {
    const token = getAuthToken();
    const response = await axios.post<ApiResponse<Room>>(
      `${BASE_URL}/rooms`,
      roomData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Create room error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to create room');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getAllRooms = async (): Promise<ApiResponse<Room[]>> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ApiResponse<Room[]>>(`${BASE_URL}/rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get all rooms error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve rooms',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get a room by room number code
export const getRoomByRoomNumberCode = async (
  room_number_code: string,
): Promise<ApiResponse<Room>> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ApiResponse<Room>>(
      `${BASE_URL}/rooms/${room_number_code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get room by room number code error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve room',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// Update a room by room number code
export const updateRoomByRoomNumberCode = async (
  room_number_code: string,
  roomData: Partial<CreateRoomRequest>,
): Promise<ApiResponse<Room>> => {
  try {
    const token = getAuthToken();
    const response = await axios.patch<ApiResponse<Room>>(
      `${BASE_URL}/rooms/${room_number_code}`,
      roomData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Update room error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to update room');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// Delete a room by room number code
export const deleteRoomByRoomNumberCode = async (
  room_number_code: string,
): Promise<ApiResponse<null>> => {
  try {
    const token = getAuthToken();
    const response = await axios.delete<ApiResponse<null>>(
      `${BASE_URL}/rooms/${room_number_code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Delete room error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to delete room');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};
