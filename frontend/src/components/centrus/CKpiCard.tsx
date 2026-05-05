import React from 'react';
import CIconBadge from './CIconBadge';

export interface CKpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  /** Color for the value text e.g. 'text-green-600' */
  valueColor?: string;
  /** Background for icon badge e.g. 'bg-green-100' */
  iconBg?: string;
  /** Text color for icon badge e.g. 'text-green-600' */
  iconColor?: string;
  className?: string;
}

export default function CKpiCard({
  label,
  value,
  sub,
  icon,
  valueColor = 'text-text-main',
  iconBg = 'bg-gray-100',
  iconColor = 'text-gray-500',
  className = '',
}: CKpiCardProps) {
  return (
    <div
      className={`
        bg-surface border border-border-subtle rounded-xl px-5 py-4 flex flex-col gap-2 cursor-default
        ${className}
      `.trim()}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted">{label}</span>
        {icon && (
          <CIconBadge icon={icon} colorClass={`${iconBg} ${iconColor}`} size="md" />
        )}
      </div>
      <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
      {sub && <span className="text-[11px] text-text-muted">{sub}</span>}
    </div>
  );
}
