import { Link } from 'react-router-dom';
import { timeAgo } from '../../utils/formatDate.js';
import { MessageSquare, Bookmark, Bell } from 'lucide-react';

const icons = {
  reply: <MessageSquare size={14} className="text-sky-400" />,
  save: <Bookmark size={14} className="text-amber-400" />,
  default: <Bell size={14} className="text-slate-400" />,
};

const NotificationItem = ({ notification, onRead }) => {
  const icon = icons[notification.type] || icons.default;

  return (
    <Link
      to={notification.link || '#'}
      onClick={() => !notification.isRead && onRead(notification._id)}
      className={`flex items-start gap-3 p-4 rounded-xl border transition-colors hover:border-slate-600 ${
        notification.isRead
          ? 'bg-[#0d1425] border-slate-800 opacity-60'
          : 'bg-[#111827] border-sky-900/40'
      }`}
    >
      <div className="w-8 h-8 bg-[#1a2640] rounded-full flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200">{notification.message}</p>
        <p className="text-xs text-slate-500 mt-1">{timeAgo(notification.createdAt)}</p>
      </div>
      {!notification.isRead && (
        <span className="w-2 h-2 bg-sky-400 rounded-full shrink-0 mt-2" />
      )}
    </Link>
  );
};

export default NotificationItem;