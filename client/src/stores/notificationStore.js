import { create } from 'zustand';
import notificationService from '../services/notificationService.js';
import toast from 'react-hot-toast';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const notifications = await notificationService.getNotifications();
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationService.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {}
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch {}
  },

  addNotification: (notification) => {
    // Deduplicate
    const exists = get().notifications.some((n) => String(n._id) === String(notification._id));
    if (exists) return;

    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    // Show toast for every incoming notification
    const icon = notification.type === 'message' ? '💬'
      : notification.type === 'reply' ? '💬'
      : '🔔';

    toast(notification.message, {
      icon,
      duration: 4000,
      style: {
        background: '#0d1425',
        color: '#e2e8f0',
        border: '1px solid #1e3a5f',
        fontSize: '14px',
        maxWidth: '360px',
      },
    });
  },
}));

export default useNotificationStore;
