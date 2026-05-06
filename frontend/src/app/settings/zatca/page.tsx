'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Key, 
  Lock,
  Globe,
  FileCheck,
  MoreVertical,
  Filter,
  RefreshCcw,
  Download,
  Upload,
  Settings2,
  FileText,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Activity,
  Server
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
  CTextarea,
  CPageTitle
} from '@/components/centrus';
import { ColumnDef } from '@tanstack/react-table';

interface ZatcaConfig {
  id: string;
  environment: 'SANDBOX' | 'SIMULATION' | 'PRODUCTION';
  csid_status: 'Active' | 'Revoked' | 'Pending';
  compliance_level: 'Phase 1' | 'Phase 2';
  last_sync: string;
  organization_unit: string;
}

const MOCK_ZATCA: ZatcaConfig[] = [
  { id: '1', environment: 'PRODUCTION', csid_status: 'Active', compliance_level: 'Phase 2', last_sync: '2026-05-06 09:12', organization_unit: 'Main Headquarters' },
  { id: '2', environment: 'SANDBOX', csid_status: 'Active', compliance_level: 'Phase 2', last_sync: '2026-05-04 14:30', organization_unit: 'Development Testing' },
  { id: '3', environment: 'SIMULATION', csid_status: 'Revoked', compliance_level: 'Phase 2', last_sync: '2026-04-20 10:00', organization_unit: 'Riyadh Branch' },
];

export default function ZatcaSettingsPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ZatcaConfig | null>(null);

  const { toasts, addToast, removeToast } = useToasts();
  const selectedCount = Object.keys(rowSelection).length;

  const handleAddSubmit = () => {
    const mode = selectedConfig ? 'updated' : 'initialized';
    addToast(`ZATCA integration ${mode} successfully!`, 'success');
    setIsModalOpen(false);
    setSelectedConfig(null);
  };

  const handleEdit = (config: ZatcaConfig) => {
    setSelectedConfig(config);
    setIsModalOpen(true);
  };

  const zatcaFilters: FilterGroup[] = [
    { id: 'env', title: 'Environment', options: [{ label: 'PRODUCTION', count: 1 }, { label: 'SANDBOX', count: 1 }, { label: 'SIMULATION', count: 1 }] },
    { id: 'status', title: 'CSID Status', options: [{ label: 'Active', count: 2 }, { label: 'Revoked', count: 1 }] },
  ];

  const columns = useMemo<ColumnDef<ZatcaConfig>[]>(() => [
    { 
      accessorKey: 'environment', 
      header: 'Environment', 
      cell: info => (
        <div className="flex items-center gap-2">
          {info.getValue() === 'PRODUCTION' ? <Server className="w-3.5 h-3.5 text-red-500" /> : <Globe className="w-3.5 h-3.5 text-blue-500" />}
          <span className={`text-xs font-bold ${info.getValue() === 'PRODUCTION' ? 'text-red-600' : 'text-blue-600'}`}>
            {info.getValue() as string}
          </span>
        </div>
      ),
      size: 150 
    },
    { accessorKey: 'organization_unit', header: 'Org Unit', cell: info => <span className="font-medium text-text-main text-xs">{info.getValue() as string}</span>, size: 200 },
    { 
      accessorKey: 'csid_status', 
      header: 'CSID Status', 
      cell: info => (
        <CBadge variant={info.getValue() === 'Active' ? 'success' : info.getValue() === 'Revoked' ? 'danger' : 'default'} size="sm">
          {info.getValue() as string}
        </CBadge>
      ),
      size: 120 
    },
    { accessorKey: 'compliance_level', header: 'Compliance', cell: info => <CBadge variant="primary" size="sm">{info.getValue() as string}</CBadge>, size: 120 },
    { accessorKey: 'last_sync', header: 'Last Sync', cell: info => <span className="text-text-muted text-xs font-mono">{info.getValue() as string}</span>, size: 180 },
    { accessorKey: 'id', header: 'ID', cell: info => <span className="text-text-muted text-[10px] font-mono">{info.getValue() as string}</span>, size: 150 },
  ], []);

  return (
    <div className="flex flex-col gap-6 h-full">
      <CToast toasts={toasts} onRemove={removeToast} />

      <CDialog
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedConfig(null); }}
        title={selectedConfig ? "Update ZATCA CSID / Certificate" : "New ZATCA Onboarding"}
        icon={selectedConfig ? <Lock className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
        buttons={[
          { label: 'Cancel', onClick: () => { setIsModalOpen(false); setSelectedConfig(null); }, variant: 'outline' },
          { label: selectedConfig ? 'Update Integration' : 'Initialize Onboarding', onClick: handleAddSubmit, variant: 'primary' },
        ]}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <CSelect 
              label="Environment" 
              options={[
                { label: 'Sandbox (Test)', value: 'SANDBOX' },
                { label: 'Simulation', value: 'SIMULATION' },
                { label: 'Production (Live)', value: 'PRODUCTION' }
              ]} 
              defaultValue={selectedConfig?.environment}
              required 
            />
            <CInput label="Org Unit Name" placeholder="e.g. Riyadh Main Office" defaultValue={selectedConfig?.organization_unit} required />
          </div>
          <CInput label="OTP (from FATOORA Portal)" placeholder="6-digit OTP code" required icon={<Key className="w-4 h-4" />} />
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-muted uppercase px-1">Security Certificate (Base64)</label>
            <CTextarea placeholder="Paste your X.509 certificate content here..." rows={4} className="font-mono text-[10px]" />
          </div>
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-blue-700 leading-relaxed">
              ZATCA Phase 2 requires onboarding each EGS (Electronic Generating System) unit individually. 
              Ensure you have generated the private key correctly before pasting the certificate.
            </p>
          </div>
        </div>
      </CDialog>

      {/* Action Bar */}
      <CCard padding="none" className="overflow-hidden flex flex-col min-h-[650px] shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-white">
          <div className="flex items-center gap-4">
            <CIconBadge
              icon={<ShieldCheck className="w-4 h-4" />}
              colorClass="bg-gray-100 text-text-muted"
              shape="circle"
              size="lg"
            />
            <CPageTitle>ZATCA Phase 2</CPageTitle>
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
                  { label: 'Check API Status', icon: <Activity className="w-4 h-4" /> },
                  { label: 'FATOORA Portal', icon: <Globe className="w-4 h-4" /> },
                ]},
                { items: [
                  { label: 'Clear Cache', icon: <Trash2 className="w-4 h-4" />, danger: true },
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
              New Onboarding
            </CButton>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden p-4 bg-white gap-0">
          {showFilters && <CFilterSidebar groups={zatcaFilters} />}
          <div className="flex-1 overflow-y-auto">
            <div className="mb-4 p-4 bg-green-50/50 border border-green-100 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="text-sm font-bold text-green-900">System is ZATCA Compliant</h3>
                  <p className="text-xs text-green-700">Phase 2 integration is active and all unit heartbeats are healthy.</p>
                </div>
              </div>
              <CButton variant="outline" size="sm" className="bg-white">View Compliance Log</CButton>
            </div>
            
            <CDataTable 
              data={MOCK_ZATCA} 
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
