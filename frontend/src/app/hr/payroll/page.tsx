'use client';

import React, { useState, useMemo } from 'react';
import { 
  Banknote, 
  Plus, 
  Search, 
  Filter, 
  RefreshCcw, 
  Download, 
  Upload, 
  MoreVertical, 
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History,
  FileText,
  CreditCard,
  Building2,
  Users,
  Wallet,
  ArrowRight,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  Send
} from 'lucide-react';
import { 
  CCard, 
  CButton, 
  CBadge,
  CIconBadge,
  CDropdownMenu,
  CDataTable,
  CFilterSidebar,
  FilterGroup,
  CDialog,
  CToast,
  useToasts,
  CInput,
  CSelect,
  CAvatar,
  CPageTitle
} from '@/components/centrus';
import { ColumnDef } from '@tanstack/react-table';

interface PayrollRun {
  id: string;
  period: string;
  run_date: string;
  total_net: number;
  total_employees: number;
  status: 'Draft' | 'Posted' | 'Paid';
}

interface SalarySlip {
  id: string;
  employee_name: string;
  employee_code: string;
  basic: number;
  allowances: number;
  deductions: number;
  net: number;
  status: 'Unpaid' | 'Paid';
}

const MOCK_RUNS: PayrollRun[] = [
  { id: 'PR-2026-04', period: 'April 2026', run_date: '2026-04-28', total_net: 245000.00, total_employees: 45, status: 'Paid' },
  { id: 'PR-2026-05', period: 'May 2026', run_date: '2026-05-25', total_net: 250000.00, total_employees: 48, status: 'Draft' },
];

const MOCK_SLIPS: SalarySlip[] = [
  { id: 'SL-001', employee_name: 'Sayed Abbas', employee_code: 'EMP-1001', basic: 12000, allowances: 3000, deductions: 500, net: 14500, status: 'Paid' },
  { id: 'SL-002', employee_name: 'Mohammed Ali', employee_code: 'EMP-1002', basic: 9000, allowances: 2000, deductions: 0, net: 11000, status: 'Unpaid' },
];

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<'runs' | 'slips'>('runs');
  const [showFilters, setShowFilters] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState<SalarySlip | null>(null);

  const { toasts, addToast, removeToast } = useToasts();

  const payrollFilters: FilterGroup[] = [
    { id: 'status', title: 'Status', options: [{ label: 'Paid', count: 12 }, { label: 'Draft', count: 1 }, { label: 'Unpaid', count: 5 }] },
    { id: 'year', title: 'Year', options: [{ label: '2026', count: 5 }, { label: '2025', count: 12 }] },
  ];

  const runColumns = useMemo<ColumnDef<PayrollRun>[]>(() => [
    { 
      accessorKey: 'id', 
      header: 'Run ID', 
      cell: info => <span className="text-xs font-mono text-text-muted">{info.getValue() as string}</span> 
    },
    { 
      accessorKey: 'period', 
      header: 'Payroll Period', 
      cell: info => <span className="font-semibold text-text-main">{info.getValue() as string}</span> 
    },
    { 
      accessorKey: 'total_employees', 
      header: 'Employees', 
      cell: info => <span className="text-xs text-text-muted">{info.getValue() as number} Members</span> 
    },
    { 
      accessorKey: 'total_net', 
      header: 'Total Net Pay', 
      cell: info => (
        <span className="font-mono font-bold text-text-main">
          {new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 2 }).format(info.getValue() as number)}
        </span>
      )
    },
    { 
      accessorKey: 'status', 
      header: 'Status', 
      cell: info => (
        <CBadge variant={info.getValue() === 'Paid' ? 'success' : info.getValue() === 'Posted' ? 'primary' : 'warning'} size="sm">
          {info.getValue() as string}
        </CBadge>
      )
    }
  ], []);

  const slipColumns = useMemo<ColumnDef<SalarySlip>[]>(() => [
    { 
      accessorKey: 'employee_name', 
      header: 'Employee', 
      cell: info => (
        <div className="flex items-center gap-3">
          <CAvatar initials={info.getValue() as string === 'Sayed Abbas' ? 'SA' : 'MA'} size="sm" />
          <div className="flex flex-col">
            <span className="font-semibold text-text-main">{info.getValue() as string}</span>
            <span className="text-[10px] text-text-muted font-mono">{info.row.original.employee_code}</span>
          </div>
        </div>
      )
    },
    { 
      accessorKey: 'net', 
      header: 'Net Salary', 
      cell: info => (
        <span className="font-mono font-bold text-text-main">
          {new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 2 }).format(info.getValue() as number)}
        </span>
      )
    },
    { 
      accessorKey: 'status', 
      header: 'Payment Status', 
      cell: info => (
        <CBadge variant={info.getValue() === 'Paid' ? 'success' : 'danger'} size="sm">
          {info.getValue() as string}
        </CBadge>
      )
    }
  ], []);

  return (
    <div className="flex flex-col gap-6 h-full">
      <CToast toasts={toasts} onRemove={removeToast} />

      <CDialog
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedSlip(null); }}
        title={selectedSlip ? "Salary Slip Details" : "Process New Payroll"}
        icon={<Banknote className="w-5 h-5" />}
        buttons={[
          { label: 'Close', onClick: () => { setIsModalOpen(false); setSelectedSlip(null); }, variant: 'outline' },
          { label: 'Print Slip', onClick: () => addToast('Sending to printer...', 'info'), variant: 'primary' },
        ]}
      >
        {selectedSlip ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-border-subtle">
              <div className="flex items-center gap-3">
                <CAvatar initials={selectedSlip.employee_name.charAt(0)} size="lg" />
                <div>
                  <h3 className="text-sm font-bold text-text-main">{selectedSlip.employee_name}</h3>
                  <p className="text-xs text-text-muted">{selectedSlip.employee_code} · May 2026</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Net Payable</p>
                <p className="text-xl font-bold text-primary">SAR {selectedSlip.net.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-green-600 uppercase tracking-widest">Earnings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Basic Salary</span><span className="font-medium">SAR {selectedSlip.basic.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Allowances</span><span className="font-medium">SAR {selectedSlip.allowances.toLocaleString()}</span></div>
                  <div className="flex justify-between pt-2 border-t border-dashed font-bold"><span>Gross Pay</span><span>SAR {(selectedSlip.basic + selectedSlip.allowances).toLocaleString()}</span></div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Deductions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>GOSI (9%)</span><span className="font-medium">SAR {(selectedSlip.basic * 0.09).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Other Deductions</span><span className="font-medium">SAR {selectedSlip.deductions.toLocaleString()}</span></div>
                  <div className="flex justify-between pt-2 border-t border-dashed font-bold text-red-600"><span>Total Deductions</span><span>SAR {(selectedSlip.basic * 0.09 + selectedSlip.deductions).toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <p className="text-xs text-primary font-medium">Processing payroll will automatically calculate GOSI and allowances based on employee contracts.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CSelect label="Select Month" options={[{ label: 'May', value: '5' }, { label: 'June', value: '6' }]} defaultValue="5" />
              <CSelect label="Select Year" options={[{ label: '2026', value: '2026' }]} defaultValue="2026" />
            </div>
            <CSelect label="Branch" options={[{ label: 'All Branches', value: 'all' }, { label: 'Riyadh HQ', value: '1' }]} defaultValue="all" />
          </div>
        )}
      </CDialog>

      {/* Action Bar */}
      <CCard padding="none" className="overflow-hidden flex flex-col min-h-[650px] shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-white">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <CIconBadge
                icon={<Banknote className="w-4 h-4" />}
                colorClass="bg-gray-100 text-text-muted"
                shape="circle"
                size="lg"
              />
              <CPageTitle>Payroll & Salary Slips</CPageTitle>
            </div>

            {/* Sub-Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('runs')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'runs' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
              >
                Payroll Runs
              </button>
              <button 
                onClick={() => setActiveTab('slips')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'slips' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
              >
                Salary Slips
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CButton
              variant="outline"
              size="sm"
              icon={<Filter className="w-4 h-4" />}
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? '!bg-primary-light !text-primary !border-primary/20 hover:!bg-primary-light/80' : ''}
            >
              <span className="hidden sm:inline">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </CButton>

            <CButton variant="outline" size="sm" icon={<RefreshCcw className="w-4 h-4" />} iconOnly />

            <CDropdownMenu
              label="Options"
              align="right"
              width="w-52"
              groups={[
                { items: [
                  { label: 'Generate WPS File', icon: <Send className="w-4 h-4" /> },
                  { label: 'Payroll Summary', icon: <FileSpreadsheet className="w-4 h-4" /> },
                ]},
                { items: [
                  { label: 'Bulk Print Slips', icon: <Printer className="w-4 h-4" /> },
                  { label: 'Bank Integration', icon: <Building2 className="w-4 h-4" /> },
                ]},
              ]}
            />

            <CButton
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
              className="ml-2"
            >
              Process Payroll
            </CButton>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden p-4 bg-white gap-0">
          {showFilters && <CFilterSidebar groups={payrollFilters} />}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'runs' ? (
              <CDataTable 
                data={MOCK_RUNS} 
                columns={runColumns} 
                rowSelection={rowSelection} 
                onRowSelectionChange={setRowSelection} 
              />
            ) : (
              <CDataTable 
                data={MOCK_SLIPS} 
                columns={slipColumns} 
                rowSelection={rowSelection} 
                onRowSelectionChange={setRowSelection} 
                onRowClick={(row) => { setSelectedSlip(row); setIsModalOpen(true); }}
              />
            )}
          </div>
        </div>
      </CCard>
    </div>
  );
}
