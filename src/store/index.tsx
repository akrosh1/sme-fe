// import { authApi } from '@/api/auth/authApi';
// import { configureStore } from '@reduxjs/toolkit';
// import { setupListeners } from '@reduxjs/toolkit/query';
// import authReducer from './slices/authSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     [authApi.reducerPath]: authApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(authApi.middleware),
// });

// setupListeners(store.dispatch);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;

// store.ts
// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
