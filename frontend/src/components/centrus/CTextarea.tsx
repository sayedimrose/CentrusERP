import React from 'react';

export interface CTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
}

export default function CTextarea({
  label,
  error,
  helperText,
  required = false,
  fullWidth = true,
  className = '',
  id,
  rows = 3,
  ...rest
}: CTextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-text-main mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`
          block border border-border-subtle rounded-md leading-5
          bg-gray-50 text-text-main placeholder-text-muted
          focus:outline-none focus:bg-white focus:ring-[1.5px] focus:ring-inset focus:ring-primary focus:border-primary
          transition-all py-2 px-3 text-sm resize-none
          ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `.trim()}
        {...rest}
      />
      {(error || helperText) && (
        <p className={`mt-1 text-xs ${error ? 'text-red-500' : 'text-text-muted'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
