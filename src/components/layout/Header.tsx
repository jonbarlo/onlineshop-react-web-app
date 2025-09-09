import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCartContext } from '@/contexts/CartContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthContext();
  const { cart } = useCartContext();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 header-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <Package className="h-8 w-8 text-primary-600 dark:text-orange-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 gradient-full rounded-full opacity-80"></div>
            </div>
            <span className="text-xl font-bold text-secondary-900 dark:text-white">
              Shop 506
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-primary-600 dark:text-orange-400'
                  : 'text-secondary-600 dark:text-gray-300 hover:text-secondary-900 dark:hover:text-white'
              }`}
            >
              Products
            </Link>
            {isAuthenticated && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors ${
                  isAdminRoute
                    ? 'text-primary-600 dark:text-orange-400'
                    : 'text-secondary-600 dark:text-gray-300 hover:text-secondary-900 dark:hover:text-white'
                }`}
              >
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {!isAdminRoute && (
              <Link
                to="/cart"
                className="relative p-2 text-secondary-600 dark:text-gray-300 hover:text-secondary-900 dark:hover:text-white transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 dark:bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-gray-300">
                  <User className="h-4 w-4" />
                  <span>{user?.username}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-secondary-600 dark:text-gray-300 hover:text-secondary-900 dark:hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/admin/login">
                <Button variant="outline" size="sm">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
