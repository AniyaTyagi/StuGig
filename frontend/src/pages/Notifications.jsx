import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notificationService } from '../services';
import { setNotifications, setUnreadCount, markAsRead } from '../redux/slices/notificationSlice';
import { Bell, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications();
      const data = response.data || response;
      dispatch(setNotifications(data.notifications || []));
      dispatch(setUnreadCount(data.unreadCount || 0));
    } catch (error) {
      console.error('Notification fetch error:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      dispatch(markAsRead(id));
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      fetchNotifications();
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Notifications</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Stay updated with your activities</p>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn-secondary flex items-center gap-2"
            >
              <Check size={16} />
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="card h-24 animate-pulse bg-white dark:bg-zinc-900"></div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`card flex items-start justify-between gap-4 ${
                  !notification.isRead ? 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500' : 'bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-2 rounded-full ${
                    !notification.isRead 
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'
                  }`}>
                    <Bell size={18} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{notification.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">{notification.message}</p>
                    <span className="text-xs text-slate-400 dark:text-zinc-500 mt-2 block">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card">
            <Bell className="mx-auto text-slate-300 dark:text-zinc-700 mb-4" size={48} />
            <p className="text-slate-500 dark:text-zinc-400">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
