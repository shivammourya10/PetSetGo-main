import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error: Could not connect to the backend server', error);
      
      // Create a more descriptive error message
      const errorMessage = error.code === 'ECONNREFUSED' 
        ? 'Connection refused. Please check if the backend server is running.'
        : 'Network error. Please check your internet connection and try again.';
      
      error.message = errorMessage;
      return Promise.reject(error);
    }
    // Handle 401 (Unauthorized) - redirect to login
    else if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error.response.data);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Create a more user-friendly redirect with message
      const currentPath = window.location.pathname;
      window.location.href = `/user/login?redirect=${encodeURIComponent(currentPath)}&message=${encodeURIComponent('Your session has expired. Please log in again.')}`;
    }
    return Promise.reject(error);
  }
);

export default api;
