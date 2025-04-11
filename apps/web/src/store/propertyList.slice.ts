import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import {
  createProperty as createPropertyService,
  getAllProperties as getAllPropertiesService,
  getPropertyByCode as getPropertyByCodeService,
  getPropertiesByCity as getPropertiesByCityService,
  getAvailableRoomTypes as getAvailableRoomTypesService,
  updateProperty as updatePropertyService,
  deletePropertyByCode as deletePropertyByCodeService,
} from '../service/propertyList.service';

import {
  CreatePropertyRequest,
  Property,
  PropertyState,
} from '../../types/propertyList.type';

// Type for API errors
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Initial state
const initialState: PropertyState = {
  properties: [],
  property: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const getAllProperties = createAsyncThunk(
  'property/getAllProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPropertiesService();
      return response.data;
    } catch (error: unknown) {
      const typedError = error as ApiError;
      return rejectWithValue(
        typedError.response?.data?.message || 'Failed to fetch properties',
      );
    }
  },
);

export const getPropertyByCode = createAsyncThunk(
  'property/getPropertyByCode',
  async (propertyCode: string, { rejectWithValue }) => {
    try {
      const response = await getPropertyByCodeService(propertyCode);
      return response.data;
    } catch (error: unknown) {
      const typedError = error as ApiError;
      return rejectWithValue(
        typedError.response?.data?.message || 'Failed to fetch property',
      );
    }
  },
);

export const createProperty = createAsyncThunk(
  'property/createProperty',
  async (propertyData: CreatePropertyRequest, { rejectWithValue }) => {
    try {
      const response = await createPropertyService(propertyData);
      return response;
    } catch (error: unknown) {
      const typedError = error as ApiError;
      return rejectWithValue(
        typedError.response?.data?.message || 'Failed to create property',
      );
    }
  },
);

export const updateProperty = createAsyncThunk(
  'property/updateProperty',
  async (
    {
      propertyCode,
      propertyData,
    }: { propertyCode: string; propertyData: Partial<CreatePropertyRequest> },
    { rejectWithValue },
  ) => {
    try {
      const response = await updatePropertyService(propertyCode, propertyData);
      return response.data;
    } catch (error: unknown) {
      const typedError = error as ApiError;
      return rejectWithValue(
        typedError.response?.data?.message || 'Failed to update property',
      );
    }
  },
);

export const deleteProperty = createAsyncThunk(
  'property/deleteProperty',
  async (propertyCode: string, { rejectWithValue }) => {
    try {
      const response = await deletePropertyByCodeService(propertyCode);
      return { propertyCode, response };
    } catch (error: unknown) {
      const typedError = error as ApiError;
      return rejectWithValue(
        typedError.response?.data?.message || 'Failed to delete property',
      );
    }
  },
);

export const getPropertiesByCity = createAsyncThunk(
  'property/getPropertiesByCity',
  async (city: string, { rejectWithValue }) => {
    try {
      const response = await getPropertiesByCityService(city);
      return response.data;
    } catch (error: unknown) {
      const typedError = error as ApiError;
      return rejectWithValue(
        typedError.response?.data?.message ||
          'Failed to fetch properties by city',
      );
    }
  },
);

export const getAvailableRoomTypes = createAsyncThunk(
  'property/getAvailableRoomTypes',
  async (propertyCode: string, { rejectWithValue }) => {
    try {
      const response = await getAvailableRoomTypesService(propertyCode);
      if (response.success) {
        return response;
      }
      return rejectWithValue(
        response.message || 'Failed to fetch available room types',
      );
    } catch (error: unknown) {
      const typedError = error as ApiError;
      return rejectWithValue(
        typedError.response?.data?.message ||
          'Failed to fetch available room types',
      );
    }
  },
);

// Create the slice
const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    resetPropertyState: (state) => {
      state.error = null;
      state.success = false;
    },
    setProperty: (state, action: PayloadAction<Property | null>) => {
      state.property = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all properties
      .addCase(getAllProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
        state.error = null;
      })
      .addCase(getAllProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get property by code
      .addCase(getPropertyByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPropertyByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.property = action.payload;
        state.error = null;
      })
      .addCase(getPropertyByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create property
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.data) {
          // Assuming the actual Property data is in action.payload.data
          state.properties.push(action.payload.data);
          state.property = action.payload.data;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Update property
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.property = action.payload;
          state.properties = state.properties.map((property) =>
            property.property_code === action.payload.property_code
              ? action.payload
              : property,
          );
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Delete property
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = state.properties.filter(
          (property) => property.property_code !== action.payload.propertyCode,
        );
        if (state.property?.property_code === action.payload.propertyCode) {
          state.property = null;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Get properties by city
      .addCase(getPropertiesByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPropertiesByCity.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
        state.error = null;
      })
      .addCase(getPropertiesByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get available room types
      .addCase(getAvailableRoomTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableRoomTypes.fulfilled, (state, action) => {
        state.loading = false;
        if (
          state.property &&
          action.payload.property?.property_code ===
            state.property.property_code
        ) {
          state.property = {
            ...state.property,
            room_types: action.payload.available_room_types,
          };
        }
        state.error = null;
      })
      .addCase(getAvailableRoomTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetPropertyState, setProperty } = propertySlice.actions;

export default propertySlice.reducer;
