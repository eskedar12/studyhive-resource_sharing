import api from './api.js';

const messageService = {
  getConversations: async () => {
    const res = await api.get('/messages/conversations');
    return res.data;
  },

  getMessages: async (userId) => {
    const res = await api.get(`/messages/${userId}`);
    return res.data;
  },

  sendMessage: async (toUserId, content) => {
    const res = await api.post('/messages', { to: toUserId, content });
    return res.data;
  },
};

export default messageService;