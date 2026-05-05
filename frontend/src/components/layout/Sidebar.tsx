'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Package2,
  ShoppingCart,
  Store,
  Factory,
  Users,
  Settings,
  Puzzle,
  Pin,
  PinOff,
  Monitor,
  ChevronDown,
} from 'lucide-react';

const STORAGE_KEY = 'centrus-sidebar-pinned';

const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    subItems: [
      { name: 'KPI Overview', href: '/' },
      { name: 'Pending Approvals', href: '/approvals' },
    ],
  },
  {
    name: 'Point of Sale',
    href: '/pos',
    icon: Monitor,
    subItems: [
      { name: 'Open/Close Session', href: '/pos/session' },
      { name: 'Main POS Interface', href: '/pos/register' },
      { name: 'Return / Refund', href: '/pos/returns' },
      { name: 'Daily Z-Report', href: '/pos/z-report' },
    ],
  },
  {
    name: 'Sales',
    href: '/sales',
    icon: Store,
    subItems: [
      { name: 'Customers', href: '/sales/customers' },
      { name: 'Quotations', href: '/sales/quotations' },
      { name: 'Sales Orders', href: '/sales/orders' },
      { name: 'Sales Invoices', href: '/sales/invoices' },
      { name: 'Credit Notes', href: '/sales/credit-notes' },
      { name: 'Sales Reports', href: '/sales/reports' },
    ],
  },
  {
    name: 'Purchases',
    href: '/purchases',
    icon: ShoppingCart,
    subItems: [
      { name: 'Suppliers', href: '/purchases/suppliers' },
      { name: 'Purchase Orders', href: '/purchases/orders' },
      { name: 'Goods Receipts (GRN)', href: '/purchases/grn' },
      { name: 'Purchase Invoices', href: '/purchases/invoices' },
      { name: 'Debit Notes', href: '/purchases/debit-notes' },
      { name: 'Purchase Reports', href: '/purchases/reports' },
    ],
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Package2,
    subItems: [
      { name: 'Products & Services', href: '/inventory/products' },
      { name: 'Categories & Brands', href: '/inventory/categories' },
      { name: 'Warehouses & Locations', href: '/inventory/warehouses' },
      { name: 'Stock Transfers', href: '/inventory/transfers' },
      { name: 'Stock Adjustments', href: '/inventory/adjustments' },
      { name: 'Damage & Expiry', href: '/inventory/damage' },
      { name: 'Consumables Issue', href: '/inventory/consumables' },
      { name: 'Inventory Reports', href: '/inventory/reports' },
    ],
  },
  {
    name: 'Manufacturing',
    href: '/manufacturing',
    icon: Factory,
    subItems: [
      { name: 'Bill of Materials (BOM)', href: '/manufacturing/bom' },
      { name: 'Work Centers', href: '/manufacturing/work-centers' },
      { name: 'Production Orders', href: '/manufacturing/orders' },
      { name: 'Production Reports', href: '/manufacturing/reports' },
    ],
  },
  {
    name: 'Finance & Accounts',
    href: '/finance',
    icon: Wallet,
    subItems: [
      { name: 'Chart of Accounts', href: '/finance/coa' },
      { name: 'Journal Entries', href: '/finance/journal' },
      { name: 'General Ledger', href: '/finance/ledger' },
      { name: 'AP / AR Aging', href: '/finance/aging' },
      { name: 'Bank & Reconciliation', href: '/finance/bank' },
      { name: 'Vouchers (Receipt/Payment)', href: '/finance/vouchers' },
      { name: 'Tax / ZATCA Settings', href: '/finance/tax' },
      { name: 'Financial Reports', href: '/finance/reports' },
    ],
  },
  {
    name: 'Human Resources',
    href: '/hr',
    icon: Users,
    subItems: [
      { name: 'Employee Directory', href: '/hr/employees' },
      { name: 'Attendance', href: '/hr/attendance' },
      { name: 'Leave Applications', href: '/hr/leaves' },
      { name: 'Payroll & Salary Slips', href: '/hr/payroll' },
      { name: 'HR Reports', href: '/hr/reports' },
    ],
  },
  {
    name: 'UI Components',
    href: '/components',
    icon: Puzzle,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    subItems: [
      { name: 'Company Profile', href: '/settings/company' },
      { name: 'Branch Setup', href: '/settings/branches' },
      { name: 'Users & Roles', href: '/settings/users' },
      { name: 'Payment Modes', href: '/settings/payments' },
      { name: 'Hardware Devices', href: '/settings/hardware' },
      { name: 'ZATCA Phase 2', href: '/settings/zatca' },
      { name: 'General Preferences', href: '/settings/preferences' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Pinned = permanently expanded; unpinned = collapsed, expand on hover
  const [pinned, setPinned] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setPinned(stored === 'true');
    }
    setHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, String(pinned));
    }
  }, [pinned, hydrated]);

  const expanded = pinned || hovered;
  
  const toggleAccordion = (itemName: string) => {
    // If sidebar is collapsed, expand it first
    if (!expanded) {
      setHovered(true);
    }
    setOpenAccordion(prev => prev === itemName ? null : itemName);
  };

  // Prevent flash: render expanded on SSR, then apply stored state after hydration
  const sidebarWidth = !hydrated ? 'w-64' : expanded ? 'w-64' : 'w-[68px]';

  return (
    <aside
      className={`
        ${sidebarWidth} bg-surface border-r border-border-subtle h-screen sticky top-0
        flex flex-col z-30 transition-all duration-400 ease-in-out flex-shrink-0
      `.trim()}
      onMouseEnter={() => {
        if (!pinned) {
          if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
          setHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (!pinned) {
          hoverTimeout.current = setTimeout(() => {
            setHovered(false);
            setOpenAccordion(null); // Close accordion when sidebar collapses
          }, 250);
        }
      }}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-border-subtle justify-between gap-2">
        {expanded ? (
          <Image
            src="/images/Centrus_Logo.png"
            alt="Centrus ERP"
            width={130}
            height={34}
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        ) : (
          <Image
            src="/images/Centrus_Icon.png"
            alt="Centrus"
            width={32}
            height={32}
            className="object-contain mx-auto"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        )}

        {/* Pin / Collapse toggle — only show when expanded */}
        {expanded && (
          <button
            onClick={() => setPinned(!pinned)}
            className={`
              p-1.5 rounded-md transition-colors flex-shrink-0
              ${pinned
                ? 'text-primary bg-primary-light hover:bg-primary/15'
                : 'text-text-muted hover:bg-gray-100 hover:text-text-main'
              }
            `.trim()}
            title={pinned ? 'Unpin sidebar' : 'Pin sidebar open'}
          >
            {pinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1 relative custom-scrollbar">
        {navItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isAccordionOpen = openAccordion === item.name;
          const isActive = pathname === item.href || (item.subItems?.some(si => pathname === si.href));
          const Icon = item.icon;

          return (
            <div key={item.name} className="flex flex-col gap-1">
              {/* Main Item */}
              {hasSubItems ? (
                <button
                  onClick={() => toggleAccordion(item.name)}
                  className={`
                    w-full flex items-center gap-3 rounded-lg transition-colors text-sm font-medium relative group cursor-pointer
                    ${expanded ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'}
                    ${isActive
                      ? 'bg-primary-light text-primary'
                      : 'text-text-muted hover:bg-gray-100 hover:text-text-main'
                    }
                  `.trim()}
                >
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {expanded && (
                    <>
                      <span className="truncate whitespace-nowrap flex-1 text-left">{item.name}</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-200 ${isAccordionOpen ? 'rotate-180' : ''}`} 
                      />
                    </>
                  )}
                  {isActive && !expanded && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  title={!expanded ? item.name : undefined}
                  className={`
                    flex items-center gap-3 rounded-lg transition-colors text-sm font-medium relative group
                    ${expanded ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'}
                    ${isActive
                      ? 'bg-primary-light text-primary'
                      : 'text-text-muted hover:bg-gray-100 hover:text-text-main'
                    }
                  `.trim()}
                >
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {expanded && <span className="truncate whitespace-nowrap">{item.name}</span>}
                  {isActive && !expanded && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </Link>
              )}

              {/* Accordion Sub-menu */}
              {expanded && hasSubItems && (
                <div 
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isAccordionOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className="flex flex-col gap-1 pl-10 pr-2 pb-1 mt-1">
                    {item.subItems!.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`
                          px-3 py-2 rounded-md text-sm transition-all relative
                          ${pathname === subItem.href
                            ? 'text-primary font-bold'
                            : 'text-text-muted hover:text-text-main hover:bg-gray-50'
                          }
                        `.trim()}
                      >
                        {/* Bullet point for sub-items */}
                        <div className={`
                          absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-current opacity-40
                          ${pathname === subItem.href ? 'bg-primary opacity-100' : ''}
                        `} />
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Mini Profile */}
      <div className="p-3 border-t border-border-subtle">
        <div
          className={`
            flex items-center gap-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer
            text-sm font-medium text-text-muted
            ${expanded ? 'px-3 py-2' : 'px-0 py-2 justify-center'}
          `.trim()}
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0 text-xs">
            SA
          </div>
          {expanded && (
            <div className="flex flex-col min-w-0">
              <span className="text-text-main leading-tight truncate">Sayed Abbas</span>
              <span className="text-xs leading-tight opacity-70">Admin</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
