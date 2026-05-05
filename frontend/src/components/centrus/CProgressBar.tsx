import React from 'react';

export interface CProgressBarProps {
  /** 0–100 */
  value: number;
  /** Color class for the filled bar e.g. 'bg-primary' */
  color?: string;
  /** Track background */
  trackColor?: string;
  /** Height */
  size?: 'sm' | 'md' | 'lg';
  /** Label above the bar */
  label?: string;
  /** Right-side annotation */
  annotation?: string;
  className?: string;
}

const heightClasses: Record<string, string> = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
};

export default function CProgressBar({
  value,
  color = 'bg-primary',
  trackColor = 'bg-gray-100',
  size = 'md',
  label,
  annotation,
  className = '',
}: CProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {(label || annotation) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-text-main">{label}</span>}
          {annotation && <span className="text-text-muted">{annotation}</span>}
        </div>
      )}
      <div className={`w-full ${heightClasses[size]} ${trackColor} rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full ${color} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
