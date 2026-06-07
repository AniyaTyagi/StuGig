import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import jobReducer from '../slices/jobSlice';
import serviceReducer from '../slices/serviceSlice';
import bidReducer from '../slices/bidSlice';
import chatReducer from '../slices/chatSlice';
import notificationReducer from '../slices/notificationSlice';
import paymentReducer from '../slices/paymentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    services: serviceReducer,
    bids: bidReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    payments: paymentReducer,
  },
});

export default store;
