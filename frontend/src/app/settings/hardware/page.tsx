'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  Scan, 
  Monitor, 
  Cpu, 
  Plus, 
  Search, 
  Wifi, 
  Usb, 
  Trash2, 
  RefreshCw,
  MoreVertical,
  Activity
} from 'lucide-react';
import { 
  CCard, 
  CButton, 
  CInput, 
  CSectionHeader, 
  CBadge,
  CDialog,
  CSelect
} from '@/components/centrus';

const mockDevices = [
  { id: 1, name: 'Counter 1 Receipt Printer', type: 'PRINTER', connection: 'NETWORK', address: '192.168.1.50', status: 'Online' },
  { id: 2, name: 'Kitchen Order Printer', type: 'PRINTER', connection: 'NETWORK', address: '192.168.1.51', status: 'Offline' },
  { id: 3, name: 'Main POS Scanner', type: 'SCANNER', connection: 'USB', address: 'USB Port 002', status: 'Online' },
  { id: 4, name: 'Payment Terminal (MADA)', type: 'PAYMENT_TERMINAL', connection: 'NETWORK', address: '192.168.1.60', status: 'Online' },
];

export default function HardwareDevicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'PRINTER': return <Printer className="w-6 h-6" />;
      case 'SCANNER': return <Scan className="w-6 h-6" />;
      case 'PAYMENT_TERMINAL': return <Monitor className="w-6 h-6" />;
      default: return <Cpu className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <CSectionHeader 
          title="Hardware Devices" 
          subtitle="Configure and monitor POS peripherals, printers, and network terminals"
        />
        <CButton icon={Plus} onClick={() => setIsModalOpen(true)}>Add Device</CButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockDevices.map((device) => (
          <CCard key={device.id} className="group overflow-hidden">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${device.status === 'Online' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {getIcon(device.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-text-main truncate">{device.name}</h3>
                  <CBadge variant={device.status === 'Online' ? 'success' : 'danger'}>
                    {device.status}
                  </CBadge>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <div className="flex items-center gap-1">
                    {device.connection === 'NETWORK' ? <Wifi className="w-3 h-3" /> : <Usb className="w-3 h-3" />}
                    {device.connection}
                  </div>
                  <span>•</span>
                  <span className="font-mono">{device.address}</span>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <CButton variant="ghost" size="sm" icon={RefreshCw} className="!p-2 h-9 w-9" />
                <CButton variant="ghost" size="sm" icon={Trash2} className="!p-2 h-9 w-9 text-red-500 hover:bg-red-50" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border-subtle grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-tight">Last Signal</span>
                <span className="text-xs font-semibold text-text-main">2 mins ago</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-tight">Active Jobs</span>
                <span className="text-xs font-semibold text-text-main">0</span>
              </div>
              <CButton variant="outline" size="sm" className="h-8 text-[10px]">Test Device</CButton>
            </div>
          </CCard>
        ))}
      </div>

      {/* Add Device Modal */}
      <CDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Hardware">
        <div className="space-y-4 pt-2">
          <CInput label="Device Name" placeholder="e.g. Reception Epson TM-T88" required />
          <div className="grid grid-cols-2 gap-4">
            <CSelect 
              label="Device Type"
              options={[
                { label: 'Printer', value: 'PRINTER' },
                { label: 'Scanner', value: 'SCANNER' },
                { label: 'Payment Terminal', value: 'PAYMENT_TERMINAL' },
                { label: 'Cash Drawer', value: 'CASH_DRAWER' },
              ]}
            />
            <CSelect 
              label="Connection"
              options={[
                { label: 'Network (IP)', value: 'NETWORK' },
                { label: 'USB / Serial', value: 'USB' },
                { label: 'Bluetooth', value: 'BT' },
              ]}
            />
          </div>
          <CInput label="IP Address / Port" placeholder="e.g. 192.168.1.100" />
          
          <div className="flex justify-end gap-3 mt-6">
            <CButton variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</CButton>
            <CButton onClick={() => setIsModalOpen(false)}>Add Device</CButton>
          </div>
        </div>
      </CDialog>
    </div>
  );
}
