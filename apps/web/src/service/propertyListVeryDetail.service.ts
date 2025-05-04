// src/services/property.service.ts
'use client';
import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  PropertyListResponse,
} from '../../types/propertyListVeryDetail.type';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000';

interface PropertyListParams {
  city: string;
  checkIn: string;
  checkOut: string;
  rooms?: number;
}

interface Property {
  id: number;
  property_name: string;
  city: string;
  address: string;
  property_description: string;
  facilities: string;
  total_rooms: number;
  booked_rooms: number;
  availability_status: 'available' | 'unavailable';
  lowest_price: number | null;
}

export const getPropertyListVeryDetail = async (
  params: PropertyListParams,
): Promise<ApiResponse<PropertyListResponse>> => {
  console.log('masuk1');
  try {
    const { city, checkIn, checkOut, rooms = 1 } = params;

    const response = await axios.get<ApiResponse<PropertyListResponse>>(
      `${BASE_URL}/property-list-very-detail`,
      {
        params: {
          city,
          'check-in': checkIn,
          'check-out': checkOut,
          rooms,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log('masuk2');
    if (axios.isAxiosError(error)) {
      console.error('Get property list error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve property list',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getSortedPropertyList = async (
  params: PropertyListParams,
  sortBy: string,
  sortOrder: string,
): Promise<ApiResponse<PropertyListResponse>> => {
  try {
    const { city, checkIn, checkOut, rooms = 1 } = params;

    const response = await axios.get<ApiResponse<PropertyListResponse>>(
      `${BASE_URL}/property-list-very-detail`,
      {
        params: {
          city,
          'check-in': checkIn,
          'check-out': checkOut,
          rooms,
          sortBy,
          sortOrder,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get sorted property list error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message ||
          'Failed to retrieve sorted property list',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};
