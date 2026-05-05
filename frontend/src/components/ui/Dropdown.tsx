'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface DropdownProps {
  label: string | React.ReactNode;
  items: DropdownItem[];
  icon?: React.ReactNode;
}

export default function Dropdown({ label, items, icon }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center items-center w-full rounded-md border border-border-subtle px-3 py-1.5 bg-surface text-sm font-medium text-text-main hover:bg-gray-50 focus:outline-none transition-colors"
      >
        {icon && <span className="mr-2 text-text-muted">{icon}</span>}
        {label}
        <ChevronDown className="-mr-1 ml-2 h-4 w-4 text-text-muted" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-gray-100 flex items-center gap-3 transition-colors"
                role="menuitem"
              >
                {item.icon && <span className="text-text-muted">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
