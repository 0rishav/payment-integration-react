// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './features/authApi';
import authSlice from './features/authSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    user: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
