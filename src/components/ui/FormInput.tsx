import React from 'react';
import { clsx } from 'clsx';

interface FormInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  className?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps & React.InputHTMLAttributes<HTMLInputElement>>(({
  label,
  error,
  required = false,
  disabled = false,
  placeholder,
  type = 'text',
  className,
  ...props
}, ref) => {
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
