'use client';
import { RoomType } from '../../types/roomDetail.type';
import { ApiResponse } from '../../types/propertyCategory.type';
import { getAuthToken } from '../../utils/auth.utils';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const getRoomTypeWithFacilitiesLowerPriceanndAvailability = async (
  roomTypeCode: string,
): Promise<ApiResponse<RoomType>> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ApiResponse<RoomType>>(
      `${BASE_URL}/room-detail/${roomTypeCode}/with-facilities-lowest-price-and-availability`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get room type details error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve room type details',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};
