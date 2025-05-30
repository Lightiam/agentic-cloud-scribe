
import axios from 'axios';

// Check if we're in development and prefer localhost
const isDevelopment = import.meta.env.DEV;
const envApiUrl = import.meta.env.VITE_API_BASE_URL;

// Use localhost in development if no specific API URL is set, otherwise use the env variable
const API_BASE_URL = envApiUrl || 'http://localhost:5000';

console.log('Environment:', isDevelopment ? 'development' : 'production');
console.log('VITE_API_BASE_URL from env:', envApiUrl);
console.log('Final API Base URL configured as:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Making API request to:', config.url, 'with base URL:', config.baseURL);
  console.log('Full URL:', `${config.baseURL}${config.url}`);
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API error intercepted:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });
    
    // Check if it's a network error
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('Network error - backend may not be running at:', API_BASE_URL);
      console.error('To start the backend server:');
      console.error('1. Run: cd backend && npm run dev');
      console.error('2. Or use the startup scripts: ./start_backend.sh (Linux/Mac) or start_backend.bat (Windows)');
    }
    
    return Promise.reject(error);
  }
);
