import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  role: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('revelation_token');
  }
  return null;
};

const initialToken = getStoredToken();

const initialState: AuthState = {
  token: initialToken,
  user: null,
  isAuthenticated: !!initialToken,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken?: string | null }>
    ) => {
      state.user = action.payload.user;
      if (action.payload.accessToken) {
        state.token = action.payload.accessToken;
        if (typeof window !== 'undefined') {
          localStorage.setItem('revelation_token', action.payload.accessToken);
        }
      }
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('revelation_token');
      }
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
