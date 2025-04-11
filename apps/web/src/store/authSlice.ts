import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { authService, getAuthenticatedUser } from '../service/auth.service';
import { Roles } from '../../types/auth.type';
import { AuthState, LoginCredentials } from '../../types/auth.type';

// Initial state
const initialState: AuthState = {
  user: getAuthenticatedUser(),
  token: Cookies.get('token') || null,
  isAuthenticated: !!getAuthenticatedUser(),
  loading: false,
  error: null,
};

// Login Async Thunk
// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async (credentials: LoginCredentials, { rejectWithValue }) => {
//     try {
//       const data = await authService.login(credentials);
//       return data;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   },
// );

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (error) {
      // Handle the error with proper typing
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      // Fallback for unknown error types
      return rejectWithValue('An unknown error occurred');
    }
  },
);

// Logout Async Thunk
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  authService.logout();
});

// Create Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.user.id,
          name: action.payload.user.name,
          email: action.payload.user.email,
          role: action.payload.user.role as Roles,
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Logout Cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
