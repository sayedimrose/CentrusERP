import React from 'react';

export interface CBarChartDataPoint {
  label: string;
  segments: { value: number; color: string }[];
}

export interface CBarChartLegendItem {
  label: string;
  color: string;
}

export interface CBarChartProps {
  data: CBarChartDataPoint[];
  legend?: CBarChartLegendItem[];
  /** Chart area height in px */
  height?: number;
  className?: string;
}

export default function CBarChart({
  data,
  legend,
  height = 88,
  className = '',
}: CBarChartProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-end gap-3" style={{ height: `${height + 20}px` }}>
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col gap-0.5" style={{ height: `${height}px` }}>
              {d.segments.map((seg, si) => (
                <div
                  key={si}
                  className="w-full rounded-t-sm"
                  style={{ height: `${seg.value}%`, backgroundColor: seg.color }}
                />
              ))}
            </div>
            <span className="text-[10px] text-text-muted">{d.label}</span>
          </div>
        ))}
      </div>
      {legend && legend.length > 0 && (
        <div className="flex items-center gap-4 text-xs text-text-muted border-t border-border-subtle pt-3">
          {legend.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
