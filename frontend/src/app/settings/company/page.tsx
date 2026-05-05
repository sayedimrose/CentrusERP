'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CreditCard, 
  Calendar,
  Save,
  Upload
} from 'lucide-react';
import { 
  CCard, 
  CInput, 
  CButton, 
  CSectionHeader,
  CSelect
} from '@/components/centrus';

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <CSectionHeader 
          title="Company Profile" 
          subtitle="Manage your organization's legal and contact information for ZATCA compliance"
        />
        <CButton icon={Save} loading={loading}>
          Save Changes
        </CButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <CCard title="Basic Information" icon={Building2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CInput 
                label="Company Name (English)" 
                placeholder="Centrus Solutions LLC" 
                required
              />
              <CInput 
                label="Company Name (Arabic)" 
                placeholder="شركة سنتريس للحلول" 
                required
                className="text-right"
                dir="rtl"
              />
              <CInput 
                label="VAT Registration Number" 
                placeholder="310123456700003" 
                maxLength={15}
                required
              />
              <CInput 
                label="Commercial Registration (CR)" 
                placeholder="1010123456" 
                required
              />
            </div>
          </CCard>

          {/* ZATCA Address Requirements */}
          <CCard title="Registered Address" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CInput 
                label="Building Number" 
                placeholder="1234" 
                required
              />
              <CInput 
                label="Postal Code" 
                placeholder="12345" 
                required
              />
              <CInput 
                label="Street Name (English)" 
                placeholder="King Fahd Road" 
                required
              />
              <CInput 
                label="Street Name (Arabic)" 
                placeholder="طريق الملك فهد" 
                required
                dir="rtl"
              />
              <CInput 
                label="District (English)" 
                placeholder="Al Olaya" 
                required
              />
              <CInput 
                label="District (Arabic)" 
                placeholder="العليا" 
                required
                dir="rtl"
              />
              <CInput 
                label="City (English)" 
                placeholder="Riyadh" 
                required
              />
              <CInput 
                label="City (Arabic)" 
                placeholder="الرياض" 
                required
                dir="rtl"
              />
              <CInput 
                label="Country" 
                value="Saudi Arabia" 
                disabled
              />
            </div>
          </CCard>
        </div>

        {/* Branding & Contact */}
        <div className="space-y-6">
          <CCard title="Company Logo" icon={Upload}>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-32 h-32 rounded-xl border-2 border-dashed border-border-subtle flex items-center justify-center bg-gray-50 overflow-hidden group relative cursor-pointer hover:bg-gray-100 transition-colors">
                <Upload className="w-8 h-8 text-text-muted group-hover:scale-110 transition-transform" />
                <span className="absolute bottom-2 text-[10px] font-medium text-text-muted">Click to upload</span>
              </div>
              <p className="text-xs text-center text-text-muted px-4">
                Recommended: 512x512px, PNG or JPG format (Max 2MB)
              </p>
            </div>
          </CCard>

          <CCard title="Contact Details" icon={Phone}>
            <div className="space-y-4">
              <CInput 
                label="Primary Phone" 
                icon={Phone}
                placeholder="+966 50 000 0000" 
              />
              <CInput 
                label="Primary Email" 
                icon={Mail}
                placeholder="info@centrus.sa" 
              />
              <CInput 
                label="Website" 
                icon={Globe}
                placeholder="https://www.centrus.sa" 
              />
            </div>
          </CCard>

          <CCard title="System Settings" icon={Calendar}>
            <div className="space-y-4">
              <CSelect 
                label="Base Currency"
                options={[
                  { label: 'Saudi Riyal (SAR)', value: 'SAR' },
                  { label: 'US Dollar (USD)', value: 'USD' },
                ]}
                defaultValue="SAR"
              />
              <div className="grid grid-cols-2 gap-2">
                <CInput 
                  label="Fiscal Year Start" 
                  type="date" 
                  defaultValue="2024-01-01"
                />
                <CInput 
                  label="Fiscal Year End" 
                  type="date" 
                  defaultValue="2024-12-31"
                />
              </div>
            </div>
          </CCard>
        </div>
      </div>
    </div>
  );
}
