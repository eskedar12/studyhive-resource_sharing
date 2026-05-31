import { create } from 'zustand';
import authService from '../services/authService.js';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const user = await authService.getMe();
      set({ user, token });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.login(credentials);
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.register(data);
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  updateUser: (updatedUser) => set({ user: updatedUser }),

  clearError: () => set({ error: null }),
}));

export default useAuthStore;