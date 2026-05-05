'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search, Bell, HelpCircle, LayoutDashboard, Wallet, Package2,
  ShoppingCart, Store, Factory, Users, Settings, FileText,
  BarChart2, ClipboardList, TrendingUp, User, X, ArrowRight,
} from 'lucide-react';

// ─── Search Catalog ───────────────────────────────────────────────
const SEARCH_CATALOG = [
  // Modules / Pages
  { type: 'Module',  label: 'Dashboard',          sub: 'Overview & KPIs',                  icon: <LayoutDashboard className="w-4 h-4" />, keywords: ['dashboard','home','overview','kpi'] },
  { type: 'Module',  label: 'Finance',             sub: 'Accounts, Ledgers, Journals',       icon: <Wallet className="w-4 h-4" />,         keywords: ['finance','accounting','ledger','journal','invoice','vat','zatca'] },
  { type: 'Module',  label: 'Inventory',           sub: 'Stock, Warehouses, Items',          icon: <Package2 className="w-4 h-4" />,        keywords: ['inventory','stock','warehouse','items','inv','products','sku'] },
  { type: 'Module',  label: 'Procurement',         sub: 'Purchase Orders, Vendors',          icon: <ShoppingCart className="w-4 h-4" />,    keywords: ['procurement','purchase','vendor','supplier','po','rfq'] },
  { type: 'Module',  label: 'Sales & POS',         sub: 'Orders, Invoices, Customers',       icon: <Store className="w-4 h-4" />,           keywords: ['sales','pos','point of sale','orders','customers','invoice','crm'] },
  { type: 'Module',  label: 'Manufacturing',       sub: 'BOMs, Work Orders, Production',     icon: <Factory className="w-4 h-4" />,         keywords: ['manufacturing','production','bom','work order','assembly','mrp'] },
  { type: 'Module',  label: 'Human Resources',     sub: 'Employees, Payroll, Leave',         icon: <Users className="w-4 h-4" />,           keywords: ['hr','human resources','employees','payroll','leave','attendance','salary'] },
  { type: 'Module',  label: 'Settings',            sub: 'System configuration',              icon: <Settings className="w-4 h-4" />,        keywords: ['settings','config','configuration','system','company'] },

  // Reports
  { type: 'Report',  label: 'Profit & Loss',       sub: 'Financial performance report',      icon: <BarChart2 className="w-4 h-4" />,       keywords: ['profit','loss','p&l','income','financial','report'] },
  { type: 'Report',  label: 'Balance Sheet',       sub: 'Assets, liabilities & equity',      icon: <BarChart2 className="w-4 h-4" />,       keywords: ['balance sheet','assets','liabilities','equity','report'] },
  { type: 'Report',  label: 'Inventory Valuation', sub: 'Stock value by warehouse',          icon: <Package2 className="w-4 h-4" />,        keywords: ['inventory valuation','stock value','inv','report','warehouse'] },
  { type: 'Report',  label: 'Sales Summary',       sub: 'Revenue by product & region',       icon: <TrendingUp className="w-4 h-4" />,      keywords: ['sales summary','revenue','report','region','product'] },
  { type: 'Report',  label: 'Employee Attendance', sub: 'Attendance & leave report',         icon: <Users className="w-4 h-4" />,           keywords: ['attendance','leave','hr','employees','report'] },
  { type: 'Report',  label: 'Payroll Summary',     sub: 'Monthly payroll breakdown',         icon: <Wallet className="w-4 h-4" />,         keywords: ['payroll','salary','hr','monthly','report'] },
  { type: 'Report',  label: 'Purchase Orders',     sub: 'Open & closed PO report',           icon: <ShoppingCart className="w-4 h-4" />,    keywords: ['purchase orders','po','procurement','vendor','report'] },

  // Tasks / Items
  { type: 'Task',    label: 'Finalise plant venue', sub: 'PROJ-0002 · Completed',            icon: <ClipboardList className="w-4 h-4" />,   keywords: ['task','plant','venue','proj'] },
  { type: 'Task',    label: 'Map budget',           sub: 'PROJ-0002 · Completed',            icon: <ClipboardList className="w-4 h-4" />,   keywords: ['task','map','budget','proj'] },
  { type: 'Task',    label: 'Purchase assets',      sub: 'PROJ-0002 · Overdue',              icon: <ClipboardList className="w-4 h-4" />,   keywords: ['task','purchase','assets','proj'] },
  { type: 'Task',    label: 'Purchase machinery',   sub: 'PROJ-0002 · Overdue',              icon: <ClipboardList className="w-4 h-4" />,   keywords: ['task','purchase','machinery','proj'] },

  // Users
  { type: 'User',    label: 'Sayed Abbas',          sub: 'Admin · sayed@centrus.sa',          icon: <User className="w-4 h-4" />,            keywords: ['sayed','abbas','admin','user'] },
  { type: 'User',    label: 'Ahmed Al-Rashidi',     sub: 'Manager · ahmed@centrus.sa',        icon: <User className="w-4 h-4" />,            keywords: ['ahmed','rashidi','manager','user'] },
  { type: 'User',    label: 'Fatima Khalid',        sub: 'Analyst · fatima@centrus.sa',       icon: <User className="w-4 h-4" />,            keywords: ['fatima','khalid','analyst','user'] },

  // Documents
  { type: 'Document', label: 'INV-2025-001',        sub: 'Invoice · SAR 12,500',              icon: <FileText className="w-4 h-4" />,        keywords: ['invoice','inv','document','2025'] },
  { type: 'Document', label: 'PO-2025-034',         sub: 'Purchase Order · SAR 8,200',        icon: <FileText className="w-4 h-4" />,        keywords: ['po','purchase order','document','2025'] },
  { type: 'Document', label: 'PAY-2025-004',        sub: 'Payroll Run · April 2025',          icon: <FileText className="w-4 h-4" />,        keywords: ['payroll','pay','document','2025'] },
];

const TYPE_ORDER = ['Module', 'Report', 'Task', 'User', 'Document'];
const TYPE_COLOR: Record<string, string> = {
  Module:   'bg-primary-light text-primary',
  Report:   'bg-violet-100 text-violet-600',
  Task:     'bg-orange-100 text-orange-600',
  User:     'bg-green-100 text-green-700',
  Document: 'bg-gray-100 text-gray-600',
};

function fuzzyMatch(query: string, item: typeof SEARCH_CATALOG[number]) {
  const q = query.toLowerCase().trim();
  if (!q) return false;
  const haystack = [item.label, item.sub, ...item.keywords].join(' ').toLowerCase();
  // Check if every char in query appears in order (fuzzy) OR substring match
  return haystack.includes(q) || item.keywords.some(k => k.includes(q));
}

// ─── Component ────────────────────────────────────────────────────
export default function Header() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length >= 1
    ? SEARCH_CATALOG.filter(item => fuzzyMatch(query, item))
    : [];

  // Group results by type
  const grouped = TYPE_ORDER.reduce<Record<string, typeof SEARCH_CATALOG>>((acc, type) => {
    const items = results.filter(r => r.type === type);
    if (items.length) acc[type] = items;
    return acc;
  }, {});

  const flatResults = TYPE_ORDER.flatMap(t => grouped[t] ?? []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || !flatResults.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, flatResults.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Escape')    { setIsOpen(false); setQuery(''); inputRef.current?.blur(); }
    if (e.key === 'Enter')     { setIsOpen(false); setQuery(''); }
  }, [isOpen, flatResults.length]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setActiveIndex(0); }, [query]);

  let flatIndex = 0;

  return (
    <header className="h-16 bg-surface border-b border-border-subtle px-6 flex items-center justify-between sticky top-0 z-30">

      {/* Left — Breadcrumb placeholder */}
      <div className="flex items-center gap-4 flex-1" />

      {/* Center — Smart Search */}
      <div className="flex-1 flex justify-center max-w-2xl" ref={containerRef}>
        <div className="relative w-full max-w-md">
          {/* Input */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search modules, reports, tasks..."
            className="block w-full pl-10 pr-8 py-2 border border-border-subtle rounded-md leading-5 bg-background-app text-text-main placeholder-text-muted focus:outline-none focus:bg-white focus:ring-[1.5px] focus:ring-primary focus:border-primary sm:text-sm transition-colors"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setIsOpen(false); inputRef.current?.focus(); }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-main"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Dropdown Results */}
          {isOpen && query.trim().length >= 1 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden max-h-[420px] overflow-y-auto">

              {flatResults.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center gap-2">
                  <Search className="w-8 h-8 text-gray-200" />
                  <p className="text-sm text-text-muted">No results for <span className="font-medium text-text-main">"{query}"</span></p>
                  <p className="text-xs text-text-muted">Try searching for a module, report, or task name</p>
                </div>
              ) : (
                <div className="py-1.5">
                  {TYPE_ORDER.map(type => {
                    const items = grouped[type];
                    if (!items) return null;
                    return (
                      <div key={type}>
                        {/* Group Header */}
                        <div className="px-3 pt-3 pb-1">
                          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">{type}s</span>
                        </div>
                        {items.map(item => {
                          const iActive = flatIndex;
                          flatIndex++;
                          return (
                            <button
                              key={item.label}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                                activeIndex === iActive ? 'bg-primary-light' : 'hover:bg-gray-50'
                              }`}
                              onMouseEnter={() => setActiveIndex(iActive)}
                              onClick={() => { setIsOpen(false); setQuery(''); }}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${TYPE_COLOR[type]}`}>
                                {item.icon}
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <p className="font-medium text-text-main truncate">{item.label}</p>
                                <p className="text-xs text-text-muted truncate">{item.sub}</p>
                              </div>
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${TYPE_COLOR[type]} flex-shrink-0`}>
                                {type}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0 opacity-0 group-hover:opacity-100" />
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}

                  {/* Footer */}
                  <div className="px-3 py-2 mt-1 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-xs text-text-muted">{flatResults.length} result{flatResults.length !== 1 ? 's' : ''} for <span className="font-medium">"{query}"</span></span>
                    <span className="text-[10px] text-text-muted flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">↑↓</kbd> navigate
                      <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] ml-1">Esc</kbd> close
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        <button className="btn btn-outline h-9 px-3 text-xs hidden md:inline-flex rounded-full">
          Ask AI
        </button>
        <button className="p-2 text-text-muted hover:bg-gray-100 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="p-2 text-text-muted hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>

    </header>
  );
}
