import React from 'react';
import { ButtonProps } from '@/types';
import { clsx } from 'clsx';
import { useBrandTheme } from '@/contexts/ThemeContext';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  type = 'button',
  className,
  style,
}) => {
  const { theme } = useBrandTheme();
  
  const baseClasses = 'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white dark:ring-offset-gray-900';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme?.colors.primary,
          color: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        };
      case 'secondary':
        return {
          backgroundColor: theme?.colors.surface,
          color: theme?.colors.text,
          border: `1px solid ${theme?.colors.border}`,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme?.colors.text,
          border: `1px solid ${theme?.colors.border}`,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: theme?.colors.textSecondary,
        };
      default:
        return {
          backgroundColor: theme?.colors.primary,
          color: 'white',
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        baseClasses,
        sizeClasses[size],
        className
      )}
      style={{ ...variantStyles, ...style }}
      onMouseEnter={(e) => {
        if (variant === 'primary' && theme) {
          e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary' && theme) {
          e.currentTarget.style.backgroundColor = theme.colors.primary;
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
      }}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
