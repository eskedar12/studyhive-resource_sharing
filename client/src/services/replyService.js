import api from './api.js';

const replyService = {
  getReplies: async (postId) => {
    const res = await api.get(`/replies/${postId}`);
    return res.data;
  },

  createReply: async (postId, formData) => {
    const res = await api.post(`/replies/${postId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteReply: async (id) => {
    await api.delete(`/replies/${id}`);
  },
};

export default replyService;