import axios from 'axios';
import { getAuthToken } from '../../utils/auth.utils';
import { RoomInfo } from '../../types/roomInfo.type';

// Define the BASE_URL
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000';

export const getAllRoomInfo = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get<RoomInfo[]>(`${BASE_URL}/room-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching room information:', error);
    throw error;
  }
};
