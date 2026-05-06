import React from 'react';

export type CButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
export type CButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface CButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CButtonVariant;
  size?: CButtonSize;
  icon?: React.ReactNode | React.ElementType;
  iconOnly?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<CButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover border-primary',
  outline:
    'bg-transparent text-text-muted border-border-subtle hover:bg-gray-50 hover:text-text-main',
  ghost:
    'bg-transparent text-text-muted border-transparent hover:bg-gray-100 hover:text-text-main',
  danger:
    'bg-red-500 text-white hover:bg-red-600 border-red-500',
};

const sizeClasses: Record<CButtonSize, string> = {
  xs: 'h-7 px-2 text-xs gap-1 rounded',
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-9 px-4 text-sm gap-2 rounded-md',
  lg: 'h-10 px-5 text-sm gap-2 rounded-lg',
};

export default function CButton({
  variant = 'primary',
  size = 'md',
  icon,
  iconOnly = false,
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...rest
}: CButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold border transition-colors
        focus:outline-none focus:ring-[1.5px] focus:ring-primary/30
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${iconOnly ? `${size === 'xs' ? 'w-7 h-7' : size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-10 h-10' : 'w-9 h-9'} !px-0` : sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        React.isValidElement(icon) ? (
          icon
        ) : (
          React.createElement(icon as React.ComponentType<any>, { 
            className: iconOnly ? 'w-5 h-5' : 'w-4 h-4' 
          })
        )
      ) : null}
      {!iconOnly && children}
    </button>
  );
}
