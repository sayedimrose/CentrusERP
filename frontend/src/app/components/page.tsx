'use client';

import React, { useState } from 'react';
import {
  CButton, CCard, CInput, CSelect, CTextarea, CAvatar, CBadge,
  CIconBadge, CKpiCard, CProgressBar, CDropdownMenu, CDialog,
  CSectionHeader, CStatCard, CActivityItem, CBarChart,
} from '@/components/centrus';
import {
  ClipboardList, CheckCircle2, Activity, AlertCircle, TrendingUp,
  BarChart2, Users, Search, Upload, Download, FileText, Printer,
  Copy, Archive, Settings2, Trash2, LayoutList, Plus, Mail,
} from 'lucide-react';

// ─── Section wrapper for showcase ─────────────────────────────────
function ShowcaseSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-text-main border-b border-border-subtle pb-2">{title}</h2>
      {children}
    </div>
  );
}

function ShowcaseRow({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</p>}
      <div className="flex flex-wrap items-center gap-3">
        {children}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────
export default function ComponentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex flex-col gap-8 pb-8">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main">Centrus UI Components</h1>
        <p className="text-sm text-text-muted mt-1">
          Reusable, themed components with sensible defaults. Override any prop to customize.
        </p>
      </div>

      {/* ─── CButton ─────────────────────────────────── */}
      <ShowcaseSection title="CButton">
        <ShowcaseRow label="Variants">
          <CButton variant="primary">Primary</CButton>
          <CButton variant="outline">Outline</CButton>
          <CButton variant="ghost">Ghost</CButton>
          <CButton variant="danger">Danger</CButton>
        </ShowcaseRow>
        <ShowcaseRow label="Sizes">
          <CButton size="xs">Extra Small</CButton>
          <CButton size="sm">Small</CButton>
          <CButton size="md">Medium</CButton>
          <CButton size="lg">Large</CButton>
        </ShowcaseRow>
        <ShowcaseRow label="With Icons">
          <CButton icon={<Plus className="w-4 h-4" />}>Add Task</CButton>
          <CButton variant="outline" icon={<Download className="w-4 h-4" />}>Export</CButton>
          <CButton variant="danger" icon={<Trash2 className="w-4 h-4" />} size="sm">Delete</CButton>
        </ShowcaseRow>
        <ShowcaseRow label="Icon Only">
          <CButton variant="outline" icon={<Search className="w-4 h-4" />} iconOnly />
          <CButton variant="ghost" icon={<Settings2 className="w-4 h-4" />} iconOnly />
          <CButton variant="primary" icon={<Plus className="w-4 h-4" />} iconOnly />
        </ShowcaseRow>
        <ShowcaseRow label="States">
          <CButton disabled>Disabled</CButton>
          <CButton loading>Loading</CButton>
          <CButton fullWidth variant="primary">Full Width</CButton>
        </ShowcaseRow>
      </ShowcaseSection>

      {/* ─── CCard ─────────────────────────────────── */}
      <ShowcaseSection title="CCard">
        <div className="grid grid-cols-3 gap-4">
          <CCard padding="sm"><p className="text-sm">Small Padding</p></CCard>
          <CCard padding="md"><p className="text-sm">Medium Padding (default)</p></CCard>
          <CCard padding="lg"><p className="text-sm">Large Padding</p></CCard>
        </div>
      </ShowcaseSection>

      {/* ─── CInput ────────────────────────────────── */}
      <ShowcaseSection title="CInput">
        <div className="grid grid-cols-3 gap-4">
          <CInput label="Default Input" placeholder="Type something..." />
          <CInput label="With Icon" placeholder="Search..." leadingIcon={<Search className="w-4 h-4" />} />
          <CInput label="Required Field" placeholder="Email" required />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <CInput label="With Error" placeholder="Email" error="Invalid email address" value="bad@" onChange={() => {}} />
          <CInput label="With Helper" placeholder="Username" helperText="Must be unique" />
          <CInput label="Small Size" placeholder="Small input" inputSize="sm" />
        </div>
      </ShowcaseSection>

      {/* ─── CSelect ───────────────────────────────── */}
      <ShowcaseSection title="CSelect">
        <div className="grid grid-cols-3 gap-4">
          <CSelect
            label="Priority"
            options={[
              { label: 'High', value: 'high' },
              { label: 'Medium', value: 'medium' },
              { label: 'Low', value: 'low' },
            ]}
          />
          <CSelect
            label="Status"
            required
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
          <CSelect
            label="With Error"
            error="Selection required"
            options={[
              { label: 'Option A', value: 'a' },
              { label: 'Option B', value: 'b' },
            ]}
          />
        </div>
      </ShowcaseSection>

      {/* ─── CTextarea ─────────────────────────────── */}
      <ShowcaseSection title="CTextarea">
        <div className="grid grid-cols-2 gap-4">
          <CTextarea label="Description" placeholder="Enter a description..." />
          <CTextarea label="Notes" placeholder="Notes here..." required error="This field is required" />
        </div>
      </ShowcaseSection>

      {/* ─── CAvatar ───────────────────────────────── */}
      <ShowcaseSection title="CAvatar">
        <ShowcaseRow label="Sizes">
          <CAvatar initials="SA" colorClass="bg-primary/10 text-primary" size="xs" />
          <CAvatar initials="SA" colorClass="bg-primary/10 text-primary" size="sm" />
          <CAvatar initials="SA" colorClass="bg-primary/10 text-primary" size="md" />
          <CAvatar initials="SA" colorClass="bg-primary/10 text-primary" size="lg" />
        </ShowcaseRow>
        <ShowcaseRow label="Colors">
          <CAvatar initials="SA" colorClass="bg-primary/10 text-primary" />
          <CAvatar initials="AA" colorClass="bg-green-100 text-green-700" />
          <CAvatar initials="FK" colorClass="bg-orange-100 text-orange-700" />
          <CAvatar initials="?" colorClass="bg-gray-100 text-gray-500" />
        </ShowcaseRow>
      </ShowcaseSection>

      {/* ─── CBadge ────────────────────────────────── */}
      <ShowcaseSection title="CBadge">
        <ShowcaseRow label="Variants">
          <CBadge variant="default">Default</CBadge>
          <CBadge variant="success">Completed</CBadge>
          <CBadge variant="warning">Working</CBadge>
          <CBadge variant="danger">Overdue</CBadge>
          <CBadge variant="info">Info</CBadge>
          <CBadge variant="primary">Primary</CBadge>
        </ShowcaseRow>
        <ShowcaseRow label="With Dot">
          <CBadge variant="success" dot>Active</CBadge>
          <CBadge variant="danger" dot>Critical</CBadge>
          <CBadge variant="warning" dot>Pending</CBadge>
        </ShowcaseRow>
      </ShowcaseSection>

      {/* ─── CIconBadge ────────────────────────────── */}
      <ShowcaseSection title="CIconBadge">
        <ShowcaseRow label="Sizes & Shapes">
          <CIconBadge icon={<ClipboardList className="w-4 h-4" />} colorClass="bg-primary-light text-primary" size="sm" />
          <CIconBadge icon={<CheckCircle2 className="w-4 h-4" />} colorClass="bg-green-100 text-green-600" size="md" />
          <CIconBadge icon={<AlertCircle className="w-4 h-4" />} colorClass="bg-red-100 text-red-500" size="lg" />
          <CIconBadge icon={<Activity className="w-4 h-4" />} colorClass="bg-orange-100 text-orange-500" shape="circle" />
        </ShowcaseRow>
      </ShowcaseSection>

      {/* ─── CKpiCard ──────────────────────────────── */}
      <ShowcaseSection title="CKpiCard">
        <div className="grid grid-cols-5 gap-4">
          <CKpiCard
            label="Total Tasks" value="19" sub="Across all projects"
            icon={<ClipboardList className="w-4 h-4" />}
          />
          <CKpiCard
            label="Completed" value="4" sub="21% completion rate"
            valueColor="text-green-600" iconBg="bg-green-100" iconColor="text-green-600"
            icon={<CheckCircle2 className="w-4 h-4" />}
          />
          <CKpiCard
            label="In Progress" value="2" sub="Active right now"
            valueColor="text-orange-500" iconBg="bg-orange-100" iconColor="text-orange-500"
            icon={<Activity className="w-4 h-4" />}
          />
          <CKpiCard
            label="Overdue" value="5" sub="Require attention"
            valueColor="text-red-500" iconBg="bg-red-100" iconColor="text-red-500"
            icon={<AlertCircle className="w-4 h-4" />}
          />
          <CKpiCard
            label="Completion Rate" value="44%" sub="This month"
            valueColor="text-primary" iconBg="bg-primary-light" iconColor="text-primary"
            icon={<TrendingUp className="w-4 h-4" />}
          />
        </div>
      </ShowcaseSection>

      {/* ─── CProgressBar ──────────────────────────── */}
      <ShowcaseSection title="CProgressBar">
        <CCard>
          <div className="flex flex-col gap-4">
            <CProgressBar value={44} label="Plant Setup" annotation="44% · 9 tasks" />
            <CProgressBar value={78} color="bg-green-500" label="Finance Audit" annotation="78% · 14 tasks" />
            <CProgressBar value={30} color="bg-orange-400" label="HR Onboarding" annotation="30% · 6 tasks" />
            <CProgressBar value={62} color="bg-violet-400" label="Procurement Q2" annotation="62% · 11 tasks" />
          </div>
        </CCard>
      </ShowcaseSection>

      {/* ─── CDropdownMenu ─────────────────────────── */}
      <ShowcaseSection title="CDropdownMenu">
        <ShowcaseRow>
          <CDropdownMenu
            label="List View"
            icon={<LayoutList className="w-4 h-4" />}
            groups={[{
              items: [
                { label: 'List View', icon: <LayoutList className="w-4 h-4" />, active: true },
                { label: 'Report', icon: <FileText className="w-4 h-4" /> },
                { label: 'Dashboard', icon: <BarChart2 className="w-4 h-4" /> },
              ],
            }]}
          />
          <CDropdownMenu
            label="Options"
            align="left"
            width="w-52"
            groups={[
              { items: [
                { label: 'Import Records', icon: <Upload className="w-4 h-4" /> },
                { label: 'Export to Excel', icon: <Download className="w-4 h-4" /> },
              ]},
              { items: [
                { label: 'Print List', icon: <Printer className="w-4 h-4" /> },
                { label: 'Duplicate', icon: <Copy className="w-4 h-4" /> },
              ]},
              { items: [
                { label: 'Delete Selected', icon: <Trash2 className="w-4 h-4" />, danger: true },
              ]},
            ]}
          />
        </ShowcaseRow>
      </ShowcaseSection>

      {/* ─── CSectionHeader ────────────────────────── */}
      <ShowcaseSection title="CSectionHeader">
        <CCard>
          <CSectionHeader title="Task Analytics" subtitle="Status breakdown this month" icon={<BarChart2 className="w-4 h-4" />} />
        </CCard>
        <CCard>
          <CSectionHeader
            title="Project Progress"
            subtitle="Active projects completion"
            action={<CButton variant="outline" size="xs">View All</CButton>}
          />
        </CCard>
      </ShowcaseSection>

      {/* ─── CStatCard ─────────────────────────────── */}
      <ShowcaseSection title="CStatCard">
        <CCard>
          <div className="flex flex-col gap-3">
            <CStatCard label="Tasks Created" value={3} icon={<ClipboardList className="w-4 h-4" />} iconBg="bg-primary-light" color="text-primary" />
            <CStatCard label="Tasks Closed" value={2} icon={<CheckCircle2 className="w-4 h-4" />} iconBg="bg-green-100" color="text-green-600" />
            <CStatCard label="Comments Added" value={8} icon={<Activity className="w-4 h-4" />} iconBg="bg-orange-100" color="text-orange-500" />
            <CStatCard label="Overdue Alerts" value={5} icon={<AlertCircle className="w-4 h-4" />} iconBg="bg-red-100" color="text-red-500" />
          </div>
        </CCard>
      </ShowcaseSection>

      {/* ─── CActivityItem ─────────────────────────── */}
      <ShowcaseSection title="CActivityItem">
        <CCard>
          <div className="flex flex-col divide-y divide-border-subtle">
            <CActivityItem userInitials="SA" userName="Sayed" action="marked" target="Finalise plant venue" time="2m ago" avatarColor="bg-primary/10 text-primary" dotColor="bg-green-500" />
            <CActivityItem userInitials="AA" userName="Ahmed" action="created" target="Procurement Q2 review" time="18m ago" avatarColor="bg-green-100 text-green-700" dotColor="bg-orange-400" />
            <CActivityItem userInitials="FK" userName="Fatima" action="commented on" target="Purchase assets" time="1h ago" avatarColor="bg-orange-100 text-orange-700" dotColor="bg-red-500" />
          </div>
        </CCard>
      </ShowcaseSection>

      {/* ─── CBarChart ─────────────────────────────── */}
      <ShowcaseSection title="CBarChart">
        <CCard>
          <CSectionHeader title="Monthly Task Analytics" subtitle="Completed vs Overdue" icon={<BarChart2 className="w-4 h-4" />} className="mb-4" />
          <CBarChart
            data={[
              { label: 'Jan', segments: [{ value: 20, color: 'rgba(248,113,113,0.7)' }, { value: 60, color: '#673ee6' }] },
              { label: 'Feb', segments: [{ value: 15, color: 'rgba(248,113,113,0.7)' }, { value: 75, color: '#673ee6' }] },
              { label: 'Mar', segments: [{ value: 35, color: 'rgba(248,113,113,0.7)' }, { value: 50, color: '#673ee6' }] },
              { label: 'Apr', segments: [{ value: 10, color: 'rgba(248,113,113,0.7)' }, { value: 85, color: '#673ee6' }] },
              { label: 'May', segments: [{ value: 26, color: 'rgba(248,113,113,0.7)' }, { value: 44, color: '#673ee6' }] },
            ]}
            legend={[
              { label: 'Completed', color: '#673ee6' },
              { label: 'Overdue', color: 'rgba(248,113,113,0.7)' },
            ]}
          />
        </CCard>
      </ShowcaseSection>

      {/* ─── CDialog ──────────────────────────────── */}
      <ShowcaseSection title="CDialog">
        <CButton onClick={() => setDialogOpen(true)} icon={<Mail className="w-4 h-4" />}>
          Open Dialog
        </CButton>
        <CDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Confirm Action"
          icon={<CheckCircle2 className="w-5 h-5" />}
          buttons={[
            { label: 'Cancel', onClick: () => setDialogOpen(false), variant: 'outline' },
            { label: 'Confirm', onClick: () => setDialogOpen(false), variant: 'primary' },
          ]}
        >
          <div className="flex flex-col items-center text-center py-4 gap-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-text-main font-medium">Are you sure you want to proceed?</p>
            <p className="text-sm text-text-muted max-w-xs">
              This action will apply to the selected items. You can always undo later.
            </p>
          </div>
        </CDialog>
      </ShowcaseSection>

    </div>
  );
}
