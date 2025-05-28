
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';

interface User {
  id: number;
  email: string;
  username: string;
  subscription_tier: string;
  created_at: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const { userAPI } = await import('@/services/api');
      const response = await userAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Login attempt for:', email);
      const response = await authAPI.login({ email, password });
      console.log('AuthContext: Login API response received');
      
      const { access_token } = response.data;
      
      console.log('AuthContext: Login successful, storing token');
      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      
      await fetchUserProfile();
    } catch (error: any) {
      console.error('AuthContext: Login failed:', error);
      
      // Enhanced error logging
      if (error?.response) {
        console.error('AuthContext: Response error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else if (error?.request) {
        console.error('AuthContext: Request error:', error.request);
      }
      
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      console.log('AuthContext: Registration attempt for:', { email, username });
      console.log('AuthContext: API Base URL:', import.meta.env.VITE_API_BASE_URL);
      
      const response = await authAPI.register({ email, username, password });
      console.log('AuthContext: Registration API response received');
      
      const { access_token } = response.data;
      
      console.log('AuthContext: Registration successful, storing token');
      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      
      await fetchUserProfile();
    } catch (error: any) {
      console.error('AuthContext: Registration failed:', error);
      
      // Enhanced error logging
      if (error?.response) {
        console.error('AuthContext: Response error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else if (error?.request) {
        console.error('AuthContext: Request error:', error.request);
      }
      
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
