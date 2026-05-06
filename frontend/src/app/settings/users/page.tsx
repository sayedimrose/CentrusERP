'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Search, 
  Shield, 
  Key, 
  MoreVertical,
  Mail,
  Building,
  Filter,
  LayoutList,
  RefreshCcw,
  Download,
  Upload,
  Printer,
  Trash2,
  Archive,
  Copy,
  Settings2,
  FileText,
  Pencil
} from 'lucide-react';
import { 
  CCard, 
  CButton, 
  CBadge,
  CAvatar,
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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  status: 'Active' | 'Locked' | 'Inactive';
  avatar: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  members: number;
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Sayed Abbas', email: 'sayed@centrus.sa', role: 'Super Admin', branch: 'All', status: 'Active', avatar: 'SA' },
  { id: '2', name: 'Ahmed Khan', email: 'ahmed@centrus.sa', role: 'Branch Manager', branch: 'Riyadh Main', status: 'Active', avatar: 'AK' },
  { id: '3', name: 'Sara Jones', email: 'sara@centrus.sa', role: 'Accountant', branch: 'Jeddah Coastal', status: 'Locked', avatar: 'SJ' },
];

const MOCK_ROLES: Role[] = [
  { id: '1', name: 'Super Admin', description: 'Full access to all system modules and settings.', members: 2 },
  { id: '2', name: 'Branch Manager', description: 'Manage branch specific sales, inventory and employees.', members: 5 },
  { id: '3', name: 'Accountant', description: 'Manage journal entries, vouchers and financial reports.', members: 3 },
];

export default function UsersRolesPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [showFilters, setShowFilters] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  
  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const { toasts, addToast, removeToast } = useToasts();
  const selectedCount = Object.keys(rowSelection).length;

  const handleAddSubmit = () => {
    const mode = (activeTab === 'users' ? selectedUser : selectedRole) ? 'updated' : 'created';
    addToast(`${activeTab === 'users' ? 'User' : 'Role'} ${mode} successfully!`, 'success');
    setIsUserModalOpen(false);
    setIsRoleModalOpen(false);
    setSelectedUser(null);
    setSelectedRole(null);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedCount === 0) return;
    addToast(`${selectedCount} ${activeTab} deleted successfully!`, 'error');
    setRowSelection({});
  };

  const userFilters: FilterGroup[] = [
    { id: 'role', title: 'Role', options: [{ label: 'Super Admin', count: 1 }, { label: 'Branch Manager', count: 1 }, { label: 'Accountant', count: 1 }] },
    { id: 'status', title: 'Status', options: [{ label: 'Active', count: 2 }, { label: 'Locked', count: 1 }] },
  ];

  const userColumns = useMemo<ColumnDef<User>[]>(() => [
    { 
      accessorKey: 'name', 
      header: 'User', 
      cell: info => (
        <div className="flex items-center gap-3">
          <CAvatar initials={info.row.original.avatar} size="sm" />
          <div className="flex flex-col">
            <span className="font-medium text-text-main leading-tight">{info.getValue() as string}</span>
            <span className="text-[10px] text-text-muted">{info.row.original.email}</span>
          </div>
        </div>
      ),
      size: 250 
    },
    { accessorKey: 'role', header: 'Role', cell: info => <span className="font-medium text-text-main text-xs">{info.getValue() as string}</span>, size: 150 },
    { accessorKey: 'branch', header: 'Branch', cell: info => <span className="text-text-main text-xs">{info.getValue() as string}</span>, size: 150 },
    { accessorKey: 'status', header: 'Status', cell: info => <CBadge variant={info.getValue() === 'Active' ? 'success' : info.getValue() === 'Locked' ? 'danger' : 'default'} size="sm">{info.getValue() as string}</CBadge>, size: 120 },
    { accessorKey: 'id', header: 'ID', cell: info => <span className="text-text-muted text-xs font-mono">{info.getValue() as string}</span>, size: 150 },
  ], []);

  const roleColumns = useMemo<ColumnDef<Role>[]>(() => [
    { accessorKey: 'name', header: 'Role Name', cell: info => <span className="font-medium text-text-main">{info.getValue() as string}</span>, size: 200 },
    { accessorKey: 'description', header: 'Description', cell: info => <span className="text-xs text-text-muted truncate block max-w-[300px]">{info.getValue() as string}</span>, size: 400 },
    { accessorKey: 'members', header: 'Users', cell: info => <CBadge variant="default" size="sm">{info.getValue() as number} Members</CBadge>, size: 120 },
    { accessorKey: 'id', header: 'ID', cell: info => <span className="text-text-muted text-xs font-mono">{info.getValue() as string}</span>, size: 150 },
  ], []);

  return (
    <div className="flex flex-col gap-6 h-full">
      <CToast toasts={toasts} onRemove={removeToast} />

      {/* User Modal */}
      <CDialog
        isOpen={isUserModalOpen}
        onClose={() => { setIsUserModalOpen(false); setSelectedUser(null); }}
        title={selectedUser ? "Edit User Details" : "Add New User"}
        icon={selectedUser ? <Pencil className="w-5 h-5" /> : <Users className="w-5 h-5" />}
        buttons={[
          { label: 'Cancel', onClick: () => { setIsUserModalOpen(false); setSelectedUser(null); }, variant: 'outline' },
          { label: selectedUser ? 'Update Details' : 'Create User', onClick: handleAddSubmit, variant: 'primary' },
        ]}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <CInput label="Full Name" placeholder="e.g. John Doe" defaultValue={selectedUser?.name} required />
            <CInput label="Username" placeholder="e.g. johndoe" defaultValue={selectedUser?.id} required />
          </div>
          <CInput label="Email Address" type="email" placeholder="john@example.com" defaultValue={selectedUser?.email} required icon={<Mail className="w-4 h-4" />} />
          <div className="grid grid-cols-2 gap-4">
            <CSelect label="Role" options={[{ label: 'Super Admin', value: 'admin' }]} defaultValue={selectedUser?.role.toLowerCase()} required />
            <CSelect label="Branch" options={[{ label: 'Riyadh Main', value: 'br1' }]} defaultValue={selectedUser?.branch.toLowerCase()} required />
          </div>
          {!selectedUser && <CInput label="Password" type="password" placeholder="••••••••" required icon={<Key className="w-4 h-4" />} />}
        </div>
      </CDialog>

      {/* Role Modal */}
      <CDialog
        isOpen={isRoleModalOpen}
        onClose={() => { setIsRoleModalOpen(false); setSelectedRole(null); }}
        title={selectedRole ? "Edit Role Permissions" : "Create New Role"}
        icon={selectedRole ? <Pencil className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
        buttons={[
          { label: 'Cancel', onClick: () => { setIsRoleModalOpen(false); setSelectedRole(null); }, variant: 'outline' },
          { label: selectedRole ? 'Save Changes' : 'Create Role', onClick: handleAddSubmit, variant: 'primary' },
        ]}
      >
        <div className="space-y-4">
          <CInput label="Role Name" placeholder="e.g. Senior Accountant" defaultValue={selectedRole?.name} required />
          <CTextarea label="Description" placeholder="Define the responsibilities..." defaultValue={selectedRole?.description} rows={4} />
        </div>
      </CDialog>

      {/* Action Bar */}
      <CCard padding="none" className="overflow-hidden flex flex-col min-h-[650px] shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-white">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <CIconBadge
                icon={activeTab === 'users' ? <Users className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                colorClass="bg-gray-100 text-text-muted"
                shape="circle"
                size="lg"
              />
              <CPageTitle>
                {activeTab === 'users' ? 'Users' : 'Roles'}
              </CPageTitle>
            </div>

            {/* Sub-Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => { setActiveTab('users'); setRowSelection({}); }}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
              >
                Users
              </button>
              <button 
                onClick={() => { setActiveTab('roles'); setRowSelection({}); }}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'roles' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
              >
                Roles
              </button>
            </div>
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
                  { label: 'Delete Selected', icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: handleBulkDelete },
                ]},
              ]}
            />

            <CButton
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => activeTab === 'users' ? setIsUserModalOpen(true) : setIsRoleModalOpen(true)}
              className="ml-2"
            >
              Add {activeTab === 'users' ? 'User' : 'Role'}
            </CButton>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden p-4 bg-white gap-0">
          {showFilters && <CFilterSidebar groups={activeTab === 'users' ? userFilters : []} />}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'users' ? (
              <CDataTable 
                data={MOCK_USERS} 
                columns={userColumns} 
                rowSelection={rowSelection} 
                onRowSelectionChange={setRowSelection} 
                onRowClick={(row) => handleEditUser(row as User)}
              />
            ) : (
              <CDataTable 
                data={MOCK_ROLES} 
                columns={roleColumns} 
                rowSelection={rowSelection} 
                onRowSelectionChange={setRowSelection} 
                onRowClick={(row) => handleEditRole(row as Role)}
              />
            )}
          </div>
        </div>
      </CCard>
    </div>
  );
}
