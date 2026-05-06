import React from 'react';

export type CAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface CAvatarProps {
  /** Initials or single character */
  initials: string;
  /** Color classes: bg + text combined e.g. 'bg-primary/10 text-primary' */
  colorClass?: string;
  /** Size */
  size?: CAvatarSize;
  /** Additional className */
  className?: string;
}

const sizeClasses: Record<CAvatarSize, string> = {
  xs: 'w-6 h-6 text-[9px]',
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
};

export default function CAvatar({
  initials,
  colorClass = 'bg-gray-100 text-gray-500',
  size = 'md',
  className = '',
}: CAvatarProps) {
  return (
    <div
      className={`
        rounded-full flex items-center justify-center font-bold flex-shrink-0
        ${sizeClasses[size]}
        ${colorClass}
        ${className}
      `.trim()}
    >
      {initials}
    </div>
  );
}
