import api from './api';

// Log the base URL to help debug connectivity issues
console.log("API is configured with baseURL:", api.defaults.baseURL);

// Authentication services
const AuthService = {
  // Register a new user
  register: (userData) => {
    return api.post('/api/auth/register', userData);
  },

  // Login user
  login: (credentials) => {
    return api.post('/api/auth/login', credentials);
  },

  // Logout user
  logout: () => {
    return api.post('/api/auth/logout');
  },
};

export default AuthService;
