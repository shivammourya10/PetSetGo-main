import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/AuthService';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        
        // Verify we have a valid user with MongoDB ObjectId
        if (parsedUser && parsedUser._id && parsedUser._id.match(/^[0-9a-fA-F]{24}$/)) {
          // We have a valid MongoDB ObjectId
          setUser(parsedUser);
        } else {
          // Invalid user data - clear everything
          console.warn('Invalid user data found in localStorage');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await AuthService.login(credentials);
      
      // Validate the response data
      if (!response.data || !response.data.user || !response.data.token) {
        throw new Error('Invalid response from server');
      }

      const { user, token } = response.data;
      
      // Ensure we have a valid user with MongoDB ObjectId
      if (!user._id || !user._id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid user ID from server');
      }

      // Store the complete user data and token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setError(null);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await AuthService.register(userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
