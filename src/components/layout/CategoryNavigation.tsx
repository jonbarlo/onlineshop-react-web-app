import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Gamepad2, 
  BookOpen, 
  Car, 
  Heart, 
  Baby,
  MoreHorizontal 
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const categories: Category[] = [
  { id: 'electronics', name: 'Electronics', icon: Smartphone, href: '/category/electronics' },
  { id: 'clothing', name: 'Clothing', icon: Shirt, href: '/category/clothing' },
  { id: 'home', name: 'Home & Garden', icon: Home, href: '/category/home' },
  { id: 'sports-outdoors', name: 'Sports & Outdoors', icon: Gamepad2, href: '/category/sports-outdoors' },
  { id: 'books', name: 'Books', icon: BookOpen, href: '/category/books' },
  { id: 'automotive', name: 'Automotive', icon: Car, href: '/category/automotive' },
  { id: 'health', name: 'Health & Beauty', icon: Heart, href: '/category/health' },
  { id: 'baby', name: 'Baby & Kids', icon: Baby, href: '/category/baby' },
];

export const CategoryNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => {
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
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2 overflow-x-auto scrollbar-hide">
            {categories.slice(0, 6).map((category) => {
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
            })}
            
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
