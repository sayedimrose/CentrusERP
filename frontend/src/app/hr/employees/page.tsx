'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  RefreshCcw, 
  Download, 
  Upload, 
  MoreVertical, 
  Trash2, 
  Archive, 
  Copy, 
  Settings2, 
  FileText,
  UserPlus,
  Building2,
  Briefcase,
  IdCard,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  ShieldCheck,
  Plane
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

interface Employee {
  id: string;
  code: string;
  name_en: string;
  name_ar: string;
  department: string;
  designation: string;
  iqama_no: string;
  nationality: string;
  joining_date: string;
  iqama_expiry: string;
  status: 'Active' | 'On Leave' | 'Terminated';
}

const MOCK_EMPLOYEES: Employee[] = [
  { 
    id: '1', 
    code: 'EMP-1001', 
    name_en: 'Sayed Abbas', 
    name_ar: 'سيد عباس', 
    department: 'Software Engineering', 
    designation: 'Senior Developer', 
    iqama_no: '2410098877', 
    nationality: 'India', 
    joining_date: '2023-01-15', 
    iqama_expiry: '2026-10-12',
    status: 'Active' 
  },
  { 
    id: '2', 
    code: 'EMP-1002', 
    name_en: 'Mohammed Ali', 
    name_ar: 'محمد علي', 
    department: 'Sales & Marketing', 
    designation: 'Sales Manager', 
    iqama_no: '2450011223', 
    nationality: 'Saudi Arabia', 
    joining_date: '2022-05-10', 
    iqama_expiry: '-',
    status: 'Active' 
  },
  { 
    id: '3', 
    code: 'EMP-1005', 
    name_en: 'John Doe', 
    name_ar: 'جون دو', 
    department: 'Operations', 
    designation: 'Technician', 
    iqama_no: '2399887766', 
    nationality: 'Philippines', 
    joining_date: '2024-02-01', 
    iqama_expiry: '2026-05-20',
    status: 'On Leave' 
  },
];

export default function EmployeeDirectoryPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { toasts, addToast, removeToast } = useToasts();
  const selectedCount = Object.keys(rowSelection).length;

  const handleAddSubmit = () => {
    const mode = selectedEmployee ? 'updated' : 'registered';
    addToast(`Employee ${mode} successfully!`, 'success');
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedCount === 0) return;
    addToast(`${selectedCount} employee records archived!`, 'error');
    setRowSelection({});
  };

  const hrFilters: FilterGroup[] = [
    { id: 'dept', title: 'Department', options: [{ label: 'Software Engineering', count: 12 }, { label: 'Sales & Marketing', count: 8 }, { label: 'Operations', count: 25 }] },
    { id: 'status', title: 'Status', options: [{ label: 'Active', count: 40 }, { label: 'On Leave', count: 3 }, { label: 'Terminated', count: 2 }] },
    { id: 'nation', title: 'Nationality', options: [{ label: 'Saudi Arabia', count: 15 }, { label: 'India', count: 10 }, { label: 'Pakistan', count: 8 }] },
  ];

  const columns = useMemo<ColumnDef<Employee>[]>(() => [
    { 
      accessorKey: 'name_en', 
      header: 'Employee Name', 
      cell: info => (
        <div className="flex items-center gap-3">
          <CAvatar initials={info.row.original.name_en.charAt(0)} size="sm" />
          <div className="flex flex-col">
            <span className="font-semibold text-text-main">{info.getValue() as string}</span>
            <span className="text-[10px] text-text-muted font-arabic">{info.row.original.name_ar}</span>
          </div>
        </div>
      ),
      size: 250 
    },
    { accessorKey: 'code', header: 'ID Code', cell: info => <span className="text-text-muted text-xs font-mono">{info.getValue() as string}</span>, size: 100 },
    { 
      accessorKey: 'department', 
      header: 'Dept & Designation', 
      cell: info => (
        <div className="flex flex-col">
          <span className="text-xs text-text-main font-medium">{info.getValue() as string}</span>
          <span className="text-[10px] text-text-muted">{info.row.original.designation}</span>
        </div>
      ),
      size: 200 
    },
    { accessorKey: 'iqama_no', header: 'Iqama / National ID', cell: info => <span className="text-xs text-text-main font-medium">{info.getValue() as string}</span>, size: 150 },
    { 
      accessorKey: 'iqama_expiry', 
      header: 'Iqama Expiry', 
      cell: info => {
        const date = info.getValue() as string;
        if (date === '-') return <span className="text-text-muted">-</span>;
        return (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-text-muted" />
            <span className="text-xs text-text-main font-mono">{date}</span>
          </div>
        );
      }, 
      size: 150 
    },
    { 
      accessorKey: 'status', 
      header: 'Status', 
      cell: info => (
        <CBadge 
          variant={info.getValue() === 'Active' ? 'success' : info.getValue() === 'On Leave' ? 'primary' : 'danger'} 
          size="sm"
        >
          {info.getValue() as string}
        </CBadge>
      ),
      size: 120 
    },
  ], []);

  return (
    <div className="flex flex-col gap-6 h-full">
      <CToast toasts={toasts} onRemove={removeToast} />

      <CDialog
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedEmployee(null); }}
        title={selectedEmployee ? "Edit Employee Profile" : "Register New Employee"}
        icon={selectedEmployee ? <Settings2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
        buttons={[
          { label: 'Cancel', onClick: () => { setIsModalOpen(false); setSelectedEmployee(null); }, variant: 'outline' },
          { label: selectedEmployee ? 'Update Profile' : 'Save Employee', onClick: handleAddSubmit, variant: 'primary' },
        ]}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-border-subtle">
            <CAvatar initials={selectedEmployee?.name_en.charAt(0) || 'N'} size="lg" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-text-main">Personal Information</h3>
              <p className="text-[11px] text-text-muted">Master data for payroll and government compliance.</p>
            </div>
            <CButton variant="outline" size="sm" icon={<Upload className="w-3.5 h-3.5" />}>Upload Photo</CButton>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CInput label="Full Name (English)" placeholder="e.g. Sayed Abbas" defaultValue={selectedEmployee?.name_en} required />
            <CInput label="Full Name (Arabic)" placeholder="الاسم الكامل" defaultValue={selectedEmployee?.name_ar} required dir="rtl" className="text-right" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <CInput label="Iqama / National ID" placeholder="10-digit number" defaultValue={selectedEmployee?.iqama_no} required icon={<IdCard className="w-4 h-4" />} />
            <CSelect 
              label="Nationality" 
              options={[{ label: 'Saudi Arabia', value: 'SA' }, { label: 'India', value: 'IN' }, { label: 'Pakistan', value: 'PK' }]} 
              defaultValue="SA"
            />
            <CInput label="Joining Date" type="date" defaultValue={selectedEmployee?.joining_date} icon={<Calendar className="w-4 h-4" />} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CSelect 
              label="Department" 
              options={[{ label: 'Software Engineering', value: 'IT' }, { label: 'Sales', value: 'SALES' }]} 
              defaultValue="IT"
            />
            <CInput label="Designation" placeholder="e.g. Manager" defaultValue={selectedEmployee?.designation} icon={<Briefcase className="w-4 h-4" />} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CInput label="Email Address" placeholder="emp@company.com" icon={<Mail className="w-4 h-4" />} />
            <CInput label="Phone Number" placeholder="+966..." icon={<Phone className="w-4 h-4" />} />
          </div>
        </div>
      </CDialog>

      {/* Action Bar */}
      <CCard padding="none" className="overflow-hidden flex flex-col min-h-[650px] shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-white">
          <div className="flex items-center gap-4">
            <CIconBadge
              icon={<Users className="w-4 h-4" />}
              colorClass="bg-gray-100 text-text-muted"
              shape="circle"
              size="lg"
            />
            <div>
              <CPageTitle>Employee Directory</CPageTitle>
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
                  { label: 'Export WPS File', icon: <History className="w-4 h-4" /> },
                  { label: 'Document Expiry Log', icon: <AlertTriangle className="w-4 h-4" /> },
                ]},
                { items: [
                  { label: 'Import Excel', icon: <Upload className="w-4 h-4" /> },
                  { label: 'Bulk Update Status', icon: <ShieldCheck className="w-4 h-4" /> },
                ]},
                { items: [
                  { label: 'Archive Selected', icon: <Archive className="w-4 h-4" />, danger: true, onClick: handleBulkDelete },
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
              Register Employee
            </CButton>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden p-4 bg-white gap-0">
          {showFilters && <CFilterSidebar groups={hrFilters} />}
          <div className="flex-1 overflow-y-auto">
            <CDataTable 
              data={MOCK_EMPLOYEES} 
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
