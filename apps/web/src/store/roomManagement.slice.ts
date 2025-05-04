// src/redux/slices/roomManagement.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RoomType, PriceInfo } from '../../types/roomManagement.type';
import {
  getRoomTypesByProperty,
  getPricesByRoomType,
} from '../service/roomManagement.service';

// Define the state interface
interface RoomManagementState {
  roomTypes: RoomType[];
  selectedRoomTypeCode: string | null;
  priceInfo: PriceInfo | null;
  roomTypesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  pricesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: RoomManagementState = {
  roomTypes: [],
  selectedRoomTypeCode: null,
  priceInfo: null,
  roomTypesStatus: 'idle',
  pricesStatus: 'idle',
  error: null,
};

// Create async thunk for fetching room types by property
export const fetchRoomTypesByProperty = createAsyncThunk(
  'roomManagement/fetchRoomTypes',
  async (propertyCode: string, { rejectWithValue }) => {
    try {
      const response = await getRoomTypesByProperty(propertyCode);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

// Create async thunk for fetching prices by room type
export const fetchPricesByRoomType = createAsyncThunk(
  'roomManagement/fetchPrices',
  async (
    {
      roomTypeCode,
      checkInDate,
      checkOutDate,
    }: {
      roomTypeCode: string;
      checkInDate?: string;
      checkOutDate?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await getPricesByRoomType(
        roomTypeCode,
        checkInDate,
        checkOutDate,
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

// Create the slice
const roomManagementSlice = createSlice({
  name: 'roomManagement',
  initialState,
  reducers: {
    setSelectedRoomType: (state, action: PayloadAction<string>) => {
      state.selectedRoomTypeCode = action.payload;
    },
    resetRoomManagement: (state) => {
      state.roomTypes = [];
      state.selectedRoomTypeCode = null;
      state.priceInfo = null;
      state.roomTypesStatus = 'idle';
      state.pricesStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchRoomTypesByProperty
      .addCase(fetchRoomTypesByProperty.pending, (state) => {
        state.roomTypesStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchRoomTypesByProperty.fulfilled, (state, action) => {
        state.roomTypesStatus = 'succeeded';
        state.roomTypes = action.payload || [];
        state.error = null;
      })
      .addCase(fetchRoomTypesByProperty.rejected, (state, action) => {
        state.roomTypesStatus = 'failed';
        state.error = action.payload as string;
      })

      // Handle fetchPricesByRoomType
      .addCase(fetchPricesByRoomType.pending, (state) => {
        state.pricesStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchPricesByRoomType.fulfilled, (state, action) => {
        state.pricesStatus = 'succeeded';
        // Fixed: Handle the case where action.payload might be undefined
        state.priceInfo = action.payload ?? null;
        state.error = null;
      })
      .addCase(fetchPricesByRoomType.rejected, (state, action) => {
        state.pricesStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { setSelectedRoomType, resetRoomManagement } =
  roomManagementSlice.actions;
export default roomManagementSlice.reducer;
