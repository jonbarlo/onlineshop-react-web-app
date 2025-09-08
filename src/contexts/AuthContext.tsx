import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthState } from '@/types';
import { apiService } from '@/services/api';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log('AuthProvider: Loading auth from localStorage:', { token: !!token, user: !!userStr });
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
        console.log('AuthProvider: Auth state loaded from localStorage:', { user, token: !!token, isAuthenticated: true });
      } catch (error) {
        console.error('AuthProvider: Error parsing user from localStorage:', error);
        // Invalid user data, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    console.log('AuthProvider: login called with:', { username, password });
    try {
      const response = await apiService.login(username, password);
      console.log('AuthProvider: Login API response:', response);
      
      if (response.success && response.data) {
        console.log('AuthProvider: Response data structure:', response.data);
        const { token, user } = response.data;
        console.log('AuthProvider: Login successful, storing data:', { token, user });
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update state
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
        
        console.log('AuthProvider: Auth state updated:', { user, token, isAuthenticated: true });
        return { success: true, error: null };
      } else {
        console.log('AuthProvider: Login failed - response not successful:', response);
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error: unknown) {
      console.error('AuthProvider: Login error:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Login failed';
      return { success: false, error: errorMessage || 'Login failed' };
    }
  }, []);

  const logout = useCallback(() => {
    console.log('AuthProvider: logout called');
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    console.log('AuthProvider: Auth state cleared');
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
  };

  console.log('AuthProvider: Rendering with auth state:', { isAuthenticated: authState.isAuthenticated, user: !!authState.user, token: !!authState.token });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
