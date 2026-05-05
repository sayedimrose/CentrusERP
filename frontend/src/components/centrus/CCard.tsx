import React from 'react';

export interface CCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Whether to show the border */
  bordered?: boolean;
  /** Whether to show rounded corners */
  rounded?: boolean;
  /** Column span for grid layouts */
  colSpan?: number;
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export default function CCard({
  padding = 'md',
  bordered = true,
  rounded = true,
  colSpan,
  className = '',
  children,
  style,
  ...rest
}: CCardProps) {
  return (
    <div
      className={`
        bg-surface
        ${bordered ? 'border border-border-subtle' : ''}
        ${rounded ? 'rounded-xl' : ''}
        ${paddingClasses[padding]}
        ${colSpan ? `col-span-${colSpan}` : ''}
        ${className}
      `.trim()}
      style={colSpan && colSpan > 1 ? { ...style, gridColumn: `span ${colSpan}` } : style}
      {...rest}
    >
      {children}
    </div>
  );
}
