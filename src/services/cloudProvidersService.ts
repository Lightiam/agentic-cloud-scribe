
import { api } from './apiConfig';

export const cloudProvidersAPI = {
  add: (data: { provider_name: string; credentials: Record<string, any> }) =>
    api.post('/cloud-providers', data),
  getAll: () => api.get('/cloud-providers'),
};
