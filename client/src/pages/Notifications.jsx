import { useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import useNotificationStore from '../stores/notificationStore.js';
import NotificationList from '../components/notifications/NotificationList.jsx';

const Notifications = () => {
  const { notifications, isLoading, unreadCount, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bell size={22} className="text-sky-400" /> Notifications
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors"
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>
      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        onMarkRead={markAsRead}
      />
    </div>
  );
};

export default Notifications;