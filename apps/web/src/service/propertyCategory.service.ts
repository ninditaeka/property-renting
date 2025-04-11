'use client';
import axios from 'axios';

import {
  PropertyCategory,
  ApiResponse,
} from '../../types/propertyCategory.type';
import { getAuthToken } from '../../utils/auth.utils';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const createPropertyCategory = async (
  categoryData: PropertyCategory,
): Promise<ApiResponse<PropertyCategory>> => {
  try {
    const token = getAuthToken();
    const response = await axios.post<ApiResponse<PropertyCategory>>(
      `${BASE_URL}/property-categories`,
      categoryData,
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
      console.error('Create property category error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to create property category',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getAllPropertyCategories = async (): Promise<
  ApiResponse<PropertyCategory[]>
> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ApiResponse<PropertyCategory[]>>(
      `${BASE_URL}/property-categories`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get all property categories error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message ||
          'Failed to retrieve property categories',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get a property category by code
export const getPropertyCategoryByCode = async (
  property_category_code: string,
): Promise<ApiResponse<PropertyCategory>> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ApiResponse<PropertyCategory>>(
      `${BASE_URL}/property-categories/${property_category_code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get property category by code error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve property category',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// Update a property category by code
export const updatePropertyCategoryByCode = async (
  property_category_code: string,
  categoryData: Partial<PropertyCategory>,
): Promise<ApiResponse<PropertyCategory>> => {
  try {
    const token = getAuthToken();
    const response = await axios.patch<ApiResponse<PropertyCategory>>(
      `${BASE_URL}/property-categories/${property_category_code}`,
      categoryData,
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
      console.error('Update property category error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to update property category',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// Delete a property category by code
export const deletePropertyCategoryByCode = async (
  property_category_code: string,
): Promise<ApiResponse<null>> => {
  try {
    const token = getAuthToken();
    const response = await axios.delete<ApiResponse<null>>(
      `${BASE_URL}/property-categories/${property_category_code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Delete property category error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to delete property category',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};
