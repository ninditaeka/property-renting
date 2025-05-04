// src/store/slices/propertySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Property,
  PropertyFilters,
} from '../../types/propertyListVeryDetail.type';
import {
  getPropertyListVeryDetail,
  getSortedPropertyList,
} from '../service/propertyListVeryDetail.service';

// Define the state interface
interface PropertyState {
  properties: Property[];
  filters: PropertyFilters;
  sortBy: string;
  sortOrder: string;
  priceDisplay: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: PropertyState = {
  properties: [],
  filters: {
    city: '',
    checkIn: '',
    checkOut: '',
    rooms: 1,
  },
  sortBy: 'name',
  sortOrder: 'asc',
  priceDisplay: 'highest',
  status: 'idle',
  error: null,
};

// Create async thunk for fetching properties
export const fetchProperties = createAsyncThunk(
  'properties/fetchAll',
  async (
    params: {
      city: string;
      checkIn: string;
      checkOut: string;
      rooms?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await getPropertyListVeryDetail(params);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

// Create async thunk for fetching sorted properties
export const fetchSortedProperties = createAsyncThunk(
  'properties/fetchSorted',
  async (
    params: {
      city: string;
      checkIn: string;
      checkOut: string;
      rooms?: number;
      sortBy: string;
      sortOrder: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { sortBy, sortOrder, ...searchParams } = params;
      const response = await getSortedPropertyList(
        searchParams,
        sortBy,
        sortOrder,
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
const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<string>) => {
      state.sortOrder = action.payload;
    },
    setPriceDisplay: (state, action: PayloadAction<string>) => {
      state.priceDisplay = action.payload;
    },
    resetProperties: (state) => {
      state.properties = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProperties
      .addCase(fetchProperties.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.properties = action.payload.properties || [];
        state.filters = action.payload.filters;
        state.error = null;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Handle fetchSortedProperties
      .addCase(fetchSortedProperties.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSortedProperties.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.properties = action.payload.properties || [];
        state.filters = action.payload.filters;
        state.error = null;
      })
      .addCase(fetchSortedProperties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { setSortBy, setSortOrder, setPriceDisplay, resetProperties } =
  propertySlice.actions;
export default propertySlice.reducer;
