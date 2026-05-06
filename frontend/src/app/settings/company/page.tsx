'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  Globe, 
  Image as ImageIcon, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2,
  RefreshCcw,
  Hash,
  Pencil,
  Calendar
} from 'lucide-react';
import { 
  CCard, 
  CButton, 
  CIconBadge,
  CToast,
  useToasts,
  CInput,
  CAvatar,
  CPageTitle
} from '@/components/centrus';

export default function CompanyInformationPage() {
  const { toasts, addToast, removeToast } = useToasts();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Company information updated successfully!', 'success');
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 h-full w-full">
      <CToast toasts={toasts} onRemove={removeToast} />

      {/* Standardized Action Bar (Full Width) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <CIconBadge
            icon={<Building2 className="w-4 h-4" />}
            colorClass="bg-gray-100 text-text-muted"
            shape="circle"
            size="lg"
          />
          <div>
            <CPageTitle>Company Information</CPageTitle>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CButton
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
            onClick={handleSave}
            loading={loading}
          >
            Save Changes
          </CButton>
        </div>
      </div>

      {/* Main Content (Grid of Cards, No Outer Card) */}
      <div className="grid grid-cols-12 gap-6 pb-12">
        
        {/* Left Section: Identity & Address */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Identity & Legal Details */}
          <CCard className="shadow-sm border-border-subtle">
            <div className="flex items-center gap-2 mb-6 border-b border-border-subtle pb-4">
              <Building2 className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-text-main">Identity & Legal Details</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CInput label="Company Name (EN)" defaultValue="Centrus ERP HQ" required />
                <CInput label="Company Name (AR)" defaultValue="سينتروس الرئيسي" required dir="rtl" className="text-right font-arabic" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CInput label="VAT Number" defaultValue="310123456789003" required icon={<Hash className="w-3.5 h-3.5" />} />
                <CInput label="CR Number" defaultValue="1010998877" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CInput label="Financial Year Start" type="date" defaultValue="2026-01-01" icon={<Calendar className="w-3.5 h-3.5" />} />
                <CInput label="Financial Year End" type="date" defaultValue="2026-12-31" icon={<Calendar className="w-3.5 h-3.5" />} />
              </div>
            </div>
          </CCard>

          {/* Registered Address (ZATCA compliant) */}
          <CCard className="shadow-sm border-border-subtle">
            <div className="flex items-center gap-2 mb-6 border-b border-border-subtle pb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-text-main">Registered Office (ZATCA)</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CInput label="Building No" defaultValue="1234" required />
                <CInput label="Street Name (EN/AR)" defaultValue="King Fahad Road" className="md:col-span-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CInput label="District" defaultValue="Al Olaya" />
                <CInput label="City" defaultValue="Riyadh" />
                <CInput label="Postal Code" defaultValue="12211" required />
              </div>
            </div>
          </CCard>

          {/* Contact Information */}
          <CCard className="shadow-sm border-border-subtle">
            <div className="flex items-center gap-2 mb-6 border-b border-border-subtle pb-4">
              <Globe className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-text-main">Contact Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CInput label="Official Email" type="email" defaultValue="ops@centrus.sa" icon={<Mail className="w-3.5 h-3.5" />} />
              <CInput label="Phone Number" defaultValue="+966 11 222 3344" icon={<Phone className="w-3.5 h-3.5" />} />
            </div>
          </CCard>
        </div>

        {/* Right Section: Branding & Compliance */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Company Branding */}
          <CCard className="shadow-sm border-border-subtle text-center">
            <div className="flex flex-col items-center py-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50">
                  <ImageIcon className="w-10 h-10 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
                <button className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-lg shadow-md border border-border-subtle text-primary hover:bg-primary hover:text-white transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <h3 className="mt-6 text-sm font-semibold text-text-main">Corporate Logo</h3>
              <p className="text-[11px] text-text-muted mt-2 px-4">
                This logo will appear on all tax invoices, receipts, and official reports.
              </p>
              <div className="mt-8 w-full">
                <CButton variant="outline" size="sm" fullWidth className="font-bold">Change Logo</CButton>
              </div>
            </div>
          </CCard>

          {/* Compliance Status */}
          <CCard className="shadow-sm border-green-100 bg-green-50/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-green-900">ZATCA Verified</h3>
                <p className="text-[11px] text-green-700 mt-1 leading-relaxed font-medium">
                  All identifiers are synchronized with the Saudi VAT portal regulations.
                </p>
              </div>
            </div>
          </CCard>

        </div>
      </div>
    </div>
  );
}
