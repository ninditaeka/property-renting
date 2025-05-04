import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Booking,
  BookingFormData,
  FormattedBooking,
  RoomPricing,
  AvailableRoom,
  LowestPriceRoom,
} from '../../types/booking.type';
import {
  createBooking as createBookingService,
  getBookingsByUserCode,
  getRoomPricingByDateRange,
  getAvailableRoomNumbers,
  getLowestPriceRoom,
  formatDateToDDMMYYYY,
  calculateTotalPrice,
  extractPropertyId,
} from '@/service/booking.service';

// Define the state interface
interface BookingState {
  currentBooking: Booking | null;
  userBookings: FormattedBooking[];
  availableRooms: AvailableRoom[];
  roomPricing: RoomPricing[];
  lowestPriceRoom: LowestPriceRoom | null;
  selectedRoom: AvailableRoom | null;
  propertyId: number | null;
  bookingDates: {
    'check-in': string | null;
    'check-out': string | null;
  };
  totalPrice: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: BookingState = {
  currentBooking: null,
  userBookings: [],
  availableRooms: [],
  roomPricing: [],
  lowestPriceRoom: null,
  selectedRoom: null,
  propertyId: null,
  bookingDates: {
    'check-in': null,
    'check-out': null,
  },
  totalPrice: 0,
  status: 'idle',
  error: null,
};

// Create async thunks
export const createBookingAsync = createAsyncThunk<Booking, BookingFormData>(
  'booking/create',
  async (bookingData: BookingFormData, { rejectWithValue }) => {
    try {
      const response = await createBookingService(bookingData);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

export const fetchUserBookings = createAsyncThunk<FormattedBooking[], string>(
  'booking/fetchUserBookings',
  async (userCode: string, { rejectWithValue }) => {
    try {
      const response = await getBookingsByUserCode(userCode);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

export const fetchRoomPricing = createAsyncThunk<
  RoomPricing[],
  {
    roomTypeCode: string;
    startDate?: string;
    endDate?: string;
    roomNumber?: string;
  }
>(
  'booking/fetchRoomPricing',
  async (
    { roomTypeCode, startDate, endDate, roomNumber },
    { rejectWithValue, dispatch },
  ) => {
    try {
      // Format dates if they're Date objects
      const formattedStartDate = startDate ? startDate : undefined;
      const formattedEndDate = endDate ? endDate : undefined;

      const response = await getRoomPricingByDateRange(
        roomTypeCode,
        formattedStartDate,
        formattedEndDate,
        roomNumber,
      );

      if (response.data && response.data.length > 0) {
        const calculatedPrice = calculateTotalPrice(response.data);
        dispatch(setTotalPrice(calculatedPrice));

        if (response.data[0]?.property_id) {
          const propertyId = parseInt(response.data[0].property_id.toString());
          if (!isNaN(propertyId)) {
            dispatch(setPropertyId(propertyId));
          }
        }
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

export const fetchAvailableRooms = createAsyncThunk<
  AvailableRoom[],
  { roomTypeCode: string; checkInDate?: string; checkOutDate?: string }
>(
  'booking/fetchAvailableRooms',
  async (
    { roomTypeCode, checkInDate, checkOutDate },
    { rejectWithValue, dispatch },
  ) => {
    try {
      // Format dates to DD-MM-YYYY if provided
      let formattedCheckIn = checkInDate;
      let formattedCheckOut = checkOutDate;

      if (checkInDate && checkOutDate) {
        // Store the booking dates in state
        dispatch(
          setBookingDates({
            'check-in': checkInDate,
            'check-out': checkOutDate,
          }),
        );
      }

      const response = await getAvailableRoomNumbers(
        roomTypeCode,
        formattedCheckIn,
        formattedCheckOut,
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

export const fetchLowestPriceRoom = createAsyncThunk<
  LowestPriceRoom,
  { roomTypeCode: string; checkInDate: string; checkOutDate: string }
>(
  'booking/fetchLowestPriceRoom',
  async (
    { roomTypeCode, checkInDate, checkOutDate },
    { rejectWithValue, dispatch },
  ) => {
    try {
      if (checkInDate && checkOutDate) {
        // Store the booking dates in state
        dispatch(
          setBookingDates({
            'check-in': checkInDate,
            'check-out': checkOutDate,
          }),
        );
      }

      const response = await getLowestPriceRoom(
        roomTypeCode,
        checkInDate,
        checkOutDate,
      );

      if (response.data && response.data.total_price) {
        const totalPrice = parseFloat(response.data.total_price.toString());
        dispatch(setTotalPrice(totalPrice));
      }

      if (response.data && response.data.property_id) {
        const propertyId = parseInt(response.data.property_id.toString());
        if (!isNaN(propertyId)) {
          dispatch(setPropertyId(propertyId));
        }
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
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.currentBooking = null;
      state.selectedRoom = null;
      state.lowestPriceRoom = null;
      state.propertyId = null;
      state.totalPrice = 0;
      state.status = 'idle';
      state.error = null;
    },
    clearRoomPricing: (state) => {
      state.roomPricing = [];
    },
    clearAvailableRooms: (state) => {
      state.availableRooms = [];
      state.selectedRoom = null;
    },
    selectRoom: (state, action: PayloadAction<AvailableRoom>) => {
      state.selectedRoom = action.payload;
    },
    setPropertyId: (state, action: PayloadAction<number | null>) => {
      state.propertyId = action.payload;
    },
    setBookingDates: (
      state,
      action: PayloadAction<{ 'check-in': string; 'check-out': string }>,
    ) => {
      state.bookingDates = action.payload;
    },
    setTotalPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload;
    },
    resetBookingProcess: (state) => {
      state.selectedRoom = null;
      state.lowestPriceRoom = null;
      state.propertyId = null;
      state.bookingDates = {
        'check-in': null,
        'check-out': null,
      };
      state.totalPrice = 0;
      state.roomPricing = [];
      state.availableRooms = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBookingAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        createBookingAsync.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.status = 'succeeded';
          state.currentBooking = action.payload;
          state.error = null;
          state.selectedRoom = null;
          state.lowestPriceRoom = null;
          state.propertyId = null;
          state.bookingDates = {
            'check-in': null,
            'check-out': null,
          };
          state.totalPrice = 0;
        },
      )
      .addCase(createBookingAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(fetchUserBookings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchUserBookings.fulfilled,
        (state, action: PayloadAction<FormattedBooking[]>) => {
          state.status = 'succeeded';
          state.userBookings = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch room pricing
      .addCase(fetchRoomPricing.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchRoomPricing.fulfilled,
        (state, action: PayloadAction<RoomPricing[]>) => {
          state.status = 'succeeded';
          state.roomPricing = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchRoomPricing.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch available rooms
      .addCase(fetchAvailableRooms.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchAvailableRooms.fulfilled,
        (state, action: PayloadAction<AvailableRoom[]>) => {
          state.status = 'succeeded';
          state.availableRooms = action.payload;
          state.error = null;

          // If we got rooms and don't have a selection, select the first one
          if (state.availableRooms.length > 0 && !state.selectedRoom) {
            state.selectedRoom = state.availableRooms[0];
          }
        },
      )
      .addCase(fetchAvailableRooms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch lowest price room
      .addCase(fetchLowestPriceRoom.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchLowestPriceRoom.fulfilled,
        (state, action: PayloadAction<LowestPriceRoom>) => {
          state.status = 'succeeded';
          state.lowestPriceRoom = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchLowestPriceRoom.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const {
  resetBookingState,
  clearRoomPricing,
  clearAvailableRooms,
  selectRoom,
  setPropertyId,
  setBookingDates,
  setTotalPrice,
  resetBookingProcess,
} = bookingSlice.actions;

export default bookingSlice.reducer;
