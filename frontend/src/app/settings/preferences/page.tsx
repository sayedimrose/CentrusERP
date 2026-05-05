'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Languages, 
  Coins, 
  Calculator, 
  Bell, 
  Shield, 
  Save,
  Info,
  Clock,
  Eye,
  Calendar
} from 'lucide-react';
import { 
  CCard, 
  CButton, 
  CInput, 
  CSectionHeader, 
  CSelect
} from '@/components/centrus';

export default function GeneralPreferencesPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <CSectionHeader 
          title="General Preferences" 
          subtitle="Configure system-wide regional settings, display rules, and localization"
        />
        <CButton icon={Save} loading={loading}>Save Preferences</CButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional & Localization */}
        <div className="space-y-6">
          <CCard title="Regional Settings" icon={Languages}>
            <div className="space-y-4">
              <CSelect 
                label="System Language"
                options={[
                  { label: 'English (US)', value: 'en' },
                  { label: 'Arabic (KSA)', value: 'ar' },
                  { label: 'Bilingual (EN/AR)', value: 'both' },
                ]}
                defaultValue="both"
              />
              <CSelect 
                label="Timezone"
                options={[
                  { label: '(GMT+03:00) Riyadh, Kuwait, Baghdad', value: 'Asia/Riyadh' },
                  { label: '(GMT+04:00) Abu Dhabi, Muscat', value: 'Asia/Dubai' },
                ]}
                defaultValue="Asia/Riyadh"
              />
              <div className="grid grid-cols-2 gap-4">
                <CSelect 
                  label="Date Format"
                  options={[
                    { label: 'DD/MM/YYYY', value: 'dmy' },
                    { label: 'YYYY-MM-DD', value: 'ymd' },
                    { label: 'MM/DD/YYYY', value: 'mdy' },
                  ]}
                  defaultValue="dmy"
                />
                <CSelect 
                  label="Time Format"
                  options={[
                    { label: '12 Hour (AM/PM)', value: '12h' },
                    { label: '24 Hour', value: '24h' },
                  ]}
                  defaultValue="24h"
                />
              </div>
            </div>
          </CCard>

          <CCard title="Financial Display" icon={Calculator}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CSelect 
                  label="Decimal Places (Currency)"
                  options={[
                    { label: '2 Places (0.00)', value: '2' },
                    { label: '3 Places (0.000)', value: '3' },
                  ]}
                  defaultValue="2"
                />
                <CSelect 
                  label="Decimal Places (Stock)"
                  options={[
                    { label: '0 Places (Whole)', value: '0' },
                    { label: '2 Places (0.00)', value: '2' },
                    { label: '3 Places (0.000)', value: '3' },
                  ]}
                  defaultValue="2"
                />
              </div>
              <CSelect 
                label="Rounding Rule"
                options={[
                  { label: 'Round to Nearest', value: 'nearest' },
                  { label: 'Always Round Up', value: 'up' },
                  { label: 'Always Round Down', value: 'down' },
                ]}
                defaultValue="nearest"
              />
            </div>
          </CCard>
        </div>

        {/* System & Security */}
        <div className="space-y-6">
          <CCard title="POS & Sales Preferences" icon={Settings}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-border-subtle">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-text-main">Allow Negative Stock Sales</span>
                  <span className="text-[10px] text-text-muted">Allow POS to sell items not currently in inventory</span>
                </div>
                <Toggle />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-border-subtle">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-text-main">Auto-Print Receipts</span>
                  <span className="text-[10px] text-text-muted">Automatically print POS tickets after payment</span>
                </div>
                <Toggle checked />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-border-subtle">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-text-main">Enable Customer Credit</span>
                  <span className="text-[10px] text-text-muted">Allow sales on credit for registered customers</span>
                </div>
                <Toggle checked />
              </div>
            </div>
          </CCard>

          <CCard title="Security & Session" icon={Shield}>
            <div className="space-y-4">
              <CSelect 
                label="Auto Logout (Idle Time)"
                options={[
                  { label: '15 Minutes', value: '15' },
                  { label: '30 Minutes', value: '30' },
                  { label: '1 Hour', value: '60' },
                  { label: 'Never', value: '0' },
                ]}
                defaultValue="30"
              />
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-border-subtle">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-text-main">Force MFA for Admins</span>
                  <span className="text-[10px] text-text-muted">Multi-factor authentication required for all admin accounts</span>
                </div>
                <Toggle />
              </div>
            </div>
          </CCard>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked = false }: { checked?: boolean }) {
  const [active, setActive] = useState(checked);
  return (
    <button 
      onClick={() => setActive(!active)}
      className={`w-10 h-5 rounded-full transition-all relative ${active ? 'bg-primary' : 'bg-gray-300'}`}
    >
      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${active ? 'left-6' : 'left-1'}`} />
    </button>
  );
}
