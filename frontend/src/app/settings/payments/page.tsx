'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Wallet, 
  Banknote, 
  Smartphone, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Link as LinkIcon
} from 'lucide-react';
import { 
  CCard, 
  CButton, 
  CInput, 
  CSectionHeader, 
  CBadge,
  CSelect
} from '@/components/centrus';

const mockPaymentModes = [
  { id: 1, name_en: 'Cash', name_ar: 'نقدي', type: 'CASH', gl_account: '101001 - Cash in Hand', status: 'Active', is_default: true },
  { id: 2, name_en: 'MADA (Debit Card)', name_ar: 'مدى', type: 'BANK_TRANSFER', gl_account: '102001 - Al Rajhi Bank', status: 'Active', is_default: false },
  { id: 3, name_en: 'STC Pay', name_ar: 'اس تي سي باي', type: 'WALLET', gl_account: '103005 - STC Pay Wallet', status: 'Active', is_default: false },
  { id: 4, name_en: 'Tabby (Installments)', name_ar: 'تابي', type: 'CREDIT', gl_account: '105010 - Tabby Receivables', status: 'Inactive', is_default: false },
];

export default function PaymentModesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CASH': return <Banknote className="w-5 h-5" />;
      case 'BANK_TRANSFER': return <CreditCard className="w-5 h-5" />;
      case 'WALLET': return <Smartphone className="w-5 h-5" />;
      default: return <Wallet className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <CSectionHeader 
          title="Payment Modes" 
          subtitle="Configure how you accept payments and map them to your general ledger"
        />
        <CButton icon={Plus}>Add Payment Mode</CButton>
      </div>

      <CCard className="!p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <CInput 
            placeholder="Search payment modes..." 
            className="pl-10 !mb-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockPaymentModes.map((mode) => (
          <CCard key={mode.id} className="group relative">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${mode.status === 'Active' ? 'bg-primary-light text-primary' : 'bg-gray-100 text-text-muted'}`}>
                {getTypeIcon(mode.type)}
              </div>
              <div className="flex items-center gap-2">
                {mode.is_default && <CBadge variant="primary">Default</CBadge>}
                <CBadge variant={mode.status === 'Active' ? 'success' : 'neutral'}>{mode.status}</CBadge>
              </div>
            </div>

            <div className="space-y-1 mb-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-text-main">{mode.name_en}</h3>
                <span className="text-sm font-medium text-text-muted" dir="rtl">{mode.name_ar}</span>
              </div>
              <p className="text-xs text-text-muted font-medium">{mode.type.replace('_', ' ')}</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-border-subtle flex items-center justify-between group-hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-xs font-semibold text-text-main">{mode.gl_account}</span>
              </div>
              <CButton variant="outline" size="sm" className="h-7 text-[10px] px-2">Change</CButton>
            </div>

            <button className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 rounded-md">
              <MoreVertical className="w-4 h-4 text-text-muted" />
            </button>
          </CCard>
        ))}

        <div className="border-2 border-dashed border-border-subtle rounded-2xl flex flex-col items-center justify-center p-8 gap-3 group hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
          <div className="p-3 bg-gray-100 rounded-full group-hover:bg-primary-light group-hover:text-primary transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-text-muted group-hover:text-primary">Add New Method</span>
        </div>
      </div>
    </div>
  );
}
