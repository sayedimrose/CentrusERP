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
  /** Optional title */
  title?: string;
  /** Optional icon component */
  icon?: React.ElementType;
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
  title,
  icon: Icon,
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
      {(title || Icon) && (
        <div className={`flex items-center gap-2 mb-4 ${padding === 'none' ? 'px-5 pt-5' : ''}`}>
          {Icon && (
            <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
              {React.isValidElement(Icon) ? Icon : <Icon className="w-4 h-4" />}
            </div>
          )}
          {title && <h3 className="font-semibold text-text-main text-sm">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
}
