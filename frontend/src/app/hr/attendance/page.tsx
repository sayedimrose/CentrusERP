'use client';

import React, { useState, useMemo } from 'react';
import { 
  Clock, 
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
  Timer,
  Fingerprint,
  MapPin,
  History,
  FileSpreadsheet
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

interface AttendanceRecord {
  id: string;
  employee_name: string;
  employee_code: string;
  date: string;
  clock_in: string;
  clock_out: string;
  total_hours: number;
  overtime: number;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
}

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: '1', employee_name: 'Sayed Abbas', employee_code: 'EMP-1001', date: '2026-05-06', clock_in: '08:30', clock_out: '17:30', total_hours: 9.0, overtime: 1.0, status: 'Present' },
  { id: '2', employee_name: 'Mohammed Ali', employee_code: 'EMP-1002', date: '2026-05-06', clock_in: '09:15', clock_out: '17:00', total_hours: 7.75, overtime: 0, status: 'Late' },
  { id: '3', employee_name: 'John Doe', employee_code: 'EMP-1005', date: '2026-05-06', clock_in: '-', clock_out: '-', total_hours: 0, overtime: 0, status: 'Absent' },
];

export default function AttendancePage() {
  const [showFilters, setShowFilters] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const { toasts, addToast, removeToast } = useToasts();
  const selectedCount = Object.keys(rowSelection).length;

  const handleAdjustSubmit = () => {
    addToast('Attendance record adjusted successfully!', 'success');
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleEdit = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const attendanceFilters: FilterGroup[] = [
    { id: 'status', title: 'Status', options: [{ label: 'Present', count: 35 }, { label: 'Absent', count: 5 }, { label: 'Late', count: 3 }, { label: 'Half Day', count: 2 }] },
    { id: 'branch', title: 'Branch', options: [{ label: 'Riyadh Main', count: 30 }, { label: 'Jeddah Branch', count: 15 }] },
  ];

  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(() => [
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
    { accessorKey: 'date', header: 'Date', cell: info => <span className="text-text-main text-xs font-medium">{info.getValue() as string}</span>, size: 120 },
    { 
      accessorKey: 'clock_in', 
      header: 'Clock In', 
      cell: info => (
        <div className="flex items-center gap-1.5 text-green-600 font-mono text-xs font-bold">
          <Clock className="w-3 h-3" />
          {info.getValue() as string}
        </div>
      ),
      size: 100 
    },
    { 
      accessorKey: 'clock_out', 
      header: 'Clock Out', 
      cell: info => (
        <div className="flex items-center gap-1.5 text-blue-600 font-mono text-xs font-bold">
          <Clock className="w-3 h-3" />
          {info.getValue() as string}
        </div>
      ),
      size: 100 
    },
    { 
      accessorKey: 'total_hours', 
      header: 'Work Hours', 
      cell: info => (
        <div className="flex items-center gap-1.5">
          <Timer className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs text-text-main font-bold">{info.getValue() as number}h</span>
        </div>
      ),
      size: 120 
    },
    { accessorKey: 'overtime', header: 'Overtime', cell: info => <span className={info.getValue() as number > 0 ? 'text-orange-600 font-bold text-xs' : 'text-text-muted text-xs'}>+{info.getValue() as number}h</span>, size: 100 },
    { 
      accessorKey: 'status', 
      header: 'Status', 
      cell: info => (
        <CBadge 
          variant={info.getValue() === 'Present' ? 'success' : info.getValue() === 'Absent' ? 'danger' : 'warning'} 
          size="sm"
        >
          {info.getValue() as string}
        </CBadge>
      ),
      size: 100 
    },
  ], []);

  return (
    <div className="flex flex-col gap-6 h-full">
      <CToast toasts={toasts} onRemove={removeToast} />

      <CDialog
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedRecord(null); }}
        title={selectedRecord ? "Manual Adjustment" : "Log Attendance Entry"}
        icon={selectedRecord ? <Fingerprint className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        buttons={[
          { label: 'Cancel', onClick: () => { setIsModalOpen(false); setSelectedRecord(null); }, variant: 'outline' },
          { label: 'Save Entry', onClick: handleAdjustSubmit, variant: 'primary' },
        ]}
      >
        <div className="space-y-4">
          <CSelect 
            label="Employee" 
            options={[{ label: 'Sayed Abbas (EMP-1001)', value: '1' }, { label: 'Mohammed Ali (EMP-1002)', value: '2' }]} 
            defaultValue={selectedRecord?.id}
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <CInput label="Log Date" type="date" defaultValue={selectedRecord?.date || new Date().toISOString().split('T')[0]} required />
            <CSelect 
              label="Attendance Status" 
              options={[{ label: 'Present', value: 'Present' }, { label: 'Absent', value: 'Absent' }, { label: 'Late', value: 'Late' }]} 
              defaultValue={selectedRecord?.status}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CInput label="Clock In Time" type="time" defaultValue={selectedRecord?.clock_in} icon={<Clock className="w-4 h-4" />} />
            <CInput label="Clock Out Time" type="time" defaultValue={selectedRecord?.clock_out} icon={<Clock className="w-4 h-4" />} />
          </div>
          <CInput label="Adjustment Reason" placeholder="e.g. Forgot to clock in" icon={<FileSpreadsheet className="w-4 h-4" />} />
        </div>
      </CDialog>

      {/* Action Bar */}
      <CCard padding="none" className="overflow-hidden flex flex-col min-h-[650px] shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-white">
          <div className="flex items-center gap-4">
            <CIconBadge
              icon={<Clock className="w-4 h-4" />}
              colorClass="bg-gray-100 text-text-muted"
              shape="circle"
              size="lg"
            />
            <div>
              <CPageTitle>Daily Attendance</CPageTitle>
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
                  { label: 'Import Biometric Data', icon: <Fingerprint className="w-4 h-4" /> },
                  { label: 'Attendance Report', icon: <FileSpreadsheet className="w-4 h-4" /> },
                ]},
                { items: [
                  { label: 'Sync with Payroll', icon: <History className="w-4 h-4" /> },
                  { label: 'Shift Management', icon: <MapPin className="w-4 h-4" /> },
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
              Log Entry
            </CButton>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden p-4 bg-white gap-0">
          {showFilters && <CFilterSidebar groups={attendanceFilters} />}
          <div className="flex-1 overflow-y-auto">
            <CDataTable 
              data={MOCK_ATTENDANCE} 
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
