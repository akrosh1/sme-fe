import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.data.active_role;
          state.token = payload.data.access;
          state.isAuthenticated = true;
          localStorage.setItem('token', payload.data.access);
        },
      )
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          console.log('🚀 ~ payload:', payload);
          state.user = payload.user;
          state.token = payload.token;
          state.isAuthenticated = true;
          localStorage.setItem('token', payload.data.access);
        },
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
