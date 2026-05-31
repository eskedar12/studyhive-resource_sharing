import useAuthStore from '../stores/authStore.js';

const useAuth = () => {
  const { user, token, isLoading, error, login, register, logout, clearError } = useAuthStore();

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
  };
};

export default useAuth;