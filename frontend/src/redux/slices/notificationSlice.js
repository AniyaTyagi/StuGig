import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {
    setNotifications: (state, action) => { state.notifications = action.payload; },
    addNotification: (state, action) => { 
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n._id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    setUnreadCount: (state, action) => { state.unreadCount = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
  },
});

export const { setNotifications, addNotification, markAsRead, setUnreadCount, setLoading } = notificationSlice.actions;
export default notificationSlice.reducer;
