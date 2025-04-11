import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchPropertyWithRoomTypes,
  fetchPropertyWithFacilities,
} from '../service/propertyDetail.service';
import {
  PropertyWithRoomTypes,
  PropertyWithFacilities,
} from '../../types/propertyDetail.type';

interface PropertyDetailState {
  property: PropertyWithRoomTypes | PropertyWithFacilities | null;
  roomTypes: boolean;
  facilities: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: PropertyDetailState = {
  property: null,
  roomTypes: false,
  facilities: false,
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

const propertyDetailSlice = createSlice({
  name: 'propertyDetail',
  initialState,
  reducers: {
    clearProperty: (state) => {
      state.property = null;
      state.roomTypes = false;
      state.facilities = false;
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
        (state, action: PayloadAction<PropertyWithRoomTypes>) => {
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
        (state, action: PayloadAction<PropertyWithFacilities>) => {
          state.property = action.payload;
          state.roomTypes = false;
          state.facilities = true;
          state.loading = false;
        },
      )
      .addCase(getPropertyWithFacilities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProperty } = propertyDetailSlice.actions;
export default propertyDetailSlice.reducer;
