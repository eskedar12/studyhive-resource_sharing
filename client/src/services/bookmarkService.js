import api from './api.js';

const bookmarkService = {
  getSaved: async () => {
    const res = await api.get('/posts/saved');
    return res.data;
  },
};

export default bookmarkService;