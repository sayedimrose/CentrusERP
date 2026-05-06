'use client';

import React from 'react';

export interface CPageTitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standardized Page Title component for the Centrus Action Bar.
 * Ensures consistent typography across all ERP modules.
 */
export default function CPageTitle({ children, className = '' }: CPageTitleProps) {
  return (
    <h1 className={`text-sm font-bold text-text-main tracking-tight leading-none ${className}`}>
      {children}
    </h1>
  );
}
