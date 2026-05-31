import api from './api.js';

const searchService = {
  search: async (query) => {
    const res = await api.get('/search', { params: { q: query } });
    return res.data;
  },
};

export default searchService;