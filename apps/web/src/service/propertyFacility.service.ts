'use client';
import axios from 'axios';

import { PropertyFacility } from '../../types/propertyFacility.type';

import { getAuthToken } from '../../utils/auth.utils';
import { ApiResponse } from '../../types/propertyCategory.type';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const getAllPropertyFacilities = async (): Promise<
  ApiResponse<PropertyFacility[]>
> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ApiResponse<PropertyFacility[]>>(
      `${BASE_URL}/property-facility`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get all property facilities error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message ||
          'Failed to retrieve property facilities',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};
