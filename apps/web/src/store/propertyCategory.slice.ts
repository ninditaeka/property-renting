'use client';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PropertyCategory } from '../../types/propertyCategory.type';
import {
  createPropertyCategory as createPropertyCategoryService,
  getAllPropertyCategories as getAllPropertyCategoriesService,
  getPropertyCategoryByCode as getPropertyCategoryByCodeService,
  updatePropertyCategoryByCode as updatePropertyCategoryByCodeService,
  deletePropertyCategoryByCode as deletePropertyCategoryByCodeService,
} from '../service/propertyCategory.service';

// Define state interface
interface PropertyCategoryState {
  propertyCategories: PropertyCategory[];
  currentPropertyCategory: PropertyCategory | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: PropertyCategoryState = {
  propertyCategories: [],
  currentPropertyCategory: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const createPropertyCategory = createAsyncThunk(
  'propertyCategories/create',
  async (categoryData: PropertyCategory, { rejectWithValue }) => {
    try {
      const response = await createPropertyCategoryService(categoryData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to create property category',
      );
    }
  },
);

export const fetchPropertyCategories = createAsyncThunk(
  'propertyCategories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPropertyCategoriesService();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch property categories',
      );
    }
  },
);

export const fetchPropertyCategoryByCode = createAsyncThunk(
  'propertyCategories/fetchByCode',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await getPropertyCategoryByCodeService(code);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch property category',
      );
    }
  },
);

export const updatePropertyCategory = createAsyncThunk(
  'propertyCategories/update',
  async (
    { code, data }: { code: string; data: Partial<PropertyCategory> },
    { rejectWithValue },
  ) => {
    try {
      const response = await updatePropertyCategoryByCodeService(code, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to update property category',
      );
    }
  },
);

export const deletePropertyCategory = createAsyncThunk(
  'propertyCategories/delete',
  async (code: string, { rejectWithValue }) => {
    try {
      await deletePropertyCategoryByCodeService(code);
      // Return the code for identification in the reducer
      return code;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to delete property category',
      );
    }
  },
);

// Create the slice
const propertyCategorySlice = createSlice({
  name: 'propertyCategories',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    resetError: (state) => {
      state.error = null;
    },
    clearCurrentPropertyCategory: (state) => {
      state.currentPropertyCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Create property category
    builder.addCase(createPropertyCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createPropertyCategory.fulfilled,
      (state, action: PayloadAction<PropertyCategory | undefined>) => {
        state.loading = false;
        if (action.payload) {
          state.propertyCategories.push(action.payload);
          state.currentPropertyCategory = action.payload;
        }
        state.success = true;
      },
    );
    builder.addCase(createPropertyCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch all property categories
    builder.addCase(fetchPropertyCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchPropertyCategories.fulfilled,
      (state, action: PayloadAction<PropertyCategory[] | undefined>) => {
        state.loading = false;
        state.propertyCategories = action.payload || [];
      },
    );
    builder.addCase(fetchPropertyCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch property category by code
    builder.addCase(fetchPropertyCategoryByCode.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchPropertyCategoryByCode.fulfilled,
      (state, action: PayloadAction<PropertyCategory | undefined>) => {
        state.loading = false;
        state.currentPropertyCategory = action.payload || null;
      },
    );
    builder.addCase(fetchPropertyCategoryByCode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update property category
    builder.addCase(updatePropertyCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updatePropertyCategory.fulfilled,
      (state, action: PayloadAction<PropertyCategory | undefined>) => {
        state.loading = false;
        if (action.payload) {
          const index = state.propertyCategories.findIndex(
            (cat) =>
              cat.property_category_code ===
              action.payload?.property_category_code,
          );
          if (index !== -1) {
            state.propertyCategories[index] = action.payload;
          }
          state.currentPropertyCategory = action.payload;
        }
        state.success = true;
      },
    );
    builder.addCase(updatePropertyCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete property category
    builder.addCase(deletePropertyCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false; // Reset success on pending
    });
    builder.addCase(
      deletePropertyCategory.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        const payloadCode = String(action.payload);

        // Filter with consistent string comparison
        state.propertyCategories = state.propertyCategories.filter((cat) => {
          const catCode = String(cat.property_category_code);
          return catCode !== payloadCode;
        });

        if (
          state.currentPropertyCategory?.property_category_code ===
          action.payload
        ) {
          state.currentPropertyCategory = null;
        }
        state.success = true;
      },
    );
    builder.addCase(deletePropertyCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { resetSuccess, resetError, clearCurrentPropertyCategory } =
  propertyCategorySlice.actions;
export default propertyCategorySlice.reducer;
