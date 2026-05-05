'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MapPin, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Building2
} from 'lucide-react';
import { 
  CCard, 
  CButton, 
  CInput, 
  CSectionHeader, 
  CBadge,
  CDialog
} from '@/components/centrus';

const mockBranches = [
  {
    id: 1,
    code: 'BR-001',
    name_en: 'Riyadh Main Branch',
    name_ar: 'فرع الرياض الرئيسي',
    city: 'Riyadh',
    status: 'Active',
    manager: 'Ahmed Al-Saud',
    phone: '+966 11 234 5678'
  },
  {
    id: 2,
    code: 'BR-002',
    name_en: 'Jeddah Coastal Store',
    name_ar: 'متجر جدة الساحلي',
    city: 'Jeddah',
    status: 'Active',
    manager: 'Omar Bakri',
    phone: '+966 12 987 6543'
  },
  {
    id: 3,
    code: 'BR-003',
    name_en: 'Dammam Warehouse Outlet',
    name_ar: 'منفذ مستودع الدمام',
    city: 'Dammam',
    status: 'Inactive',
    manager: 'Sara Mansour',
    phone: '+966 13 444 5555'
  }
];

export default function BranchSetupPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <CSectionHeader 
          title="Branch Setup" 
          subtitle="Manage your physical stores, warehouses, and distribution centers"
        />
        <CButton icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add New Branch
        </CButton>
      </div>

      {/* Filters & Search */}
      <CCard className="!p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <CInput 
              placeholder="Search by name, code or city..." 
              className="pl-10 !mb-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <CButton variant="outline" size="sm">Export CSV</CButton>
            <CButton variant="outline" size="sm">Filter By City</CButton>
          </div>
        </div>
      </CCard>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockBranches.map((branch) => (
          <CCard key={branch.id} className="group relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary-light text-primary">
                <Building2 className="w-6 h-6" />
              </div>
              <CBadge variant={branch.status === 'Active' ? 'success' : 'neutral'}>
                {branch.status}
              </CBadge>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="font-bold text-lg text-text-main group-hover:text-primary transition-colors">
                {branch.name_en}
              </h3>
              <p className="text-sm font-medium text-text-muted" dir="rtl">
                {branch.name_ar}
              </p>
              <p className="text-xs text-text-muted flex items-center gap-1">
                <span className="font-bold text-primary">{branch.code}</span> • {branch.city}
              </p>
            </div>

            <div className="pt-4 border-t border-border-subtle flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <MapPin className="w-3.5 h-3.5" />
                <span>Managed by: <b>{branch.manager}</b></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{branch.phone}</span>
              </div>
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                <button className="p-2 bg-white rounded-md shadow-sm border border-border-subtle hover:text-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-md shadow-sm border border-border-subtle hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CCard>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <CDialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Register New Branch"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <CInput label="Branch Code" placeholder="e.g. BR-004" required />
            <CInput label="Manager Name" placeholder="Full Name" />
          </div>
          <CInput label="Branch Name (English)" placeholder="e.g. East Coast Hub" required />
          <CInput label="Branch Name (Arabic)" placeholder="e.g. مركز الساحل الشرقي" required dir="rtl" />
          
          <div className="p-3 bg-gray-50 rounded-lg space-y-3">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Address Details (ZATCA)</h4>
            <div className="grid grid-cols-2 gap-3">
              <CInput label="Building No" placeholder="1234" />
              <CInput label="Postal Code" placeholder="12345" />
            </div>
            <CInput label="Street Name" placeholder="Main St" />
            <CSelect 
              label="City" 
              options={[
                { label: 'Riyadh', value: 'riyadh' },
                { label: 'Jeddah', value: 'jeddah' },
                { label: 'Dammam', value: 'dammam' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <CButton variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</CButton>
            <CButton onClick={() => setIsModalOpen(false)}>Create Branch</CButton>
          </div>
        </div>
      </CDialog>
    </div>
  );
}
