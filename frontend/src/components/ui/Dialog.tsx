'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
}

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  buttons?: DialogButton[];
  size?: 'sm' | 'md' | 'lg';
}

const variantClass: Record<string, string> = {
  primary: 'btn btn-primary',
  outline: 'btn btn-outline',
  danger: 'btn border border-red-300 text-red-600 hover:bg-red-50',
  ghost: 'btn btn-ghost',
};

export default function Dialog({
  isOpen,
  onClose,
  title,
  icon,
  children,
  buttons = [],
  size = 'md',
}: DialogProps) {
  // Lock body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full ${sizeClass} bg-white rounded-2xl border border-border-subtle shadow-xl flex flex-col max-h-[90vh] animate-[dialogIn_0.18s_ease-out]`}
        style={{ animation: 'dialogIn 0.18s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border-subtle">
          {icon && (
            <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
              {icon}
            </div>
          )}
          <h2 className="text-base font-semibold text-text-main flex-1">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-text-muted hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {buttons.length > 0 && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-subtle">
            {buttons.map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className={variantClass[btn.variant ?? 'ghost']}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
