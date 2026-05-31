import NotificationItem from './NotificationItem.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const NotificationList = ({ notifications, isLoading, onMarkRead }) => {
  if (isLoading) return <LoadingSpinner className="py-12" />;

  if (notifications.length === 0) {
    return (
      <div className="text-center text-slate-500 text-sm py-12">
        No notifications yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((n) => (
        <NotificationItem key={n._id} notification={n} onRead={onMarkRead} />
      ))}
    </div>
  );
};

export default NotificationList;