
import { authAPI } from '@/services/api';
import type { User, LoginCredentials, RegisterCredentials } from '@/types/auth';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem('access_token'),
  set: (token: string): void => localStorage.setItem('access_token', token),
  remove: (): void => localStorage.removeItem('access_token'),
};

export const authUtils = {
  async fetchUserProfile(): Promise<User> {
    const { userAPI } = await import('@/services/api');
    const response = await userAPI.getProfile();
    return response.data;
  },

  async performLogin(credentials: LoginCredentials): Promise<string> {
    console.log('AuthUtils: Login attempt for:', credentials.email);
    
    try {
      const response = await authAPI.login(credentials);
      console.log('AuthUtils: Login API response received');
      
      const { access_token } = response.data;
      console.log('AuthUtils: Login successful, returning token');
      
      return access_token;
    } catch (error: any) {
      console.error('AuthUtils: Login failed:', error);
      
      if (error.code === 'ERR_NETWORK' || !error.response) {
        throw new Error('Unable to connect to server. Please check if the backend is running on http://localhost:8000');
      }
      
      if (error.response?.status === 500) {
        throw new Error('Server error occurred. Please try again later or contact support.');
      }
      
      throw error;
    }
  },

  async performRegister(credentials: RegisterCredentials): Promise<string> {
    console.log('AuthUtils: Registration attempt for:', { 
      email: credentials.email, 
      username: credentials.username 
    });
    console.log('AuthUtils: API Base URL:', import.meta.env.VITE_API_BASE_URL);
    
    try {
      const response = await authAPI.register(credentials);
      console.log('AuthUtils: Registration API response received');
      
      const { access_token } = response.data;
      console.log('AuthUtils: Registration successful, returning token');
      
      return access_token;
    } catch (error: any) {
      console.error('AuthUtils: Registration failed:', error);
      
      if (error.code === 'ERR_NETWORK' || !error.response) {
        throw new Error('Unable to connect to server. Please check if the backend is running on http://localhost:8000');
      }
      
      if (error.response?.status === 500) {
        throw new Error('Server error occurred during registration. Please ensure the database is running and try again.');
      }
      
      if (error.response?.status === 400) {
        const detail = error.response.data?.detail;
        if (typeof detail === 'string') {
          throw new Error(detail);
        } else if (Array.isArray(detail)) {
          const errorMessages = detail.map((err: any) => 
            typeof err === 'string' ? err : err.msg || 'Validation error'
          ).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error('Invalid registration data provided');
      }
      
      throw error;
    }
  },

  logError(operation: string, email: string, error: any): void {
    console.error(`AuthUtils: ${operation} failed:`, error);
    
    // Enhanced error logging
    if (error?.response) {
      console.error(`AuthUtils: Response error:`, {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error?.request) {
      console.error(`AuthUtils: Request error:`, error.request);
    } else if (error?.code === 'ERR_NETWORK') {
      console.error(`AuthUtils: Network error - backend may not be running`);
    }
  }
};
