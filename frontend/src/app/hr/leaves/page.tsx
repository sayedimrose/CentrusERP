'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plane, 
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
  UserCheck,
  UserX,
  Clock,
  Briefcase
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
  CTextarea,
  CPageTitle
} from '@/components/centrus';
import { ColumnDef } from '@tanstack/react-table';

interface LeaveRequest {
  id: string;
  employee_name: string;
  employee_code: string;
  leave_type: 'Annual' | 'Sick' | 'Unpaid' | 'Emergency';
  start_date: string;
  end_date: string;
  total_days: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const MOCK_LEAVES: LeaveRequest[] = [
  { id: '1', employee_name: 'John Doe', employee_code: 'EMP-1005', leave_type: 'Annual', start_date: '2026-05-10', end_date: '2026-05-20', total_days: 10, status: 'Approved' },
  { id: '2', employee_name: 'Mohammed Ali', employee_code: 'EMP-1002', leave_type: 'Sick', start_date: '2026-05-06', end_date: '2026-05-07', total_days: 1, status: 'Pending' },
  { id: '3', employee_name: 'Sayed Abbas', employee_code: 'EMP-1001', leave_type: 'Annual', start_date: '2026-06-15', end_date: '2026-06-30', total_days: 15, status: 'Pending' },
];

export default function LeaveApplicationsPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  const { toasts, addToast, removeToast } = useToasts();
  const selectedCount = Object.keys(rowSelection).length;

  const handleApprove = () => {
    addToast('Leave request approved successfully!', 'success');
    setIsModalOpen(false);
    setSelectedLeave(null);
  };

  const handleReject = () => {
    addToast('Leave request rejected.', 'error');
    setIsModalOpen(false);
    setSelectedLeave(null);
  };

  const handleEdit = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };

  const leaveFilters: FilterGroup[] = [
    { id: 'type', title: 'Leave Type', options: [{ label: 'Annual', count: 12 }, { label: 'Sick', count: 5 }, { label: 'Unpaid', count: 2 }, { label: 'Emergency', count: 1 }] },
    { id: 'status', title: 'Status', options: [{ label: 'Approved', count: 15 }, { label: 'Pending', count: 3 }, { label: 'Rejected', count: 2 }] },
  ];

  const columns = useMemo<ColumnDef<LeaveRequest>[]>(() => [
    { 
      accessorKey: 'employee_name', 
      header: 'Employee', 
      cell: info => (
        <div className="flex items-center gap-3">
          <CAvatar initials={info.getValue() as string === 'John Doe' ? 'JD' : 'SA'} size="sm" />
          <div className="flex flex-col">
            <span className="font-medium text-text-main">{info.getValue() as string}</span>
            <span className="text-[10px] text-text-muted font-mono">{info.row.original.employee_code}</span>
          </div>
        </div>
      ),
      size: 200 
    },
    { 
      accessorKey: 'leave_type', 
      header: 'Type', 
      cell: info => (
        <div className="flex items-center gap-1.5">
          {info.getValue() === 'Annual' && <Plane className="w-3.5 h-3.5 text-blue-500" />}
          {info.getValue() === 'Sick' && <Briefcase className="w-3.5 h-3.5 text-red-500" />}
          <span className="text-xs text-text-main font-medium">{info.getValue() as string}</span>
        </div>
      ),
      size: 130 
    },
    { 
      accessorKey: 'start_date', 
      header: 'Duration', 
      cell: info => (
        <div className="flex flex-col">
          <span className="text-xs text-text-main font-medium">{info.row.original.start_date} → {info.row.original.end_date}</span>
          <span className="text-[10px] text-text-muted">{info.row.original.total_days} Working Days</span>
        </div>
      ),
      size: 220 
    },
    { 
      accessorKey: 'status', 
      header: 'Status', 
      cell: info => (
        <CBadge 
          variant={info.getValue() === 'Approved' ? 'success' : info.getValue() === 'Pending' ? 'primary' : 'danger'} 
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
        onClose={() => { setIsModalOpen(false); setSelectedLeave(null); }}
        title={selectedLeave ? "Review Leave Application" : "New Leave Request"}
        icon={selectedLeave ? <FileText className="w-5 h-5" /> : <Plane className="w-5 h-5" />}
        buttons={selectedLeave && selectedLeave.status === 'Pending' ? [
          { label: 'Reject', onClick: handleReject, variant: 'outline' },
          { label: 'Approve Leave', onClick: handleApprove, variant: 'primary' },
        ] : [
          { label: 'Close', onClick: () => { setIsModalOpen(false); setSelectedLeave(null); }, variant: 'outline' },
          { label: 'Submit Request', onClick: () => { setIsModalOpen(false); setSelectedLeave(null); addToast('Leave request submitted.', 'success'); }, variant: 'primary' },
        ]}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-sm font-bold text-primary">Leave Balance</h3>
                <p className="text-xs text-primary/80">Available: 22 Days (Annual Leave)</p>
              </div>
            </div>
            <CBadge variant="primary" size="sm">Standard Policy</CBadge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CSelect 
              label="Leave Type" 
              options={[{ label: 'Annual Vacation', value: 'Annual' }, { label: 'Sick Leave', value: 'Sick' }, { label: 'Emergency Leave', value: 'Emergency' }]} 
              defaultValue={selectedLeave?.leave_type}
              required 
            />
            <CSelect 
              label="Employee" 
              options={[{ label: 'Sayed Abbas (EMP-1001)', value: '1' }]} 
              defaultValue="1"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CInput label="From Date" type="date" defaultValue={selectedLeave?.start_date} required />
            <CInput label="To Date" type="date" defaultValue={selectedLeave?.end_date} required />
          </div>

          <CTextarea label="Reason for Leave" placeholder="Provide a brief explanation..." rows={3} />
          
          {selectedLeave?.status === 'Approved' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-[11px] text-green-700 font-medium">Approved by HR Manager on May 04, 2026</p>
            </div>
          )}
        </div>
      </CDialog>

      {/* Action Bar */}
      <CCard padding="none" className="overflow-hidden flex flex-col min-h-[650px] shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-white">
          <div className="flex items-center gap-4">
            <CIconBadge
              icon={<Plane className="w-4 h-4" />}
              colorClass="bg-gray-100 text-text-muted"
              shape="circle"
              size="lg"
            />
            <div>
              <CPageTitle>Leave Applications</CPageTitle>
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
                  { label: 'Leave Policy', icon: <FileText className="w-4 h-4" /> },
                  { label: 'Vacation Calendar', icon: <Calendar className="w-4 h-4" /> },
                ]},
                { items: [
                  { label: 'Balance Report', icon: <History className="w-4 h-4" /> },
                  { label: 'Reject Selected', icon: <UserX className="w-4 h-4" />, danger: true },
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
              Apply Leave
            </CButton>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden p-4 bg-white gap-0">
          {showFilters && <CFilterSidebar groups={leaveFilters} />}
          <div className="flex-1 overflow-y-auto">
            <CDataTable 
              data={MOCK_LEAVES} 
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
