import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RoomType } from '../../types/roomDetail.type';
import { getRoomTypeWithFacilitiesLowerPriceanndAvailability } from '@/service/roomDetail.service';

// Define the state interface
interface RoomTypeState {
  currentRoomType: RoomType | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: RoomTypeState = {
  currentRoomType: null,
  status: 'idle',
  error: null,
};

// Create async thunk for fetching room type details
export const fetchRoomTypeDetailsLowestPriceAvailability = createAsyncThunk<
  RoomType, // Return type when fulfilled
  string // First argument (roomTypeCode)
>(
  'roomType/fetchDetails',
  async (roomTypeCode: string, { rejectWithValue }) => {
    try {
      const response =
        await getRoomTypeWithFacilitiesLowerPriceanndAvailability(roomTypeCode);
      if (!response.data) {
        return rejectWithValue('No data returned from API');
      }
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
const roomTypeSlice = createSlice({
  name: 'roomType',
  initialState,
  reducers: {
    resetRoomTypeDetails: (state) => {
      state.currentRoomType = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomTypeDetailsLowestPriceAvailability.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchRoomTypeDetailsLowestPriceAvailability.fulfilled,
        (state, action: PayloadAction<RoomType>) => {
          state.status = 'succeeded';
          state.currentRoomType = action.payload;
          state.error = null;
        },
      )
      .addCase(
        fetchRoomTypeDetailsLowestPriceAvailability.rejected,
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
        },
      );
  },
});

// Export actions and reducer
export const { resetRoomTypeDetails } = roomTypeSlice.actions;
export default roomTypeSlice.reducer;
