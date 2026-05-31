import api from './api.js';

const authService = {
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export default authService;