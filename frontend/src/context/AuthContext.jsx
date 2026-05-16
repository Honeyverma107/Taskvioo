// AuthContext.jsx

import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import api from '../api/axios';
import { TOKEN_KEY } from '../constants/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [initialized, setInitialized] = useState(false);

  // Initialize Auth
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      // Set auth header
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      const res = await api.get('/auth/me');

      setUser(res.data);

    } catch (error) {

      console.error('Auth initialization failed:', error);

      localStorage.removeItem(TOKEN_KEY);

      delete api.defaults.headers.common.Authorization;

      setUser(null);

    } finally {

      setLoading(false);

      setInitialized(true);
    }
  };

  // Login
  const login = (token, userData) => {

    localStorage.setItem(TOKEN_KEY, token);

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    setUser(userData);
  };

  // Logout
  const logout = () => {

    localStorage.removeItem(TOKEN_KEY);

    delete api.defaults.headers.common.Authorization;

    setUser(null);

    window.location.href = '/login';
  };

  // Update user
  const updateUser = (data) => {
    setUser((prev) => ({
      ...prev,
      ...data
    }));
  };

  // Check role
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  // Check auth
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        updateUser,
        loading,
        initialized,
        isAuthenticated,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export const useAuth = () => {
  return useContext(AuthContext);
};