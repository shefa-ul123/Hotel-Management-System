import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import roomReducer from './features/rooms/roomSlice';
import bookingReducer from './features/bookings/bookingSlice';
import serviceReducer from './features/services/serviceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomReducer,
    bookings: bookingReducer,
    services: serviceReducer,
  },
});
