import api from './api.js';

const notificationService = {
  getNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },

  markAsRead: async (id) => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    await api.patch('/notifications/read-all');
  },
};

export default notificationService;