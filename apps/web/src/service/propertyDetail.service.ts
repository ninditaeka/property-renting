'use client';

import axios from 'axios';
import { getAuthToken } from '../../utils/auth.utils';

import {
  PropertyWithRoomTypes,
  PropertyResponse,
  PropertyWithFacilities,
} from '../../types/propertyDetail.type';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const fetchPropertyWithRoomTypes = async (
  propertyCode: string,
): Promise<PropertyWithRoomTypes> => {
  const response = await axios.get<PropertyResponse<PropertyWithRoomTypes>>(
    `${BASE_URL}/properties/${propertyCode}/room-types`,
  );
  return response.data.data;
};

/**
 * Fetches a property with its facilities by property code
 */
export const fetchPropertyWithFacilities = async (
  propertyCode: string,
): Promise<PropertyWithFacilities> => {
  const response = await axios.get<PropertyResponse<PropertyWithFacilities>>(
    `${BASE_URL}/properties/${propertyCode}/facilities`,
  );
  return response.data.data;
};
