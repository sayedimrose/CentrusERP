import React from 'react';

export type CBadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';

export interface CBadgeProps {
  children: React.ReactNode;
  variant?: CBadgeVariant;
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

export default function CBadge({
  children,
  variant = 'default',
  dot = false,
  dotColor,
  className = '',
}: CBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full
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
