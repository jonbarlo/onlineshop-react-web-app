import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { CategoryNavigation } from './CategoryNavigation';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Set dynamic page title based on route
  useDocumentTitle();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />
      {!isAdminRoute && <CategoryNavigation />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
