'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Printer, 
  Scan, 
  CreditCard,
  MoreVertical,
  Filter,
  RefreshCcw,
  Download,
  Upload,
  Trash2,
  Archive,
  Copy,
  Settings2,
  FileText,
  Pencil,
  Monitor,
  Wifi,
  Usb,
  Cpu,
  CheckCircle2,
  XCircle
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

interface HardwareDevice {
  id: string;
  device_name: string;
  device_type: 'PRINTER' | 'SCANNER' | 'PAYMENT_TERMINAL' | 'CASH_DRAWER';
  branch_name: string;
  connection_type: 'NETWORK' | 'USB' | 'BLUETOOTH';
  ip_address: string;
  status: 'Online' | 'Offline';
}

const MOCK_HARDWARE: HardwareDevice[] = [
  { id: '1', device_name: 'Counter 1 Epson TM-T88VI', device_type: 'PRINTER', branch_name: 'Riyadh Main', connection_type: 'NETWORK', ip_address: '192.168.1.50', status: 'Online' },
  { id: '2', device_name: 'Honeywell Barcode Scanner', device_type: 'SCANNER', branch_name: 'Riyadh Main', connection_type: 'USB', ip_address: '-', status: 'Online' },
  { id: '3', device_name: 'Geidea POS Terminal', device_type: 'PAYMENT_TERMINAL', branch_name: 'Jeddah Coastal', connection_type: 'NETWORK', ip_address: '192.168.2.110', status: 'Offline' },
  { id: '4', device_name: 'Main Cash Drawer', device_type: 'CASH_DRAWER', branch_name: 'Riyadh Main', connection_type: 'USB', ip_address: '-', status: 'Online' },
];

export default function HardwareDevicesPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<HardwareDevice | null>(null);

  const { toasts, addToast, removeToast } = useToasts();
  const selectedCount = Object.keys(rowSelection).length;

  const handleAddSubmit = () => {
    const mode = selectedDevice ? 'updated' : 'paired';
    addToast(`Hardware device ${mode} successfully!`, 'success');
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  const handleEdit = (device: HardwareDevice) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedCount === 0) return;
    addToast(`${selectedCount} devices removed!`, 'error');
    setRowSelection({});
  };

  const hardwareFilters: FilterGroup[] = [
    { id: 'type', title: 'Device Type', options: [{ label: 'PRINTER', count: 1 }, { label: 'SCANNER', count: 1 }, { label: 'PAYMENT_TERMINAL', count: 1 }] },
    { id: 'branch', title: 'Branch', options: [{ label: 'Riyadh Main', count: 3 }, { label: 'Jeddah Coastal', count: 1 }] },
  ];

  const columns = useMemo<ColumnDef<HardwareDevice>[]>(() => [
    { 
      accessorKey: 'device_name', 
      header: 'Device Name', 
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-gray-50 text-text-muted">
            {info.row.original.device_type === 'PRINTER' && <Printer className="w-4 h-4" />}
            {info.row.original.device_type === 'SCANNER' && <Scan className="w-4 h-4" />}
            {info.row.original.device_type === 'PAYMENT_TERMINAL' && <CreditCard className="w-4 h-4" />}
            {info.row.original.device_type === 'CASH_DRAWER' && <Monitor className="w-4 h-4" />}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-text-main text-sm">{info.getValue() as string}</span>
            <span className="text-[10px] text-text-muted">{info.row.original.branch_name}</span>
          </div>
        </div>
      ),
      size: 300 
    },
    { 
      accessorKey: 'connection_type', 
      header: 'Connection', 
      cell: info => (
        <div className="flex items-center gap-1.5">
          {info.getValue() === 'NETWORK' && <Wifi className="w-3 h-3 text-blue-500" />}
          {info.getValue() === 'USB' && <Usb className="w-3 h-3 text-orange-500" />}
          <span className="text-xs text-text-main">{info.getValue() as string}</span>
        </div>
      ),
      size: 150 
    },
    { accessorKey: 'ip_address', header: 'Address / IP', cell: info => <span className="text-text-muted text-xs font-mono">{info.getValue() as string}</span>, size: 150 },
    { 
      accessorKey: 'status', 
      header: 'Status', 
      cell: info => (
        <div className="flex items-center gap-1.5">
          {info.getValue() === 'Online' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
          <CBadge variant={info.getValue() === 'Online' ? 'success' : 'danger'} size="sm">{info.getValue() as string}</CBadge>
        </div>
      ),
      size: 120 
    },
    { accessorKey: 'id', header: 'ID', cell: info => <span className="text-text-muted text-[10px] font-mono">{info.getValue() as string}</span>, size: 150 },
  ], []);

  return (
    <div className="flex flex-col gap-6 h-full">
      <CToast toasts={toasts} onRemove={removeToast} />

      <CDialog
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedDevice(null); }}
        title={selectedDevice ? "Edit Device Configuration" : "Register New Hardware"}
        icon={selectedDevice ? <Settings2 className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
        buttons={[
          { label: 'Cancel', onClick: () => { setIsModalOpen(false); setSelectedDevice(null); }, variant: 'outline' },
          { label: selectedDevice ? 'Update Settings' : 'Pair Device', onClick: handleAddSubmit, variant: 'primary' },
        ]}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <CSelect 
              label="Device Type" 
              options={[
                { label: 'Receipt Printer', value: 'PRINTER' },
                { label: 'Barcode Scanner', value: 'SCANNER' },
                { label: 'Payment Terminal', value: 'PAYMENT_TERMINAL' },
                { label: 'Cash Drawer', value: 'CASH_DRAWER' }
              ]} 
              defaultValue={selectedDevice?.device_type}
              required 
            />
            <CSelect 
              label="Branch" 
              options={[
                { label: 'Riyadh Main', value: 'riyadh' },
                { label: 'Jeddah Coastal', value: 'jeddah' }
              ]} 
              defaultValue="riyadh"
              required 
            />
          </div>
          <CInput label="Device Friendly Name" placeholder="e.g. Counter 1 Printer" defaultValue={selectedDevice?.device_name} required />
          <div className="grid grid-cols-2 gap-4">
            <CSelect 
              label="Connection Type" 
              options={[
                { label: 'Network (IP)', value: 'NETWORK' },
                { label: 'Direct USB', value: 'USB' },
                { label: 'Bluetooth', value: 'BLUETOOTH' }
              ]} 
              defaultValue={selectedDevice?.connection_type}
              required 
            />
            <CInput label="IP Address" placeholder="192.168.1.1" defaultValue={selectedDevice?.ip_address} disabled={selectedDevice?.connection_type === 'USB'} />
          </div>
        </div>
      </CDialog>

      {/* Action Bar */}
      <CCard padding="none" className="overflow-hidden flex flex-col min-h-[650px] shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-white">
          <div className="flex items-center gap-4">
            <CIconBadge
              icon={<Cpu className="w-4 h-4" />}
              colorClass="bg-gray-100 text-text-muted"
              shape="circle"
              size="lg"
            />
            <CPageTitle>Hardware Devices</CPageTitle>
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
                  { label: 'Auto-Detect Devices', icon: <Wifi className="w-4 h-4" /> },
                  { label: 'Test Connections', icon: <RefreshCcw className="w-4 h-4" /> },
                ]},
                { items: [
                  { label: 'Export to Excel', icon: <Download className="w-4 h-4" /> },
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
              Add Device
            </CButton>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden p-4 bg-white gap-0">
          {showFilters && <CFilterSidebar groups={hardwareFilters} />}
          <div className="flex-1 overflow-y-auto">
            <CDataTable 
              data={MOCK_HARDWARE} 
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
