
import { api } from './apiConfig';

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  getDashboardStats: () => api.get('/dashboard/stats'),
};
