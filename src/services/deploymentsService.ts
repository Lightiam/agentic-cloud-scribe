
import { api } from './apiConfig';

export const deploymentsAPI = {
  create: (data: { prompt: string; providers: string[]; auto_terminate_hours?: number }) =>
    api.post('/deployments', data),
  getAll: () => api.get('/deployments'),
  get: (id: string) => api.get(`/deployments/${id}`),
  terminate: (id: string) => api.delete(`/deployments/${id}`),
};
