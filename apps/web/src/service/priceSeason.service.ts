'use client';
import axios from 'axios';
import { getAuthToken } from '../../utils/auth.utils';
import { ApiResponse } from '../../types/propertyCategory.type';
import {
  PriceSeason,
  CreatePriceSeasonPayload,
} from '../../types/priceSeason.type';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000';

// Create price season

export const createPriceSeason = async (
  payload: CreatePriceSeasonPayload,
): Promise<ApiResponse<PriceSeason>> => {
  try {
    const token = getAuthToken();
    const response = await axios.post<ApiResponse<PriceSeason>>(
      `${BASE_URL}/price-seasons`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Create price season error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to create price season',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get all price seasons
export const getAllPriceSeasons = async (): Promise<
  ApiResponse<PriceSeason[]>
> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ApiResponse<PriceSeason[]>>(
      `${BASE_URL}/price-seasons`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get all price seasons error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve price seasons',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};
