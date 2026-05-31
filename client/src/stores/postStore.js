import { create } from 'zustand';
import postService from '../services/postService.js';

const usePostStore = create((set, get) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  filter: 'new',
  page: 1,
  hasMore: true,

  setFilter: (filter) => set({ filter, posts: [], page: 1, hasMore: true }),

  fetchPosts: async (reset = false) => {
    const { filter, page } = get();
    if (reset) set({ posts: [], page: 1, hasMore: true });
    set({ isLoading: true });
    try {
      const data = await postService.getPosts({ filter, page: reset ? 1 : page });
      set((state) => ({
        posts: reset ? data.posts : [...state.posts, ...data.posts],
        hasMore: data.hasMore,
        page: reset ? 2 : state.page + 1,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchPost: async (id) => {
    set({ isLoading: true, currentPost: null });
    try {
      const post = await postService.getPost(id);
      set({ currentPost: post, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  createPost: async (formData) => {
    set({ isLoading: true });
    try {
      const post = await postService.createPost(formData);
      set((state) => ({ posts: [post, ...state.posts], isLoading: false }));
      return post;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to create post', isLoading: false });
      return null;
    }
  },

  deletePost: async (id) => {
    try {
      await postService.deletePost(id);
      // Use String() comparison to avoid ObjectId vs string mismatch
      set((state) => ({
        posts: state.posts.filter((p) => String(p._id) !== String(id)),
        currentPost: state.currentPost?._id === id ? null : state.currentPost,
      }));
      return true;
    } catch (err) {
      set({ error: err.message });
      return false;
    }
  },

  toggleSave: async (postId) => {
    try {
      const { saved } = await postService.toggleSave(postId);
      set((state) => ({
        posts: state.posts.map((p) =>
          String(p._id) === String(postId) ? { ...p, isSaved: saved } : p
        ),
        currentPost:
          state.currentPost?._id === postId
            ? { ...state.currentPost, isSaved: saved }
            : state.currentPost,
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  markSolved: async (postId) => {
    try {
      await postService.markSolved(postId);
      set((state) => ({
        posts: state.posts.map((p) =>
          String(p._id) === String(postId) ? { ...p, isSolved: true } : p
        ),
        currentPost:
          state.currentPost?._id === postId
            ? { ...state.currentPost, isSolved: true }
            : state.currentPost,
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },
}));

export default usePostStore;
