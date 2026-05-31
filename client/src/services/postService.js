import api from './api.js';

const postService = {
  getPosts: async ({ filter = 'new', page = 1, limit = 10 } = {}) => {
    const res = await api.get('/posts', { params: { filter, page, limit } });
    return res.data;
  },

  getPost: async (id) => {
    const res = await api.get(`/posts/${id}`);
    return res.data;
  },

  createPost: async (formData) => {
    const res = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updatePost: async (id, data) => {
    const res = await api.put(`/posts/${id}`, data);
    return res.data;
  },

  deletePost: async (id) => {
    await api.delete(`/posts/${id}`);
  },

  toggleSave: async (id) => {
    const res = await api.post(`/posts/${id}/save`);
    return res.data;
  },

  markSolved: async (id) => {
    const res = await api.patch(`/posts/${id}/solved`);
    return res.data;
  },

  getSavedPosts: async () => {
    const res = await api.get('/posts/saved');
    return res.data;
  },
};

export default postService;