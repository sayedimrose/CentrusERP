import React from 'react';

export type CIconBadgeSize = 'sm' | 'md' | 'lg';

export interface CIconBadgeProps {
  icon: React.ReactNode;
  /** Combined bg + text color classes e.g. 'bg-primary-light text-primary' */
  colorClass?: string;
  size?: CIconBadgeSize;
  /** Shape: rounded-lg (default) or rounded-full */
  shape?: 'square' | 'circle';
  className?: string;
}

const sizeClasses: Record<CIconBadgeSize, string> = {
  sm: 'w-6 h-6',
  md: 'w-7 h-7',
  lg: 'w-8 h-8',
};

export default function CIconBadge({
  icon,
  colorClass = 'bg-gray-100 text-gray-500',
  size = 'md',
  shape = 'square',
  className = '',
}: CIconBadgeProps) {
  return (
    <div
      className={`
        flex items-center justify-center flex-shrink-0
        ${sizeClasses[size]}
        ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}
        ${colorClass}
        ${className}
      `.trim()}
    >
      {icon}
    </div>
  );
}
