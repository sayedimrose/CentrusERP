import React from 'react';

export interface CSectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  /** Right-side action content */
  action?: React.ReactNode;
  className?: string;
}

export default function CSectionHeader({
  title,
  subtitle,
  icon,
  action,
  className = '',
}: CSectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <p className="text-sm font-semibold text-text-main">{title}</p>
        {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
      </div>
      {icon && !action && (
        <span className="text-text-muted">{icon}</span>
      )}
      {action}
    </div>
  );
}
