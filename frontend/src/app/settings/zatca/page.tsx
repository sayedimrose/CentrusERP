'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings2, 
  Key, 
  FileCheck, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Info,
  Lock,
  Globe
} from 'lucide-react';
import { 
  CCard, 
  CButton, 
  CInput, 
  CSectionHeader, 
  CBadge,
  CSelect
} from '@/components/centrus';

export default function ZatcaSettingsPage() {
  const [env, setEnv] = useState('SANDBOX');
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <CSectionHeader 
          title="ZATCA E-Invoicing (FATOORA)" 
          subtitle="Onboard and manage your E-Invoicing Phase 2 integration with KSA Tax Authority"
        />
        <div className="flex gap-2">
          <CButton variant="outline" icon={ExternalLink}>ZATCA Portal</CButton>
          <CButton icon={RefreshCw}>Check Status</CButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Onboarding Status */}
        <div className="lg:col-span-2 space-y-6">
          <CCard title="Onboarding Status" icon={ShieldCheck}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-primary-light/30 border border-primary/10 rounded-2xl mb-4">
              <div className="flex gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
                  <Globe className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-text-main">Production Ready</h4>
                  <p className="text-sm text-text-muted">Environment: <span className="font-bold text-primary">{env}</span></p>
                </div>
              </div>
              <CBadge variant="success" className="text-sm py-1 px-3">ACTIVE & COMPLIANT</CBadge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 border border-border-subtle rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">CSID Status</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-main">Production CSID</span>
                  <CBadge variant="success">VALID</CBadge>
                </div>
                <p className="text-[10px] text-text-muted">Expires in 720 days</p>
              </div>
              <div className="p-4 border border-border-subtle rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">Compliance Cert</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-main">X.509 Certificate</span>
                  <CBadge variant="success">ISSUED</CBadge>
                </div>
                <p className="text-[10px] text-text-muted">Fingerprint: 8F:92:A1...3C</p>
              </div>
            </div>
          </CCard>

          <CCard title="Registration & Onboarding" icon={Settings2}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CSelect 
                  label="Environment Selection"
                  options={[
                    { label: 'Sandbox (Testing)', value: 'SANDBOX' },
                    { label: 'Simulation (Pre-prod)', value: 'SIMULATION' },
                    { label: 'Production (Live)', value: 'PRODUCTION' },
                  ]}
                  value={env}
                  onChange={(e) => setEnv(e.target.value)}
                />
                <CInput 
                  label="OTP (from FATOORA Portal)" 
                  placeholder="Enter 6-digit OTP" 
                  maxLength={6}
                  icon={Key}
                />
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-text-main">Onboarding Steps</h4>
                <div className="space-y-2">
                  <StepItem number="1" title="Generate CSR" description="Create a Cryptographic Signing Request for your company." status="completed" />
                  <StepItem number="2" title="Onboard Device" description="Submit OTP and CSR to ZATCA to receive your CSID." status="completed" />
                  <StepItem number="3" title="Compliance Test" description="Pass the mandatory 20+ invoice test scenarios." status="completed" />
                  <StepItem number="4" title="Production Activation" description="Switch to production environment for live e-invoicing." status="current" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                <CButton variant="outline">Reset Configuration</CButton>
                <CButton icon={ShieldCheck}>Begin Onboarding</CButton>
              </div>
            </div>
          </CCard>
        </div>

        {/* Security & Info */}
        <div className="space-y-6">
          <CCard title="Security Keys" icon={Lock}>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">Private Key</span>
                <div className="flex gap-2">
                  <CInput value="••••••••••••••••••••••••••••••••" disabled className="flex-1 !mb-0" />
                  <CButton variant="outline" size="sm" icon={RefreshCw} className="px-2" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">Public Key</span>
                <div className="p-3 bg-gray-50 rounded-lg border border-border-subtle overflow-hidden">
                  <p className="text-[10px] font-mono break-all text-text-muted">
                    -----BEGIN PUBLIC KEY-----
                    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7V...
                    -----END PUBLIC KEY-----
                  </p>
                </div>
              </div>
            </div>
          </CCard>

          <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600 h-fit">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900">Legal Requirement</h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                As per ZATCA regulations, all B2B and B2C transactions must be reported or cleared through the FATOORA portal. Tampering with certificates is a legal offense.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepItem({ number, title, description, status }: { number: string, title: string, description: string, status: 'completed' | 'current' | 'pending' }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${status === 'current' ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/20' : 'bg-white border-border-subtle'}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${status === 'completed' ? 'bg-green-100 text-green-600' : status === 'current' ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted'}`}>
        {status === 'completed' ? <FileCheck className="w-3.5 h-3.5" /> : number}
      </div>
      <div className="flex-1 min-w-0">
        <h5 className={`text-xs font-bold ${status === 'pending' ? 'text-text-muted' : 'text-text-main'}`}>{title}</h5>
        <p className="text-[10px] text-text-muted">{description}</p>
      </div>
    </div>
  );
}
