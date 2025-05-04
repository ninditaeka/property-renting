import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getPropertyByUserToken,
  getAllRoomInfoByUserToken,
  getPriceManagementDashboardByUserToken,
} from '../../src/service/tenant.service';

import {
  Property,
  RoomInfo,
  PriceManagementItem,
  PriceManagementQueryParams,
  TenantState,
} from '../../types/tenant.type';

// Initial state
const initialState: TenantState = {
  properties: {
    items: [],
    isLoading: false,
    error: null,
    selectedProperty: null,
  },
  rooms: {
    items: [],
    isLoading: false,
    error: null,
    selectedRoom: null,
  },
  priceManagement: {
    items: [],
    isLoading: false,
    error: null,
    filters: {},
  },
};

// Async thunks
export const fetchProperties = createAsyncThunk(
  'tenant/fetchProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPropertyByUserToken();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch properties',
      );
    }
  },
);

export const fetchRooms = createAsyncThunk(
  'tenant/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllRoomInfoByUserToken();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch rooms',
      );
    }
  },
);

export const fetchPriceManagement = createAsyncThunk(
  'tenant/fetchPriceManagement',
  async (params: PriceManagementQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await getPriceManagementDashboardByUserToken(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to fetch price management data',
      );
    }
  },
);

// Create the slice
const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    selectProperty: (state, action: PayloadAction<number>) => {
      state.properties.selectedProperty =
        state.properties.items.find(
          (property) => property.id === action.payload,
        ) || null;
    },
    clearSelectedProperty: (state) => {
      state.properties.selectedProperty = null;
    },
    selectRoom: (state, action: PayloadAction<number>) => {
      state.rooms.selectedRoom =
        state.rooms.items.find(
          (room) => room.room_number_id === action.payload,
        ) || null;
    },
    clearSelectedRoom: (state) => {
      state.rooms.selectedRoom = null;
    },
    setPriceManagementFilters: (
      state,
      action: PayloadAction<PriceManagementQueryParams>,
    ) => {
      state.priceManagement.filters = action.payload;
    },
    clearPriceManagementFilters: (state) => {
      state.priceManagement.filters = {};
    },
    clearErrors: (state) => {
      state.properties.error = null;
      state.rooms.error = null;
      state.priceManagement.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProperties
      .addCase(fetchProperties.pending, (state) => {
        state.properties.isLoading = true;
        state.properties.error = null;
      })
      .addCase(
        fetchProperties.fulfilled,
        (state, action: PayloadAction<Property[]>) => {
          state.properties.isLoading = false;
          state.properties.items = action.payload;
        },
      )
      .addCase(fetchProperties.rejected, (state, action) => {
        state.properties.isLoading = false;
        state.properties.error = action.payload as string;
      })

      // Handle fetchRooms
      .addCase(fetchRooms.pending, (state) => {
        state.rooms.isLoading = true;
        state.rooms.error = null;
      })
      .addCase(
        fetchRooms.fulfilled,
        (state, action: PayloadAction<RoomInfo[]>) => {
          state.rooms.isLoading = false;
          state.rooms.items = action.payload;
        },
      )
      .addCase(fetchRooms.rejected, (state, action) => {
        state.rooms.isLoading = false;
        state.rooms.error = action.payload as string;
      })

      // Handle fetchPriceManagement
      .addCase(fetchPriceManagement.pending, (state) => {
        state.priceManagement.isLoading = true;
        state.priceManagement.error = null;
      })
      .addCase(
        fetchPriceManagement.fulfilled,
        (state, action: PayloadAction<PriceManagementItem[]>) => {
          state.priceManagement.isLoading = false;
          state.priceManagement.items = action.payload;
        },
      )
      .addCase(fetchPriceManagement.rejected, (state, action) => {
        state.priceManagement.isLoading = false;
        state.priceManagement.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  selectProperty,
  clearSelectedProperty,
  selectRoom,
  clearSelectedRoom,
  setPriceManagementFilters,
  clearPriceManagementFilters,
  clearErrors,
} = tenantSlice.actions;

// Export selectors
export const selectAllProperties = (state: { tenant: TenantState }) =>
  state.tenant.properties.items;
export const selectPropertiesLoading = (state: { tenant: TenantState }) =>
  state.tenant.properties.isLoading;
export const selectPropertiesError = (state: { tenant: TenantState }) =>
  state.tenant.properties.error;
export const selectCurrentProperty = (state: { tenant: TenantState }) =>
  state.tenant.properties.selectedProperty;

export const selectAllRooms = (state: { tenant: TenantState }) =>
  state.tenant.rooms.items;
export const selectRoomsLoading = (state: { tenant: TenantState }) =>
  state.tenant.rooms.isLoading;
export const selectRoomsError = (state: { tenant: TenantState }) =>
  state.tenant.rooms.error;
export const selectCurrentRoom = (state: { tenant: TenantState }) =>
  state.tenant.rooms.selectedRoom;

export const selectAllPriceManagement = (state: { tenant: TenantState }) =>
  state.tenant.priceManagement.items;
export const selectPriceManagementLoading = (state: { tenant: TenantState }) =>
  state.tenant.priceManagement.isLoading;
export const selectPriceManagementError = (state: { tenant: TenantState }) =>
  state.tenant.priceManagement.error;
export const selectPriceManagementFilters = (state: { tenant: TenantState }) =>
  state.tenant.priceManagement.filters;

// Export reducer
export default tenantSlice.reducer;
