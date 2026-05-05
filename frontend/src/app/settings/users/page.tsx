'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Search, 
  Shield, 
  Key, 
  MoreHorizontal,
  Mail,
  Building,
  Check,
  X
} from 'lucide-react';
import { 
  CCard, 
  CButton, 
  CInput, 
  CSectionHeader, 
  CBadge,
  CAvatar
} from '@/components/centrus';

const mockUsers = [
  { id: 1, name: 'Sayed Abbas', email: 'sayed@centrus.sa', role: 'Super Admin', branch: 'All', status: 'Active', avatar: 'SA' },
  { id: 2, name: 'Ahmed Khan', email: 'ahmed@centrus.sa', role: 'Branch Manager', branch: 'Riyadh Main', status: 'Active', avatar: 'AK' },
  { id: 3, name: 'Sara Jones', email: 'sara@centrus.sa', role: 'Accountant', branch: 'Jeddah Coastal', status: 'Locked', avatar: 'SJ' },
];

const mockRoles = [
  { id: 1, name: 'Super Admin', description: 'Full access to all system modules and settings.', members: 2 },
  { id: 2, name: 'Branch Manager', description: 'Manage branch specific sales, inventory and employees.', members: 5 },
  { id: 3, name: 'Accountant', description: 'Manage journal entries, vouchers and financial reports.', members: 3 },
  { id: 4, name: 'Cashier', description: 'Restrict access to POS registers and daily reports.', members: 12 },
];

export default function UsersRolesPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <CSectionHeader 
          title="Users & Access Control" 
          subtitle="Manage system users, define roles, and configure granular permissions"
        />
        <CButton icon={Plus}>
          {activeTab === 'users' ? 'Invite New User' : 'Create New Role'}
        </CButton>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:bg-gray-200'}`}
        >
          <Users className="w-4 h-4" />
          Users
        </button>
        <button 
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'roles' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:bg-gray-200'}`}
        >
          <ShieldCheck className="w-4 h-4" />
          Roles & Permissions
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="space-y-4">
          <CCard className="!p-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <CInput placeholder="Search users by name or email..." className="pl-10 !mb-0" />
            </div>
          </CCard>

          <CCard noPadding>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-subtle bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Branch Access</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {mockUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <CAvatar label={user.avatar} size="sm" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-text-main">{user.name}</span>
                          <span className="text-xs text-text-muted">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <CBadge variant="neutral">{user.role}</CBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-text-muted">
                        <Building className="w-3.5 h-3.5" />
                        {user.branch}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <CBadge variant={user.status === 'Active' ? 'success' : 'danger'}>
                        {user.status}
                      </CBadge>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-text-muted" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CCard>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockRoles.map((role) => (
            <CCard key={role.id} title={role.name} icon={Shield}>
              <p className="text-sm text-text-muted mb-4 leading-relaxed">
                {role.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                  <Users className="w-4 h-4 text-primary" />
                  {role.members} Users Assigned
                </div>
                <CButton variant="outline" size="sm" icon={Key}>
                  Edit Permissions
                </CButton>
              </div>
            </CCard>
          ))}
          
          <div className="border-2 border-dashed border-border-subtle rounded-2xl flex flex-col items-center justify-center p-8 gap-3 group hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
            <div className="p-3 bg-gray-100 rounded-full group-hover:bg-primary-light group-hover:text-primary transition-colors">
              <Shield className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-text-main group-hover:text-primary transition-colors">Create Custom Role</h3>
              <p className="text-xs text-text-muted">Define unique permission sets for specific staff</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
