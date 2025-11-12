import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import threadsReducer from '../features/threads/threadsSlice';
import uiReducer from '../features/ui/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    ui: uiReducer,
  },
});

export default store;
