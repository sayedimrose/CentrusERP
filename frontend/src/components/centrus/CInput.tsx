import React from 'react';

export interface CInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label displayed above input */
  label?: string;
  /** Helper text below */
  helperText?: string;
  /** Error message (overrides helperText) */
  error?: string;
  /** Whether the field is required (adds asterisk) */
  required?: boolean;
  /** Leading icon inside input */
  leadingIcon?: React.ReactNode;
  /** Trailing icon inside input */
  trailingIcon?: React.ReactNode;
  /** Full width */
  fullWidth?: boolean;
  /** Input size */
  inputSize?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<string, string> = {
  sm: 'py-1 px-2.5 text-xs',
  md: 'py-2 px-3 text-sm',
  lg: 'py-2.5 px-3.5 text-base',
};

export default function CInput({
  label,
  helperText,
  error,
  required = false,
  leadingIcon,
  trailingIcon,
  fullWidth = true,
  inputSize = 'md',
  className = '',
  id,
  ...rest
}: CInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text-main mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leadingIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            {leadingIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            block border border-border-subtle rounded-md leading-5
            bg-gray-50 text-text-main placeholder-text-muted
            focus:outline-none focus:bg-white focus:ring-[1.5px] focus:ring-inset focus:ring-primary focus:border-primary
            transition-all
            ${sizeClasses[inputSize]}
            ${leadingIcon ? 'pl-10' : ''}
            ${trailingIcon ? 'pr-10' : ''}
            ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `.trim()}
          {...rest}
        />
        {trailingIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted">
            {trailingIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-xs ${error ? 'text-red-500' : 'text-text-muted'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
