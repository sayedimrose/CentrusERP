'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MapPin, 
  Building2, 
  MoreVertical,
  Filter,
  LayoutList,
  RefreshCcw,
  Download,
  Upload,
  Printer,
  Trash2,
  Archive,
  Copy,
  Settings2,
  FileText,
  Pencil
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

interface Branch {
  id: string;
  code: string;
  name_en: string;
  name_ar: string;
  city: string;
  status: 'Active' | 'Inactive';
  phone: string;
}

const MOCK_BRANCHES: Branch[] = [
  { id: '1', code: 'BR-001', name_en: 'Riyadh Main HQ', name_ar: 'فرع الرياض الرئيسي', city: 'Riyadh', status: 'Active', phone: '+966 11 444 5555' },
  { id: '2', code: 'BR-002', name_en: 'Jeddah Coastal Office', name_ar: 'فرع جدة الساحلي', city: 'Jeddah', status: 'Active', phone: '+966 12 333 4444' },
  { id: '3', code: 'BR-003', name_en: 'Dammam Industrial', name_ar: 'فرع الدمام الصناعي', city: 'Dammam', status: 'Inactive', phone: '+966 13 222 3333' },
];

export default function BranchSetupPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const { toasts, addToast, removeToast } = useToasts();
  const selectedCount = Object.keys(rowSelection).length;

  const handleAddSubmit = () => {
    const mode = selectedBranch ? 'updated' : 'registered';
    addToast(`Branch ${mode} successfully!`, 'success');
    setIsModalOpen(false);
    setSelectedBranch(null);
  };

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedCount === 0) return;
    addToast(`${selectedCount} branches deleted successfully!`, 'error');
    setRowSelection({});
  };

  const branchFilters: FilterGroup[] = [
    { id: 'city', title: 'City', options: [{ label: 'Riyadh', count: 1 }, { label: 'Jeddah', count: 1 }, { label: 'Dammam', count: 1 }] },
    { id: 'status', title: 'Status', options: [{ label: 'Active', count: 2 }, { label: 'Inactive', count: 1 }] },
  ];

  const columns = useMemo<ColumnDef<Branch>[]>(() => [
    { accessorKey: 'code', header: 'Branch Code', cell: info => <span className="font-medium text-text-main text-xs">{info.getValue() as string}</span>, size: 120 },
    { accessorKey: 'name_en', header: 'Branch Name', cell: info => (
      <div className="flex flex-col">
        <span className="font-medium text-text-main text-sm">{info.getValue() as string}</span>
        <span className="text-[10px] text-text-muted">{info.row.original.name_ar}</span>
      </div>
    ), size: 250 },
    { accessorKey: 'city', header: 'City', cell: info => <span className="text-text-main text-xs">{info.getValue() as string}</span>, size: 120 },
    { accessorKey: 'phone', header: 'Contact', cell: info => <span className="text-text-muted text-xs">{info.getValue() as string}</span>, size: 150 },
    { accessorKey: 'status', header: 'Status', cell: info => <CBadge variant={info.getValue() === 'Active' ? 'success' : 'default'} size="sm">{info.getValue() as string}</CBadge>, size: 100 },
    { accessorKey: 'id', header: 'ID', cell: info => <span className="text-text-muted text-[10px] font-mono">{info.getValue() as string}</span>, size: 150 },
  ], []);

  return (
    <div className="flex flex-col gap-6 h-full">
      <CToast toasts={toasts} onRemove={removeToast} />

      <CDialog
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedBranch(null); }}
        title={selectedBranch ? "Edit Branch Details" : "Register New Branch"}
        icon={selectedBranch ? <Pencil className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
        buttons={[
          { label: 'Cancel', onClick: () => { setIsModalOpen(false); setSelectedBranch(null); }, variant: 'outline' },
          { label: selectedBranch ? 'Update Branch' : 'Register Branch', onClick: handleAddSubmit, variant: 'primary' },
        ]}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <CInput label="Branch Code" placeholder="e.g. BR-004" defaultValue={selectedBranch?.code} required />
            <CSelect label="City" options={[{ label: 'Riyadh', value: 'riyadh' }]} defaultValue={selectedBranch?.city.toLowerCase()} required />
          </div>
          <CInput label="Branch Name (EN)" placeholder="e.g. Al Khobar Branch" defaultValue={selectedBranch?.name_en} required />
          <CInput label="Branch Name (AR)" placeholder="فرع الخبر" defaultValue={selectedBranch?.name_ar} required dir="rtl" className="text-right" />
        </div>
      </CDialog>

      {/* Action Bar */}
      <CCard padding="none" className="overflow-hidden flex flex-col min-h-[650px] shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-white">
          <div className="flex items-center gap-4">
            <CIconBadge
              icon={<Building2 className="w-4 h-4" />}
              colorClass="bg-gray-100 text-text-muted"
              shape="circle"
              size="lg"
            />
            <CPageTitle>Branch Setup</CPageTitle>
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
              Add Branch
            </CButton>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden p-4 bg-white gap-0">
          {showFilters && <CFilterSidebar groups={branchFilters} />}
          <div className="flex-1 overflow-y-auto">
            <CDataTable 
              data={MOCK_BRANCHES} 
              columns={columns} 
              rowSelection={rowSelection} 
              onRowSelectionChange={setRowSelection} 
              onRowClick={handleEditBranch}
            />
          </div>
        </div>
      </CCard>
    </div>
  );
}
