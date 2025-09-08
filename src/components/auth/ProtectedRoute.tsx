import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, token } = useAuthContext();
  const location = useLocation();

  console.log('ProtectedRoute rendered with:', { isAuthenticated, user: !!user, token: !!token, location: location.pathname });

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    // Redirect to login page with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};
