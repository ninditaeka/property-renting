import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getPriceManagement,
  getRoomNumbersByRoomType,
} from '../service/priceManagement.service';
import { ApiResponse } from '../../types/propertyCategory.type';
import {
  PriceManagementData,
  PriceManagementState,
  RoomNumberState,
} from '../../types/priceManagement.type';

// Initialize states
const initialPriceManagementState: PriceManagementState = {
  data: [],
  loading: false,
  error: null,
};

const initialRoomNumberState: RoomNumberState = {
  data: [],
  loading: false,
  error: null,
};

// Combined state for the slice
interface CombinedPriceManagementState extends PriceManagementState {
  roomNumbers: RoomNumberState;
}

const initialState: CombinedPriceManagementState = {
  ...initialPriceManagementState,
  roomNumbers: initialRoomNumberState,
};

// Async thunk for fetching price management data
export const fetchPriceManagement = createAsyncThunk<
  ApiResponse<PriceManagementData[]>,
  {
    filters: {
      property_id?: number;
      property_code?: string;
      room_type_id?: number;
      room_type_code?: string;
      room_number_id?: number;
      start_date?: string;
      end_date?: string;
    };
  }
>('priceManagement/fetchPriceManagement', async ({ filters }) => {
  const response = await getPriceManagement(filters);
  return response;
});

// Async thunk for fetching room numbers by room type
export const fetchRoomNumbersByRoomType = createAsyncThunk(
  'priceManagement/fetchRoomNumbers',
  async (roomTypeCode: string, { rejectWithValue }) => {
    try {
      const response = await getRoomNumbersByRoomType(roomTypeCode);

      if (!response.data || !Array.isArray(response.data)) {
        return rejectWithValue(
          'No room numbers found or invalid response format',
        );
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch room numbers');
    }
  },
);

const priceManagementSlice = createSlice({
  name: 'priceManagement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.roomNumbers.error = null;
    },
    clearRoomNumbersData: (state) => {
      state.roomNumbers.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Price Management data
      .addCase(fetchPriceManagement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriceManagement.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || [];
      })
      .addCase(fetchPriceManagement.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch price management data';
      })

      // Room Numbers data
      .addCase(fetchRoomNumbersByRoomType.pending, (state) => {
        state.roomNumbers.loading = true;
        state.roomNumbers.error = null;
      })
      .addCase(fetchRoomNumbersByRoomType.fulfilled, (state, action) => {
        state.roomNumbers.loading = false;
        state.roomNumbers.data = action.payload;
      })
      .addCase(fetchRoomNumbersByRoomType.rejected, (state, action) => {
        state.roomNumbers.loading = false;
        state.roomNumbers.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearError, clearRoomNumbersData } =
  priceManagementSlice.actions;
export default priceManagementSlice.reducer;
