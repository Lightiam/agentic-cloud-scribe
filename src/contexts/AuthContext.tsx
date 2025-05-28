
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authUtils, tokenStorage } from '@/utils/authUtils';
import type { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(tokenStorage.get());
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
      const userData = await authUtils.fetchUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const accessToken = await authUtils.performLogin({ email, password });
      
      tokenStorage.set(accessToken);
      setToken(accessToken);
      
      await fetchUserProfile();
    } catch (error: any) {
      authUtils.logError('Login', email, error);
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const accessToken = await authUtils.performRegister({ email, username, password });
      
      tokenStorage.set(accessToken);
      setToken(accessToken);
      
      await fetchUserProfile();
    } catch (error: any) {
      authUtils.logError('Registration', email, error);
      throw error;
    }
  };

  const logout = () => {
    tokenStorage.remove();
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
