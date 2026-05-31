import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import useNotificationStore from '../../stores/notificationStore.js';

const NotificationBell = () => {
  const { unreadCount } = useNotificationStore();

  return (
    <Link to="/notifications" className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#111827] transition-colors">
      <Bell size={18} />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;