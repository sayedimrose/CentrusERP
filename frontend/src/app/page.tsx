'use client';

import React, { useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import FilterSidebar from '@/components/ui/FilterSidebar';
import {
  CButton, CCard, CKpiCard, CDropdownMenu, CDialog,
  CSectionHeader, CStatCard, CActivityItem, CBarChart,
  CProgressBar, CAvatar, CIconBadge, CPageTitle
} from '@/components/centrus';
import {
  LayoutList, FileText, LayoutDashboard, Calendar, RefreshCcw,
  Plus, Filter, Upload, Download, Trash2, Printer, Copy,
  Archive, Settings2, BarChart2, CheckCircle2,
  ClipboardList, Activity, AlertCircle, TrendingUp, Users,
} from 'lucide-react';

// ─── AddTaskModal (still using the existing one for now) ──────────
import AddTaskModal from '@/components/ui/AddTaskModal';

export default function Home() {
  const [showFilters, setShowFilters] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="flex flex-col gap-4">

      {/* KPI Dashboard Tiles */}
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

      {/* Task Table Container */}
      <CCard padding="none" className="flex flex-col overflow-hidden" style={{ minHeight: '520px' }}>
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-white">
          <div className="flex items-center gap-4">
            <CIconBadge
              icon={<LayoutList className="w-4 h-4" />}
              colorClass="bg-gray-100 text-text-muted"
              shape="circle"
              size="lg"
            />
            <CPageTitle>Task</CPageTitle>
          </div>

          <div className="flex items-center gap-2">
            <CDropdownMenu
              label="List View"
              icon={<LayoutList className="w-4 h-4" />}
              groups={[{
                items: [
                  { label: 'List View', icon: <LayoutList className="w-4 h-4" />, active: true },
                  { label: 'Report', icon: <FileText className="w-4 h-4" /> },
                  { label: 'Dashboard', icon: <BarChart2 className="w-4 h-4" /> },
                  { label: 'Gantt', icon: <LayoutDashboard className="w-4 h-4" /> },
                  { label: 'Kanban', icon: <div className="w-4 h-4 border-2 border-current rounded-sm opacity-70" /> },
                  { label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
                ],
              }]}
            />

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
                  { label: 'Import Records', icon: <Upload className="w-4 h-4" /> },
                  { label: 'Export to Excel', icon: <Download className="w-4 h-4" /> },
                  { label: 'Export to PDF', icon: <FileText className="w-4 h-4" /> },
                ]},
                { items: [
                  { label: 'Print List', icon: <Printer className="w-4 h-4" /> },
                  { label: 'Duplicate', icon: <Copy className="w-4 h-4" /> },
                  { label: 'Archive Selected', icon: <Archive className="w-4 h-4" /> },
                ]},
                { items: [
                  { label: 'Column Settings', icon: <Settings2 className="w-4 h-4" /> },
                ]},
                { items: [
                  { label: 'Delete Selected', icon: <Trash2 className="w-4 h-4" />, danger: true },
                ]},
              ]}
            />

            <CButton
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddTask(true)}
              className="ml-2"
            >
              Add Task
            </CButton>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="flex flex-1 overflow-hidden p-4 bg-white gap-0">
          {showFilters && <FilterSidebar />}
          <div className="flex-1 overflow-y-auto">
            <DataTable />
          </div>
        </div>
      </CCard>

      {/* ── Dashboard Widgets Row ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* 1. Task Analytics Chart */}
        <CCard>
          <CSectionHeader title="Task Analytics" subtitle="Status breakdown this month" icon={<BarChart2 className="w-4 h-4" />} className="mb-4" />
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

        {/* 2. Project Progress */}
        <CCard>
          <CSectionHeader title="Project Progress" subtitle="Active projects completion" icon={<TrendingUp className="w-4 h-4" />} className="mb-4" />
          <div className="flex flex-col gap-4">
            <CProgressBar value={44} label="Plant Setup" annotation="44% · 9 tasks" />
            <CProgressBar value={78} color="bg-green-500" label="Finance Audit" annotation="78% · 14 tasks" />
            <CProgressBar value={30} color="bg-orange-400" label="HR Onboarding" annotation="30% · 6 tasks" />
            <CProgressBar value={62} color="bg-violet-400" label="Procurement Q2" annotation="62% · 11 tasks" />
          </div>
        </CCard>

        {/* 3. Team Members */}
        <CCard>
          <CSectionHeader title="Team Members" subtitle="Workload overview" icon={<Users className="w-4 h-4" />} className="mb-4" />
          <div className="flex flex-col gap-3">
            {[
              { name: 'Sayed Abbas',     role: 'Admin',   tasks: 5, done: 3, avatar: 'SA', color: 'bg-primary/10 text-primary' },
              { name: 'Ahmed Al-Rashidi', role: 'Manager', tasks: 3, done: 2, avatar: 'AA', color: 'bg-green-100 text-green-700' },
              { name: 'Fatima Khalid',   role: 'Analyst', tasks: 2, done: 1, avatar: 'FK', color: 'bg-orange-100 text-orange-700' },
              { name: 'Unassigned',      role: '—',       tasks: 4, done: 0, avatar: '?',  color: 'bg-gray-100 text-gray-500' },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <CAvatar initials={m.avatar} colorClass={m.color} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main truncate">{m.name}</p>
                  <p className="text-xs text-text-muted">{m.role}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-text-main">{m.tasks}</p>
                  <p className="text-[10px] text-text-muted">{m.done} done</p>
                </div>
              </div>
            ))}
          </div>
        </CCard>
      </div>

      {/* ── Second Row: Activity Feed + Quick Stats ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* 4. Recent Activity */}
        <CCard colSpan={2}>
          <CSectionHeader title="Recent Activity" subtitle="Latest updates across all projects" icon={<Activity className="w-4 h-4" />} className="mb-4" />
          <div className="flex flex-col divide-y divide-border-subtle">
            <CActivityItem userInitials="SA" userName="Sayed" action="marked" target="Finalise plant venue" time="2m ago" avatarColor="bg-primary/10 text-primary" dotColor="bg-green-500" />
            <CActivityItem userInitials="AA" userName="Ahmed" action="created" target="Procurement Q2 review" time="18m ago" avatarColor="bg-green-100 text-green-700" dotColor="bg-orange-400" />
            <CActivityItem userInitials="FK" userName="Fatima" action="commented on" target="Purchase assets" time="1h ago" avatarColor="bg-orange-100 text-orange-700" dotColor="bg-red-500" />
            <CActivityItem userInitials="SA" userName="Sayed" action="assigned" target="Map budget" time="3h ago" avatarColor="bg-primary/10 text-primary" dotColor="bg-green-500" />
            <CActivityItem userInitials="AA" userName="Ahmed" action="updated" target="Purchase machinery" time="5h ago" avatarColor="bg-green-100 text-green-700" dotColor="bg-red-500" />
          </div>
        </CCard>

        {/* 5. Quick Stats */}
        <CCard>
          <CSectionHeader title="Quick Stats" subtitle="This week's snapshot" className="mb-4" />
          <div className="flex flex-col gap-3">
            <CStatCard label="Tasks Created" value={3} icon={<ClipboardList className="w-4 h-4" />} iconBg="bg-primary-light" color="text-primary" />
            <CStatCard label="Tasks Closed" value={2} icon={<CheckCircle2 className="w-4 h-4" />} iconBg="bg-green-100" color="text-green-600" />
            <CStatCard label="Comments Added" value={8} icon={<Activity className="w-4 h-4" />} iconBg="bg-orange-100" color="text-orange-500" />
            <CStatCard label="Overdue Alerts" value={5} icon={<AlertCircle className="w-4 h-4" />} iconBg="bg-red-100" color="text-red-500" />
          </div>
        </CCard>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onSuccess={() => { setShowAddTask(false); setShowSuccess(true); }}
      />

      {/* Success Dialog */}
      <CDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Task Created Successfully"
        icon={<CheckCircle2 className="w-5 h-5" />}
        buttons={[
          { label: 'Done', onClick: () => setShowSuccess(false), variant: 'primary' },
        ]}
      >
        <div className="flex flex-col items-center text-center py-4 gap-3">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-text-main font-medium">Your task has been created!</p>
          <p className="text-sm text-text-muted max-w-xs">
            The task has been added to the project and assigned successfully. You can find it in the list view.
          </p>
        </div>
      </CDialog>

    </div>
  );
}
