import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../stores/authStore.js';
import useNotificationStore from '../stores/notificationStore.js';
import useChatStore from '../stores/chatStore.js';

// Single socket instance shared across the whole app
let socket = null;

export const getSocket = () => socket;

// Call this ONCE at the App level
export const useSocketInit = () => {
  const { token, user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { addMessage, setTyping } = useChatStore();

  useEffect(() => {
    if (!token || !user) {
      // If logged out, disconnect
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      return;
    }

    // Already connected with same token — don't reconnect
    if (socket?.connected) return;

    // Disconnect stale socket before creating new one
    if (socket) {
      socket.disconnect();
      socket = null;
    }

    socket = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socket.on('new_message', (message) => {
      addMessage(message);
    });

    socket.on('typing', ({ userId, isTyping }) => {
      setTyping(userId, isTyping);
    });

    socket.on('notification', (notification) => {
      addNotification(notification);
    });

    // No cleanup on unmount — socket stays alive for the whole session
    // It only disconnects when user logs out (handled above)
  }, [token, user?._id]);
};

// Lightweight hook for components that just need to emit — no listeners
const useSocket = () => socket;

export default useSocket;
