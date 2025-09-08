import React from 'react';
import { InputProps } from '@/types';
import { clsx } from 'clsx';

export const Input = React.forwardRef<HTMLInputElement, InputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>>(({
  label,
  error,
  required = false,
  disabled = false,
  placeholder,
  type = 'text',
  value,
  onChange,
  className,
  ...props
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={clsx(
          'input',
          error && 'border-error-500 focus-visible:ring-error-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error-500">{error}</p>
      )}
    </div>
  );
});
