import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import loadingReducer from '../features/loading/loadingSlice';
import messageReducer from '../features/message/messageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    message: messageReducer,
  },
});
