import { useEffect } from 'react';
import useNotificationStore from '../stores/notificationStore.js';
import useAuth from './useAuth.js';

const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  const store = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated) {
      store.fetchNotifications();
    }
  }, [isAuthenticated]);

  return store;
};

export default useNotifications;