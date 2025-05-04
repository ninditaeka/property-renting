import axios from 'axios';
import { getAuthToken } from '../../utils/auth.utils';
import {
  CreatePropertyRequest,
  PropertiesResponse,
  PropertyResponse,
  SinglePropertyResponse,
} from '../../types/propertyList.type';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Get all properties
export const getAllProperties = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get<PropertiesResponse>(
      `${BASE_URL}/property-lists`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all properties:', error);
    throw error;
  }
};

// Get property by property code
export const getPropertyByCode = async (property_code: string) => {
  try {
    const token = getAuthToken();
    const response = await axios.get<SinglePropertyResponse>(
      `${BASE_URL}/property-lists/${property_code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching property with code ${property_code}:`, error);
    throw error;
  }
};

// Create new property
export const createProperty = async (propertyData: CreatePropertyRequest) => {
  try {
    const token = getAuthToken();
    console.log('base url:', BASE_URL);
    const response = await axios.post<SinglePropertyResponse>(
      `${BASE_URL}/property-lists`,
      propertyData,

      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

// Update property
// export const updateProperty = async (
//   propertyCode: string,
//   propertyData: Partial<CreatePropertyRequest>,
// ) => {
//   try {
//     const token = getAuthToken();
//     const response = await axios.patch<SinglePropertyResponse>(
//       `${BASE_URL}/property-lists/${propertyCode}`,
//       propertyData,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating property with code ${propertyCode}:`, error);
//     throw error;
//   }
// };
// Update property
export const updateProperty = async (
  propertyCode: string,
  propertyData: Partial<CreatePropertyRequest>,
) => {
  try {
    const token = getAuthToken();

    // Ensure room_types have their IDs properly included
    if (propertyData.room_types) {
      propertyData.room_types = propertyData.room_types.map((roomType) => {
        // If roomType has an id property already, return it unchanged
        if ('id' in roomType) {
          return roomType;
        }

        // If it's an existing room type but id is missing, try to find it
        // This is assuming there's some way to identify which room types already exist
        // You might need to adjust this logic based on how your data is structured
        return { ...roomType, id: null }; // Explicitly set id to null for new room types
      });
    }

    const response = await axios.patch<SinglePropertyResponse>(
      `${BASE_URL}/property-lists/${propertyCode}`,
      propertyData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating property with code ${propertyCode}:`, error);
    throw error;
  }
};
// Delete property
export const deletePropertyByCode = async (property_code: string) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete<{
      status: string;
      message: string;
      property_code: string;
    }>(`${BASE_URL}/property-lists/${property_code}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting property with code ${property_code}:`, error);
    throw error;
  }
};

// Get properties by city
export const getPropertiesByCity = async (city: string) => {
  try {
    const response = await axios.get<PropertiesResponse>(
      `${BASE_URL}/property-lists/city?city=${city}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching properties for city ${city}:`, error);
    throw error;
  }
};

// Get available room types by property code
export const getAvailableRoomTypes = async (propertyCode: string) => {
  try {
    const response = await axios.get<PropertyResponse>(
      `${BASE_URL}/property-lists/available-room-types?property_code=${propertyCode}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching available room types for property ${propertyCode}:`,
      error,
    );
    throw error;
  }
};

// Get properties by search criteria (city, check-in, check-out, rooms)
export const getPropertyListBySearch = async (searchParams: {
  city: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
}) => {
  try {
    const { city, checkIn, checkOut, rooms } = searchParams;
    const response = await axios.get(
      `${BASE_URL}/property-lists/search?city=${city}&check-in=${checkIn}&check-out=${checkOut}&rooms=${rooms}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching properties by search criteria:', error);
    throw error;
  }
};
