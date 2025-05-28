
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

console.log('API Base URL configured as:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Making API request to:', config.url, 'with base URL:', config.baseURL);
  console.log('Full URL:', `${config.baseURL}${config.url}`);
  console.log('Request data:', config.data);
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
      console.error('Network error - backend may not be running');
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; username: string; password: string }) => {
    console.log('Calling register API with data:', { email: data.email, username: data.username });
    return api.post('/auth/register', data);
  },
  login: (data: { email: string; password: string }) => {
    console.log('Calling login API with email:', data.email);
    return api.post('/auth/login', data);
  },
};

// Pricing API
export const pricingAPI = {
  getTiers: () => api.get('/pricing/tiers'),
};

// Deployments API
export const deploymentsAPI = {
  create: (data: { prompt: string; providers: string[]; auto_terminate_hours?: number }) =>
    api.post('/deployments', data),
  getAll: () => api.get('/deployments'),
  get: (id: string) => api.get(`/deployments/${id}`),
  terminate: (id: string) => api.delete(`/deployments/${id}`),
};

// Cloud Providers API
export const cloudProvidersAPI = {
  add: (data: { provider_name: string; credentials: Record<string, any> }) =>
    api.post('/cloud-providers', data),
  getAll: () => api.get('/cloud-providers'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  getDashboardStats: () => api.get('/dashboard/stats'),
};
