
import { api } from './apiConfig';

export interface DeploymentRequest {
  prompt: string;
  providers: string[];
  auto_terminate_hours?: number;
  environment?: string;
}

export interface DeploymentResponse {
  deployment_id: string;
  status: string;
  estimated_cost: number;
  instance_details: Record<string, any>;
}

export interface Deployment {
  deployment_id: string;
  prompt: string;
  provider: string;
  status: string;
  cost_estimate: number;
  created_at: string;
  instance_config: Record<string, any>;
  parsed_requirements?: Record<string, any>;
}

export const deploymentsAPI = {
  create: (data: DeploymentRequest): Promise<{ data: DeploymentResponse }> =>
    api.post('/deployments', data),
  
  getAll: (): Promise<{ data: Deployment[] }> => 
    api.get('/deployments'),
  
  get: (id: string): Promise<{ data: Deployment }> => 
    api.get(`/deployments/${id}`),
  
  terminate: (id: string): Promise<{ data: { message: string } }> => 
    api.delete(`/deployments/${id}`),
  
  getDashboardStats: () => 
    api.get('/dashboard/stats'),
};
