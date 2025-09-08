import React from 'react';
import { clsx } from 'clsx';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  children,
  className,
}) => {
  const typeStyles = {
    success: {
      container: 'bg-success-50 border-success-200 text-success-800',
      icon: 'text-success-600',
      IconComponent: CheckCircle,
    },
    error: {
      container: 'bg-error-50 border-error-200 text-error-800',
      icon: 'text-error-600',
      IconComponent: AlertCircle,
    },
    warning: {
      container: 'bg-warning-50 border-warning-200 text-warning-800',
      icon: 'text-warning-600',
      IconComponent: AlertTriangle,
    },
    info: {
      container: 'bg-primary-50 border-primary-200 text-primary-800',
      icon: 'text-primary-600',
      IconComponent: Info,
    },
  };

  const { container, icon, IconComponent } = typeStyles[type];

  return (
    <div
      className={clsx(
        'flex items-start p-4 border rounded-lg',
        container,
        className
      )}
    >
      <IconComponent className={clsx('h-5 w-5 mt-0.5 mr-3 flex-shrink-0', icon)} />
      <div className="flex-1">
        {title && (
          <h3 className="font-medium mb-1">{title}</h3>
        )}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};
