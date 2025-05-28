
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
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
