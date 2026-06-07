import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notificationService } from '../services';
import { setUnreadCount, addNotification } from '../redux/slices/notificationSlice';
import socketService from '../services/socketService';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Fetch initial notifications count
    const fetchUnreadCount = async () => {
      try {
        const response = await notificationService.getNotifications({ limit: 1 });
        const data = response.data || response;
        dispatch(setUnreadCount(data.unreadCount || 0));
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchUnreadCount();

    // Connect to socket and listen for new notifications
    try {
      socketService.connect();
      
      socketService.on('notification', (notification) => {
        console.log('📬 New notification received:', notification);
        dispatch(addNotification(notification));
        
        // Show toast notification
        toast(
          <div>
            <div className="font-semibold text-sm">{notification.title}</div>
            <div className="text-xs text-gray-600">{notification.message}</div>
          </div>,
          {
            icon: '🔔',
            duration: 4000,
          }
        );
      });
    } catch (error) {
      console.warn('Socket connection failed:', error);
    }

    return () => {
      socketService.off('notification');
    };
  }, [isAuthenticated, user, dispatch]);
};
