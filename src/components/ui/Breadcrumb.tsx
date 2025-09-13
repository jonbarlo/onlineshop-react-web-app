import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  // Auto-generate breadcrumbs from current path if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t('navigation.home'), href: '/' }
    ];

    if (pathSegments[0] === 'admin') {
      breadcrumbs.push({ label: t('admin.dashboard'), href: '/admin' });
      
      if (pathSegments[1]) {
        const section = pathSegments[1];
        const sectionLabels: Record<string, string> = {
          'orders': t('admin.orders'),
          'products': t('admin.products'),
          'dashboard': t('admin.dashboard'),
          'categories': t('admin.categories')
        };
        
        breadcrumbs.push({
          label: sectionLabels[section] || section.charAt(0).toUpperCase() + section.slice(1),
          href: `/admin/${section}`
        });
        
        // Handle specific item pages (e.g., /admin/products/123/edit)
        if (pathSegments[2] && pathSegments[2] !== 'new') {
          const itemId = pathSegments[2];
          if (pathSegments[3] === 'edit') {
            breadcrumbs.push({
              label: `${t('common.edit')} ${sectionLabels[section]?.slice(0, -1) || section.slice(0, -1)} #${itemId}`,
              href: location.pathname
            });
          } else {
            breadcrumbs.push({
              label: `${sectionLabels[section]?.slice(0, -1) || section.slice(0, -1)} #${itemId}`,
              href: location.pathname
            });
          }
        } else if (pathSegments[2] === 'new') {
          breadcrumbs.push({
            label: `${t('common.add')} ${sectionLabels[section]?.slice(0, -1) || section.slice(0, -1)}`,
            href: location.pathname
          });
        }
      }
    } else {
      // Handle public pages
      pathSegments.forEach((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        breadcrumbs.push({ label, href });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 && (
            <Home className="h-4 w-4 text-gray-400" />
          )}
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link
              to={item.href}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className={`font-medium ${
              index === breadcrumbItems.length - 1 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
