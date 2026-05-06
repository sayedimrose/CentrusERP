import React from 'react';

export type CBadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';

export interface CBadgeProps {
  children: React.ReactNode;
  variant?: CBadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  /** Dot indicator before text */
  dot?: boolean;
  /** Custom dot color class */
  dotColor?: string;
  /** Custom className override */
  className?: string;
}

const variantClasses: Record<CBadgeVariant, string> = {
  default:  'bg-gray-100 text-gray-600',
  success:  'bg-green-100 text-green-700',
  warning:  'bg-orange-100 text-orange-700',
  danger:   'bg-red-100 text-red-600',
  info:     'bg-blue-100 text-blue-700',
  primary:  'bg-primary-light text-primary',
};

const dotColors: Record<CBadgeVariant, string> = {
  default:  'bg-gray-400',
  success:  'bg-green-500',
  warning:  'bg-orange-500',
  danger:   'bg-red-500',
  info:     'bg-blue-500',
  primary:  'bg-primary',
};

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
};

export default function CBadge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  dotColor,
  className = '',
}: CBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `.trim()}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor || dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
