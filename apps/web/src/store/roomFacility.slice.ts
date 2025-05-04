// src/store/slices/roomFacilitySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RoomFacilities } from '../../types/roomFacility.type';
import { getAllRoomFacilities } from '../service/roomFacility.service';

// Define the state interface
interface RoomFacilityState {
  facilities: RoomFacilities[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: RoomFacilityState = {
  facilities: [],
  status: 'idle',
  error: null,
};

// Create async thunk for fetching all room facilities
export const fetchRoomFacilities = createAsyncThunk(
  'roomFacilities/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllRoomFacilities();
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
const roomFacilitySlice = createSlice({
  name: 'roomFacilities',
  initialState,
  reducers: {
    resetRoomFacilities: (state) => {
      state.facilities = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomFacilities.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRoomFacilities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.facilities = action.payload || [];
        state.error = null;
      })
      .addCase(fetchRoomFacilities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { resetRoomFacilities } = roomFacilitySlice.actions;
export default roomFacilitySlice.reducer;
