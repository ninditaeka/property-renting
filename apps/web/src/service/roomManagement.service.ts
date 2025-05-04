// src/services/roomManagement.service.ts
'use client';
import axios from 'axios';
import { getAuthToken } from '../../utils/auth.utils';
import { ApiResponse } from '../../types/propertyCategory.type';
import {
  RoomType,
  PriceInfo,
  RoomDetail,
} from '../../types/roomManagement.type';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000';

export const getRoomTypesByProperty = async (
  propertyCode: string,
): Promise<ApiResponse<RoomType[]>> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ApiResponse<RoomType[]>>(
      `${BASE_URL}/room-management/property/${propertyCode}/room-types`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get room types error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve room types',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getPricesByRoomType = async (
  roomTypeCode: string,
  checkInDate?: string,
  checkOutDate?: string,
): Promise<ApiResponse<PriceInfo>> => {
  try {
    const token = getAuthToken();
    let url = `${BASE_URL}/room-management/room-type/${roomTypeCode}/prices`;

    // Add query parameters if dates are provided
    if (checkInDate && checkOutDate) {
      url += `?check_in_date=${checkInDate}&check_out_date=${checkOutDate}`;
    }

    const response = await axios.get<ApiResponse<PriceInfo>>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get room prices error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve price information',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getRoomDetailByRoomNumberCode = async (
  roomNumberCode: string,
): Promise<ApiResponse<RoomDetail>> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ApiResponse<RoomDetail>>(
      `${BASE_URL}/rooms/${roomNumberCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get room detail error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve room detail',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};
