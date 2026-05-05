'use client';

import React from 'react';
import CButton from './CButton';

export interface CDialogButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
}

export interface CDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  buttons?: CDialogButton[];
  /** Max width class */
  maxWidth?: string;
}

export default function CDialog({
  isOpen,
  onClose,
  title,
  icon,
  children,
  buttons = [],
  maxWidth = 'max-w-md',
}: CDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className={`relative bg-white rounded-xl shadow-xl ${maxWidth} w-full mx-4 overflow-hidden`}>
        {/* Header */}
        {(title || icon) && (
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border-subtle">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
            )}
            {title && <h3 className="text-base font-semibold text-text-main">{title}</h3>}
          </div>
        )}

        {/* Body */}
        {children && <div className="px-5 py-4">{children}</div>}

        {/* Footer */}
        {buttons.length > 0 && (
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border-subtle bg-gray-50/50">
            {buttons.map((btn) => (
              <CButton
                key={btn.label}
                variant={btn.variant || 'outline'}
                size="sm"
                onClick={btn.onClick}
              >
                {btn.label}
              </CButton>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
