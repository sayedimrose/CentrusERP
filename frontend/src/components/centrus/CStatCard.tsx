import React from 'react';
import CIconBadge from './CIconBadge';

export interface CStatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  /** Icon background class e.g. 'bg-primary-light' */
  iconBg?: string;
  /** Text/icon color class e.g. 'text-primary' */
  color?: string;
  className?: string;
}

export default function CStatCard({
  label,
  value,
  icon,
  iconBg = 'bg-gray-100',
  color = 'text-gray-600',
  className = '',
}: CStatCardProps) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border border-border-subtle ${className}`}>
      {icon && (
        <CIconBadge icon={icon} colorClass={`${iconBg} ${color}`} size="lg" />
      )}
      <span className="flex-1 text-sm text-text-main">{label}</span>
      <span className={`text-base font-bold ${color}`}>{value}</span>
    </div>
  );
}
