import { useState, useEffect, useCallback } from 'react';
import { AuthState } from '@/types';
import { apiService } from '@/services/api';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        // Invalid user data, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    console.log('useAuth login called with:', { username, password });
    try {
      const response = await apiService.login(username, password);
      console.log('Login API response:', response);
      
      if (response.success && response.data) {
        console.log('Response data structure:', response.data);
        const { token, user } = response.data;
        console.log('Login successful, storing data:', { token, user });
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update state
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
        
        console.log('Auth state updated:', { user, token, isAuthenticated: true });
        return { success: true, error: null };
      } else {
        console.log('Login failed - response not successful:', response);
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Login failed';
      return { success: false, error: errorMessage || 'Login failed' };
    }
  }, []);

  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  }, []);

  return {
    ...authState,
    login,
    logout,
  };
};
