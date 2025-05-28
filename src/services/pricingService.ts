
import { api } from './apiConfig';

export const pricingAPI = {
  getTiers: () => api.get('/pricing/tiers'),
};
