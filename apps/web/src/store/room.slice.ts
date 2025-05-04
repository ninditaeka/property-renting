'use client';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Room, RoomType } from '../../types/propertyList.type';
import { CreateRoomRequest } from '../../types/room.type';

import {
  createRoom as createRoomService,
  getAllRooms as getAllRoomsService,
  getRoomByRoomNumberCode as getRoomByRoomNumberCodeService,
  updateRoomByRoomNumberCode as updateRoomByRoomNumberCodeService,
  deleteRoomByRoomNumberCode as deleteRoomByRoomNumberCodeService,
} from '../service/room.service';

// Define state interface
interface RoomState {
  rooms: Room[];
  currentRoom: Room | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: RoomState = {
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const createRoom = createAsyncThunk(
  'rooms/create',
  async (roomData: CreateRoomRequest, { rejectWithValue }) => {
    try {
      const response = await createRoomService(roomData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create room');
    }
  },
);

export const fetchRooms = createAsyncThunk(
  'rooms/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllRoomsService();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch rooms');
    }
  },
);

export const fetchRoomByRoomTypeCode = createAsyncThunk(
  'rooms/fetchByRoomNumberCode',
  async (room_type_code: string, { rejectWithValue }) => {
    try {
      const response = await getRoomByRoomNumberCodeService(room_type_code);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch room');
    }
  },
);

export const updateRoom = createAsyncThunk(
  'rooms/update',
  async (
    {
      room_number_code,
      data,
    }: { room_number_code: string; data: Partial<CreateRoomRequest> },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateRoomByRoomNumberCodeService(
        room_number_code,
        data,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update room');
    }
  },
);

export const deleteRoom = createAsyncThunk(
  'rooms/delete',
  async (room_number_code: string, { rejectWithValue }) => {
    try {
      await deleteRoomByRoomNumberCodeService(room_number_code);
      // Return the code for identification in the reducer
      return room_number_code;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete room');
    }
  },
);

// Create the slice
const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    resetError: (state) => {
      state.error = null;
    },
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
    },
  },
  extraReducers: (builder) => {
    // Create room
    builder.addCase(createRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createRoom.fulfilled,
      (state, action: PayloadAction<Room | undefined>) => {
        state.loading = false;
        if (action.payload) {
          state.rooms.push(action.payload);
          state.currentRoom = action.payload;
        }
        state.success = true;
      },
    );
    builder.addCase(createRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch all rooms
    builder.addCase(fetchRooms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchRooms.fulfilled,
      (state, action: PayloadAction<Room[] | undefined>) => {
        state.loading = false;
        state.rooms = action.payload || [];
      },
    );
    builder.addCase(fetchRooms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch room by room number code
    builder.addCase(fetchRoomByRoomTypeCode.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchRoomByRoomTypeCode.fulfilled,
      (state, action: PayloadAction<Room | undefined>) => {
        state.loading = false;
        state.currentRoom = action.payload || null;
      },
    );
    builder.addCase(fetchRoomByRoomTypeCode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update room
    builder.addCase(updateRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateRoom.fulfilled,
      (state, action: PayloadAction<Room | undefined>) => {
        state.loading = false;
        if (action.payload) {
          const index = state.rooms.findIndex(
            (room) => room.room_type_code === action.payload?.room_type_code,
          );
          if (index !== -1) {
            state.rooms[index] = action.payload;
          }
          state.currentRoom = action.payload;
        }
        state.success = true;
      },
    );
    builder.addCase(updateRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete room
    builder.addCase(deleteRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false; // Reset success on pending
    });
    builder.addCase(
      deleteRoom.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        const payloadCode = String(action.payload);

        // Filter with consistent string comparison
        state.rooms = state.rooms.filter((room) => {
          const roomCode = String(room.room_type_code);
          return roomCode !== payloadCode;
        });

        // Clear current room if it's the one being deleted
        if (state.currentRoom?.room_type_code === action.payload) {
          state.currentRoom = null;
        }
        state.success = true;
      },
    );
    builder.addCase(deleteRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { resetSuccess, resetError, clearCurrentRoom } = roomSlice.actions;
export default roomSlice.reducer;
