import axios from 'axios';
import { getAuthToken } from '../../utils/auth.utils';
import {
  ApiResponse,
  BookingFormData,
  Booking,
  FormattedBooking,
  RoomPricing,
  AvailableRoom,
  LowestPriceRoom,
} from '../../types/booking.type';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000';

// Create a new booking
export const createBooking = async (
  bookingData: BookingFormData,
): Promise<ApiResponse<Booking>> => {
  try {
    const token = getAuthToken();
    const response = await axios.post<ApiResponse<Booking>>(
      `${BASE_URL}/bookings`,
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Create booking error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to create booking',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get bookings by user code
export const getBookingsByUserCode = async (
  userCode: string,
): Promise<ApiResponse<FormattedBooking[]>> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ApiResponse<FormattedBooking[]>>(
      `${BASE_URL}/bookings/${userCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get bookings error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve bookings',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get room pricing by date range and room type code
export const getRoomPricingByDateRange = async (
  roomTypeCode: string,
  startDate?: string,
  endDate?: string,
  roomNumber?: string,
): Promise<ApiResponse<RoomPricing[]>> => {
  try {
    const token = getAuthToken();
    let url = `${BASE_URL}/bookings/room-pricing/${roomTypeCode}`;

    // If room number is provided, add it to the URL path
    if (roomNumber) {
      url += `/${roomNumber}`;
    }

    // Add query parameters for date range if provided
    const params: Record<string, string> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await axios.get<ApiResponse<RoomPricing[]>>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get room pricing error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve room pricing',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get available room numbers for booking by room type code
export const getAvailableRoomNumbers = async (
  roomTypeCode: string,
  checkInDate?: string,
  checkOutDate?: string,
): Promise<ApiResponse<AvailableRoom[]>> => {
  try {
    const token = getAuthToken();

    // Using query parameters as shown in the controller
    const params: Record<string, string> = {
      roomTypeCode,
    };

    if (checkInDate) params.checkInDate = checkInDate;
    if (checkOutDate) params.checkOutDate = checkOutDate;

    const response = await axios.get<ApiResponse<AvailableRoom[]>>(
      `${BASE_URL}/bookings/selected-available-rooms`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get available rooms error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve available rooms',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// Get the lowest price room for a specific room type and date range
export const getLowestPriceRoom = async (
  roomTypeCode: string,
  checkInDate: string,
  checkOutDate: string,
): Promise<ApiResponse<LowestPriceRoom>> => {
  try {
    const token = getAuthToken();

    // Format dates to DD-MM-YYYY as expected by the backend
    const params: Record<string, string> = {
      'check-in': checkInDate,
      'check-out': checkOutDate,
    };

    const response = await axios.get<ApiResponse<LowestPriceRoom>>(
      `${BASE_URL}/bookings/selected-room-available-lowest-price/${roomTypeCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get lowest price room error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to retrieve lowest price room',
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// Format dates to DD-MM-YYYY format expected by the backend
export const formatDateToDDMMYYYY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper function to calculate total price based on room pricing data
// export const calculateTotalPrice = (
//   roomPricing: RoomPricing[],
//   roomCount: number = 1,
// ): number => {
//   if (!roomPricing || roomPricing.length === 0) return 0;

//   const totalPrice = roomPricing.reduce(
//     (sum, pricing) => sum + (pricing.price || 0),
//     0,
//   );

//   return totalPrice * roomCount;
// };

export const calculateTotalPrice = (roomPricing: RoomPricing[]): number => {
  if (!roomPricing || roomPricing.length === 0) return 0;

  // Sum only the price for each day in the date range
  return roomPricing.reduce((total: number, dayPrice: RoomPricing) => {
    // Use the price from the RoomPricing object
    const price = typeof dayPrice.price === 'number' ? dayPrice.price : 0;
    return total + price;
  }, 0);
};

// Helper function to extract property ID from the response
export const extractPropertyId = (data: any): number | null => {
  if (!data) return null;

  // First try to extract from the property_id field directly
  if (data.property_id) {
    const propertyId = parseInt(data.property_id);
    if (!isNaN(propertyId)) return propertyId;
  }

  return null;
};
