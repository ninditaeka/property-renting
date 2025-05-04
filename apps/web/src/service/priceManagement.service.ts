// src/services/priceManagement.service.ts
'use client';
import axios from 'axios';
import { getAuthToken } from '../../utils/auth.utils';
import { ApiResponse } from '../../types/propertyCategory.type';
import { PriceManagementData } from '../../types/priceManagement.type';
import { RoomNumberData } from '../../types/priceManagement.type';
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const getPriceManagement = async (
  filters: {
    property_id?: number;
    property_code?: string;
    room_type_id?: number;
    room_type_code?: string;
    room_number_id?: number;
    start_date?: string;
    end_date?: string;
  } = {},
): Promise<ApiResponse<PriceManagementData[]>> => {
  try {
    const token = getAuthToken();

    // Construct the URL with query parameters
    const url = `${BASE_URL}/price-management`;

    const response = await axios.get<ApiResponse<PriceManagementData[]>>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get price management data error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message ||
          'Failed to retrieve price management data',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getRoomNumbersByRoomType = async (
  roomTypeCode: string,
): Promise<ApiResponse<RoomNumberData[]>> => {
  try {
    const token = getAuthToken();

    const url = `${BASE_URL}/price-management/room-type/${roomTypeCode}`;

    const response = await axios.get<ApiResponse<RoomNumberData[]>>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get room numbers error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve room numbers',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};
