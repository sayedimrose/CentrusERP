import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface CSelectOption {
  label: string;
  value: string;
}

export interface CSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: CSelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  selectSize?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<string, string> = {
  sm: 'py-1 pl-2.5 pr-8 text-xs',
  md: 'py-2 pl-3 pr-8 text-sm',
  lg: 'py-2.5 pl-3.5 pr-8 text-base',
};

export default function CSelect({
  label,
  error,
  helperText,
  required = false,
  options,
  placeholder = 'Select...',
  fullWidth = true,
  selectSize = 'md',
  className = '',
  id,
  ...rest
}: CSelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-text-main mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`
            block border border-border-subtle rounded-md leading-5
            bg-gray-50 text-text-main
            focus:outline-none focus:bg-white focus:ring-[1.5px] focus:ring-inset focus:ring-primary focus:border-primary
            appearance-none transition-all
            ${sizeClasses[selectSize]}
            ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `.trim()}
          {...rest}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-text-muted">
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-xs ${error ? 'text-red-500' : 'text-text-muted'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
