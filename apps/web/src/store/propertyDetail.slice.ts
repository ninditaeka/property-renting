import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchPropertyWithRoomTypes,
  fetchPropertyWithFacilities,
  fetchPropertyDetailWithAvailability,
} from '../service/propertyDetail.service';

import {
  PropertyWithDetails,
  PropertyWithAvailability,
} from '../../types/propertyDetail.type';

interface PropertyDetailState {
  property: PropertyWithDetails | null;
  propertyWithAvailability: PropertyWithAvailability | null;
  roomTypes: boolean;
  facilities: boolean;
  availability: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: PropertyDetailState = {
  property: null,
  propertyWithAvailability: null,
  roomTypes: false,
  facilities: false,
  availability: false,
  loading: false,
  error: null,
};

export const getPropertyWithRoomTypes = createAsyncThunk(
  'propertyDetail/getPropertyWithRoomTypes',
  async (propertyCode: string, { rejectWithValue }) => {
    try {
      return await fetchPropertyWithRoomTypes(propertyCode);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch property with room types';
      return rejectWithValue(message);
    }
  },
);

export const getPropertyWithFacilities = createAsyncThunk(
  'propertyDetail/getPropertyWithFacilities',
  async (propertyCode: string, { rejectWithValue }) => {
    try {
      return await fetchPropertyWithFacilities(propertyCode);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch property with facilities';
      return rejectWithValue(message);
    }
  },
);

export const getPropertyWithAvailability = createAsyncThunk(
  'propertyDetail/getPropertyWithAvailability',
  async (
    params: {
      propertyCode: string;
      checkInDate: string;
      checkOutDate: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { propertyCode, checkInDate, checkOutDate } = params;
      return await fetchPropertyDetailWithAvailability(
        propertyCode,
        checkInDate,
        checkOutDate,
      );
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch property with availability details';
      return rejectWithValue(message);
    }
  },
);

const propertyDetailSlice = createSlice({
  name: 'propertyDetail',
  initialState,
  reducers: {
    clearProperty: (state) => {
      state.property = null;
      state.propertyWithAvailability = null;
      state.roomTypes = false;
      state.facilities = false;
      state.availability = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getPropertyWithRoomTypes
      .addCase(getPropertyWithRoomTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPropertyWithRoomTypes.fulfilled,
        (state, action: PayloadAction<PropertyWithDetails>) => {
          state.property = action.payload;
          state.roomTypes = true;
          state.facilities = false;
          state.loading = false;
        },
      )
      .addCase(getPropertyWithRoomTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle getPropertyWithFacilities
      .addCase(getPropertyWithFacilities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPropertyWithFacilities.fulfilled,
        (state, action: PayloadAction<PropertyWithDetails>) => {
          state.property = action.payload;
          state.roomTypes = false;
          state.facilities = true;
          state.loading = false;
        },
      )
      .addCase(getPropertyWithFacilities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle getPropertyWithAvailability
      .addCase(getPropertyWithAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPropertyWithAvailability.fulfilled,
        (state, action: PayloadAction<PropertyWithAvailability>) => {
          state.propertyWithAvailability = action.payload;
          state.availability = true;
          state.loading = false;
        },
      )
      .addCase(getPropertyWithAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProperty } = propertyDetailSlice.actions;
export default propertyDetailSlice.reducer;
