import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup axios defaults
  axios.defaults.withCredentials = true;

  // Register function
  const register = async (username, password) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/register', {
        username,
        password
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, message: response.data.message };
      } else {
        setError(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'chạy server lên (chưa chạy server)';
      const errorField = err.response?.data?.field || null;
      setError(errorMessage);
      return { success: false, message: errorMessage, field: errorField };
    }
  };

  // Login function
  const login = async (username, password, rememberMe) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/login', {
        username,
        password,
        rememberMe
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setError(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'chạy server lên (chưa chạy server)';
      const errorField = err.response?.data?.field || null;
      setError(errorMessage);
      return { success: false, message: errorMessage, field: errorField };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/auth/check-auth');
        
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 