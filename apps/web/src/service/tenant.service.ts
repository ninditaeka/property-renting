import axios from 'axios';
import { getAuthToken } from '../../utils/auth.utils';
import {
  ApiResponse,
  Property,
  RoomInfo,
  PriceManagementItem,
  PriceManagementQueryParams,
} from '../../types/tenant.type';

// Define the BASE_URL
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000';

// API service functions
export const getPropertyByUserToken = async (): Promise<Property[]> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ApiResponse<Property[]>>(
      `${BASE_URL}/tenants/my-property`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const getAllRoomInfoByUserToken = async (): Promise<RoomInfo[]> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ApiResponse<RoomInfo[]>>(
      `${BASE_URL}/tenants/my-rooms`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching room information:', error);
    throw error;
  }
};

export const getPriceManagementDashboardByUserToken = async (
  params?: PriceManagementQueryParams,
): Promise<PriceManagementItem[]> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ApiResponse<PriceManagementItem[]>>(
      `${BASE_URL}/tenants/my-price`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      },
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching price management data:', error);
    throw error;
  }
};
