import api from './api';

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
