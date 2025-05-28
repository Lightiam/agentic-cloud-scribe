
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
    const response = await authAPI.login(credentials);
    console.log('AuthUtils: Login API response received');
    
    const { access_token } = response.data;
    console.log('AuthUtils: Login successful, returning token');
    
    return access_token;
  },

  async performRegister(credentials: RegisterCredentials): Promise<string> {
    console.log('AuthUtils: Registration attempt for:', { 
      email: credentials.email, 
      username: credentials.username 
    });
    console.log('AuthUtils: API Base URL:', import.meta.env.VITE_API_BASE_URL);
    
    const response = await authAPI.register(credentials);
    console.log('AuthUtils: Registration API response received');
    
    const { access_token } = response.data;
    console.log('AuthUtils: Registration successful, returning token');
    
    return access_token;
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
    }
  }
};
