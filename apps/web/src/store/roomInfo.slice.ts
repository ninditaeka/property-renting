import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllRoomInfo } from '../service/roomInfo.service'; // Path may need adjustment
import { RoomInfo, RoomState } from '../../types/roomInfo.type';

// Initial state
const initialState: RoomState = {
  rooms: [],
  selectedRoom: null,
  isLoading: false,
  error: null,
};

// Create async thunk for fetching rooms
export const fetchRooms = createAsyncThunk(
  'rooms/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllRoomInfo();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch rooms');
    }
  },
);
// Create the slice
const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    // Make sure we're comparing numbers with numbers
    selectRoom: (state, action: PayloadAction<number>) => {
      // Find the room where room_number_id (which should be a number) matches the action payload
      state.selectedRoom =
        state.rooms.find((room) => room.room_number_id === action.payload) ||
        null;
    },
    clearSelectedRoom: (state) => {
      state.selectedRoom = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchRooms
      .addCase(fetchRooms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchRooms.fulfilled,
        (state, action: PayloadAction<RoomInfo[]>) => {
          state.isLoading = false;
          state.rooms = action.payload;
        },
      )
      .addCase(fetchRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Unknown error occurred';
      });
  },
});

// Export actions
export const { selectRoom, clearSelectedRoom, setLoading, clearErrors } =
  roomSlice.actions;

// Export reducer
export default roomSlice.reducer;

export const selectAllRooms = (state: RoomState) => state.rooms;
export const selectCurrentRoom = (state: RoomState) => state.selectedRoom;
export const selectRoomsLoading = (state: RoomState) => state.isLoading;
export const selectRoomsError = (state: RoomState) => state.error;
