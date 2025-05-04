import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  createPriceSeason,
  getAllPriceSeasons,
} from '../service/priceSeason.service';
import {
  PriceSeason,
  CreatePriceSeasonPayload,
} from '../../types/priceSeason.type';

// Define the state interface
interface PriceSeasonState {
  priceSeasons: PriceSeason[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: PriceSeasonState = {
  priceSeasons: [],
  status: 'idle',
  error: null,
};

// Create async thunks for price season actions
export const addPriceSeason = createAsyncThunk<
  PriceSeason,
  CreatePriceSeasonPayload
>(
  'priceSeason/create',
  async (payload: CreatePriceSeasonPayload, { rejectWithValue }) => {
    try {
      const response = await createPriceSeason(payload);
      return response.data as PriceSeason;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

export const fetchPriceSeasons = createAsyncThunk<PriceSeason[], void>(
  'priceSeason/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPriceSeasons();
      return response.data as PriceSeason[];
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

// Create the slice
const priceSeasonSlice = createSlice({
  name: 'priceSeason',
  initialState,
  reducers: {
    resetPriceSeasons: (state) => {
      state.priceSeasons = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle addPriceSeason
    builder
      .addCase(addPriceSeason.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        addPriceSeason.fulfilled,
        (state, action: PayloadAction<PriceSeason>) => {
          state.priceSeasons.push(action.payload);
          state.status = 'succeeded';
          state.error = null;
        },
      )
      .addCase(addPriceSeason.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Handle fetchPriceSeasons
    builder
      .addCase(fetchPriceSeasons.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchPriceSeasons.fulfilled,
        (state, action: PayloadAction<PriceSeason[]>) => {
          state.priceSeasons = action.payload;
          state.status = 'succeeded';
          state.error = null;
        },
      )
      .addCase(fetchPriceSeasons.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { resetPriceSeasons } = priceSeasonSlice.actions;
export default priceSeasonSlice.reducer;
