import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://stugig.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Network error (backend not running)
    if (!error.response) {
      console.error('Network Error:', error.message);
      toast.error('Cannot connect to server. Please ensure backend is running on port 5000.');
      return Promise.reject({ 
        message: 'Network error: Cannot connect to server',
        status: 0,
        data: null 
      });
    }
    
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Something went wrong';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 404) {
      // Don't show toast for 404s, let component handle it
    } else if (error.response?.status === 429) {
      toast.error('Too many requests. Please wait a moment.');
    } else if (error.response?.status === 529) {
      toast.error('Service temporarily unavailable. Please try again.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.status === 400) {
      // Show validation errors
      toast.error(message);
    }
    
    return Promise.reject({ 
      message,
      status: error.response?.status,
      data: error.response?.data 
    });
  }
);

export default api;
