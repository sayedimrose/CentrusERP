'use client';

import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  MoreVertical,
  Filter,
  RefreshCcw,
  Download,
  Upload,
  Printer,
  Trash2,
  Archive,
  Copy,
  Settings2,
  FileText,
  Pencil,
  Wallet,
  Banknote,
  ArrowRightLeft,
  CheckCircle2
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
  CPageTitle
} from '@/components/centrus';
import { ColumnDef } from '@tanstack/react-table';

interface PaymentMode {
  id: string;
  code: string;
  name_en: string;
  name_ar: string;
  type: 'CASH' | 'BANK_TRANSFER' | 'CREDIT' | 'WALLET';
  gl_account: string;
  is_system_default: boolean;
  status: 'Active' | 'Inactive';
}

const MOCK_PAYMENTS: PaymentMode[] = [
  { id: '1', code: 'CASH', name_en: 'Cash on Hand', name_ar: 'نقد', type: 'CASH', gl_account: '1001 - Petty Cash', is_system_default: true, status: 'Active' },
  { id: '2', code: 'MADA', name_en: 'MADA / Debit Card', name_ar: 'مدى', type: 'WALLET', gl_account: '1002 - Bank Al Rajhi', is_system_default: false, status: 'Active' },
  { id: '3', code: 'VISA', name_en: 'Credit Card (Visa/MC)', name_ar: 'بطاقة ائتمان', type: 'WALLET', gl_account: '1002 - Bank Al Rajhi', is_system_default: false, status: 'Active' },
  { id: '4', code: 'STCPAY', name_en: 'STC Pay', name_ar: 'STC Pay', type: 'WALLET', gl_account: '1005 - STC Pay Wallet', is_system_default: false, status: 'Inactive' },
];

export default function PaymentModesPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<PaymentMode | null>(null);

  const { toasts, addToast, removeToast } = useToasts();
  const selectedCount = Object.keys(rowSelection).length;

  const handleAddSubmit = () => {
    const mode = selectedMode ? 'updated' : 'configured';
    addToast(`Payment mode ${mode} successfully!`, 'success');
    setIsModalOpen(false);
    setSelectedMode(null);
  };

  const handleEdit = (mode: PaymentMode) => {
    setSelectedMode(mode);
    setIsModalOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedCount === 0) return;
    addToast(`${selectedCount} payment modes deleted!`, 'error');
    setRowSelection({});
  };

  const paymentFilters: FilterGroup[] = [
    { id: 'type', title: 'Payment Type', options: [{ label: 'CASH', count: 1 }, { label: 'WALLET', count: 3 }, { label: 'BANK_TRANSFER', count: 0 }] },
    { id: 'status', title: 'Status', options: [{ label: 'Active', count: 3 }, { label: 'Inactive', count: 1 }] },
  ];

  const columns = useMemo<ColumnDef<PaymentMode>[]>(() => [
    { accessorKey: 'code', header: 'Code', cell: info => <span className="font-medium text-text-main text-xs">{info.getValue() as string}</span>, size: 100 },
    { accessorKey: 'name_en', header: 'Display Name', cell: info => (
      <div className="flex flex-col">
        <span className="font-medium text-text-main text-sm">{info.getValue() as string}</span>
        <span className="text-[10px] text-text-muted">{info.row.original.name_ar}</span>
      </div>
    ), size: 250 },
    { 
      accessorKey: 'type', 
      header: 'Type', 
      cell: info => (
        <div className="flex items-center gap-2">
          {info.getValue() === 'CASH' && <Banknote className="w-3.5 h-3.5 text-green-500" />}
          {info.getValue() === 'WALLET' && <Wallet className="w-3.5 h-3.5 text-blue-500" />}
          {info.getValue() === 'BANK_TRANSFER' && <ArrowRightLeft className="w-3.5 h-3.5 text-purple-500" />}
          <span className="text-xs text-text-main font-medium">{info.getValue() as string}</span>
        </div>
      ),
      size: 150 
    },
    { accessorKey: 'gl_account', header: 'GL Ledger Account', cell: info => <span className="text-text-muted text-xs italic">{info.getValue() as string}</span>, size: 200 },
    { 
      accessorKey: 'is_system_default', 
      header: 'Default', 
      cell: info => info.getValue() ? <CBadge variant="primary" size="sm">System Default</CBadge> : null,
      size: 120 
    },
    { accessorKey: 'status', header: 'Status', cell: info => <CBadge variant={info.getValue() === 'Active' ? 'success' : 'default'} size="sm">{info.getValue() as string}</CBadge>, size: 100 },
  ], []);

  return (
    <div className="flex flex-col gap-6 h-full">
      <CToast toasts={toasts} onRemove={removeToast} />

      <CDialog
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedMode(null); }}
        title={selectedMode ? "Edit Payment Mode" : "Add Payment Mode"}
        icon={selectedMode ? <Pencil className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
        buttons={[
          { label: 'Cancel', onClick: () => { setIsModalOpen(false); setSelectedMode(null); }, variant: 'outline' },
          { label: selectedMode ? 'Update Configuration' : 'Enable Mode', onClick: handleAddSubmit, variant: 'primary' },
        ]}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <CInput label="Mode Code" placeholder="e.g. MADA, CASH" defaultValue={selectedMode?.code} required />
            <CSelect 
              label="Type" 
              options={[
                { label: 'Cash', value: 'CASH' },
                { label: 'Digital Wallet', value: 'WALLET' },
                { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
                { label: 'Customer Credit', value: 'CREDIT' }
              ]} 
              defaultValue={selectedMode?.type}
              required 
            />
          </div>
          <CInput label="Display Name (EN)" placeholder="e.g. MADA Card" defaultValue={selectedMode?.name_en} required />
          <CInput label="Display Name (AR)" placeholder="مثلا: مدى" defaultValue={selectedMode?.name_ar} required dir="rtl" className="text-right" />
          <CSelect 
            label="GL Account (Accounting)" 
            options={[
              { label: '1001 - Petty Cash', value: '1001' },
              { label: '1002 - Bank Al Rajhi', value: '1002' },
              { label: '1005 - STC Pay Wallet', value: '1005' }
            ]} 
            defaultValue="1001"
            required 
          />
        </div>
      </CDialog>

      {/* Action Bar */}
      <CCard padding="none" className="overflow-hidden flex flex-col min-h-[650px] shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-white">
          <div className="flex items-center gap-4">
            <CIconBadge
              icon={<CreditCard className="w-4 h-4" />}
              colorClass="bg-gray-100 text-text-muted"
              shape="circle"
              size="lg"
            />
            <CPageTitle>Payment Modes</CPageTitle>
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
                  { label: 'Import Records', icon: <Upload className="w-4 h-4" /> },
                  { label: 'Export to Excel', icon: <Download className="w-4 h-4" /> },
                  { label: 'Export to PDF', icon: <FileText className="w-4 h-4" /> },
                ]},
                { items: [
                  { label: 'Print List', icon: <Printer className="w-4 h-4" /> },
                  { label: 'Duplicate', icon: <Copy className="w-4 h-4" /> },
                  { label: 'Archive Selected', icon: <Archive className="w-4 h-4" /> },
                ]},
                { items: [
                  { label: 'Column Settings', icon: <Settings2 className="w-4 h-4" /> },
                ]},
                { items: [
                  { label: 'Delete Selected', icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: handleBulkDelete },
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
              Add Mode
            </CButton>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden p-4 bg-white gap-0">
          {showFilters && <CFilterSidebar groups={paymentFilters} />}
          <div className="flex-1 overflow-y-auto">
            <CDataTable 
              data={MOCK_PAYMENTS} 
              columns={columns} 
              rowSelection={rowSelection} 
              onRowSelectionChange={setRowSelection} 
              onRowClick={handleEdit}
            />
          </div>
        </div>
      </CCard>
    </div>
  );
}
