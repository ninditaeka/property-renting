'use client';

import axios from 'axios';
import { getAuthToken } from '../../utils/auth.utils';

import {
  PropertyWithRoomTypes,
  PropertyResponse,
  PropertyWithFacilities,
  PropertyWithDetails,
  PropertyWithAvailability,
} from '../../types/propertyDetail.type';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const fetchPropertyWithRoomTypes = async (
  propertyCode: string,
): Promise<PropertyWithDetails> => {
  const response = await axios.get<PropertyResponse<PropertyWithRoomTypes>>(
    `${BASE_URL}/property-detail/${propertyCode}/with-room-types`,
  );
  return response.data.data;
};

/**
 * Fetches a property with its facilities by property code
 */
export const fetchPropertyWithFacilities = async (
  propertyCode: string,
): Promise<PropertyWithDetails> => {
  const response = await axios.get<PropertyResponse<PropertyWithFacilities>>(
    `${BASE_URL}/property-detail/${propertyCode}/with-facilities`,
  );
  return response.data.data;
};

export const fetchPropertyDetailWithAvailability = async (
  propertyCode: string,
  checkInDate: string,
  checkOutDate: string,
): Promise<PropertyWithAvailability> => {
  const response = await axios.get<PropertyResponse<PropertyWithAvailability>>(
    `${BASE_URL}/property-detail/${propertyCode}/with-room-availability-lower-price`,
    {
      params: {
        'check-in': checkInDate,
        'check-out': checkOutDate,
      },
    },
  );
  return response.data.data;
};
