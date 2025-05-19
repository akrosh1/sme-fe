import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  active_role: string | null;
  token: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  active_role: null,
  token: null,
  refresh: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        active_role: string;
        refresh_token: string;
        token: string;
      }>,
    ) => {
      state.active_role = action.payload.active_role;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem('refresh_token', action.payload.refresh_token);
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('active_role', action.payload.active_role);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.active_role = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('active_role');
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;

// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface AuthState {
//   token: string | null;
//   active_role: string | null;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   token: null,
//   active_role: null,
//   isLoading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     loginStart(state) {
//       state.isLoading = true;
//       state.error = null;
//     },
//     loginSuccess(
//       state,
//       action: PayloadAction<{ token: string; active_role: string }>,
//     ) {
//       state.isLoading = false;
//       state.token = action.payload.token;
//       state.active_role = action.payload.active_role;
//       state.error = null;
//     },
//     loginFailure(state, action: PayloadAction<string>) {
//       state.isLoading = false;
//       state.error = action.payload;
//     },
//     logout(state) {
//       state.token = null;
//       state.active_role = null;
//       state.isLoading = false;
//       state.error = null;
//     },
//   },
// });

// export const { loginStart, loginSuccess, loginFailure, logout } =
//   authSlice.actions;
// export default authSlice.reducer;
