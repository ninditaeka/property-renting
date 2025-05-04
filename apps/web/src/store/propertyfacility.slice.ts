import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PropertyFacility } from '../../types/propertyFacility.type';
import { getAllPropertyFacilities } from '../service/propertyFacility.service';

// Define the state interface
interface PropertyFacilityState {
  facilities: PropertyFacility[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: PropertyFacilityState = {
  facilities: [],
  status: 'idle',
  error: null,
};

// Create async thunk for fetching all property facilities
export const fetchPropertyFacilities = createAsyncThunk(
  'propertyFacilities/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPropertyFacilities();
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
const propertyFacilitySlice = createSlice({
  name: 'propertyFacilities',
  initialState,
  reducers: {
    resetPropertyFacilities: (state) => {
      state.facilities = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyFacilities.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPropertyFacilities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.facilities = action.payload || [];
        state.error = null;
      })
      .addCase(fetchPropertyFacilities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { resetPropertyFacilities } = propertyFacilitySlice.actions;
export default propertyFacilitySlice.reducer;
