'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface CDropdownItem {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface CDropdownGroup {
  items: CDropdownItem[];
}

export interface CDropdownMenuProps {
  /** Trigger label */
  label?: string;
  /** Trigger leading icon */
  icon?: React.ReactNode;
  /** Item groups (separated by dividers) */
  groups: CDropdownGroup[];
  /** Dropdown alignment */
  align?: 'left' | 'right';
  /** Min width of dropdown panel */
  width?: string;
  /** Additional trigger className */
  className?: string;
}

export default function CDropdownMenu({
  label,
  icon,
  groups,
  align = 'left',
  width = 'w-48',
  className = '',
}: CDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm font-medium transition-colors
          ${isOpen
            ? 'bg-gray-100 border-gray-300 text-text-main'
            : 'border-border-subtle text-text-muted hover:bg-gray-50 hover:text-text-main'
          }
          ${className}
        `.trim()}
      >
        {icon}
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1 ${width} bg-white border border-border-subtle rounded-lg shadow-lg z-50 overflow-hidden py-1`}>
          {groups.map((group, gi) => (
            <React.Fragment key={gi}>
              {gi > 0 && <div className="my-1 border-t border-border-subtle" />}
              {group.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { item.onClick?.(); setIsOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                    item.danger
                      ? 'text-red-500 hover:bg-red-50'
                      : item.active
                        ? 'bg-primary-light text-primary font-medium'
                        : 'text-text-main hover:bg-gray-50'
                  }`}
                >
                  {item.icon && (
                    <span className={item.danger ? 'text-red-400' : item.active ? 'text-primary' : 'text-text-muted'}>
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
