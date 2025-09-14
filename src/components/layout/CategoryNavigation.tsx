import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Gamepad2, 
  BookOpen, 
  Car, 
  Heart, 
  Baby,
  MoreHorizontal,
  Package
} from 'lucide-react';
import { apiService } from '@/services/api';
import { Category as DbCategory } from '@/types';

// Icon mapping for categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'electronics': Smartphone,
  'clothing': Shirt,
  'home': Home,
  'sports': Gamepad2,
  'books': BookOpen,
  'automotive': Car,
  'health': Heart,
  'baby': Baby,
  'default': Package, // fallback icon
};

export const CategoryNavigation: React.FC = () => {
  const location = useLocation();

  // Fetch categories from database
  const { data: categoriesData, isLoading } = useQuery(
    ['categories'],
    () => apiService.getCategories(),
    {
      keepPreviousData: true,
      staleTime: 15 * 60 * 1000, // 15 minutes
    }
  );

  // Transform database categories to display format
  const categories = (categoriesData?.data || [])
    .filter((cat: DbCategory) => cat.isActive === true) // Only show active categories
    .map((cat: DbCategory) => ({
      id: cat.id || cat.slug,
      name: cat.name,
      icon: categoryIcons[cat.slug] || categoryIcons.default,
      href: `/category/${cat.slug}`,
    }));

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isLoading ? (
              <div className="flex items-center space-x-4">
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              </div>
            ) : (
              categories.map((category) => {
              const Icon = category.icon;
              const isActive = location.pathname === category.href;
              
              return (
                <Link
                  key={category.id}
                  to={category.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20'
                      : 'nav-link'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              );
              })
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2 overflow-x-auto scrollbar-hide">
            {isLoading ? (
              <>
                <div className="animate-pulse bg-gray-200 h-12 w-16 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-12 w-16 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-12 w-16 rounded"></div>
              </>
            ) : (
              categories.slice(0, 6).map((category) => {
              const Icon = category.icon;
              const isActive = location.pathname === category.href;
              
              return (
                <Link
                  key={category.id}
                  to={category.href}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-fit ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20'
                      : 'nav-link'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{category.name}</span>
                </Link>
              );
              })
            )}
            
            {/* More button for mobile */}
            <button className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg nav-link min-w-fit">
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-xs font-medium">More</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
