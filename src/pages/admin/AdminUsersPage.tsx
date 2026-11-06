import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { User, UserRole } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [deleteTargetUser, setDeleteTargetUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await adminService.updateUserStatus(user._id || user.id || '', !user.isActive);
      loadUsers();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleApproveExpert = async (user: User) => {
    try {
      await adminService.approveExpert(user._id || user.id || '');
      loadUsers();
    } catch (err) {
      console.error('Failed to approve expert', err);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTargetUser) return;
    try {
      await adminService.deleteUser(deleteTargetUser._id || deleteTargetUser.id || '');
      setDeleteTargetUser(null);
      loadUsers();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        (u.state && u.state.toLowerCase().includes(s)) ||
        (u.district && u.district.toLowerCase().includes(s))
      );
    }
    return true;
  });

  const columns: Column<User>[] = [
    {
      header: 'User Identity',
      accessorKey: 'name',
      sortable: true,
      cell: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs">
            {u.name.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-slate-900 block">{u.name}</span>
            <span className="text-[11px] text-slate-500">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Role & Status',
      accessorKey: 'role',
      cell: (u) => (
        <div className="space-y-1">
          <Badge
            variant={
              u.role === 'admin'
                ? 'danger'
                : u.role === 'expert'
                ? 'info'
                : 'success'
            }
          >
            {u.role.toUpperCase()}
          </Badge>
          {u.role === 'expert' && (
            <div className="text-[10px]">
              {u.isApproved ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Approved
                </span>
              ) : (
                <span className="text-amber-700 font-semibold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Pending Review
                </span>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Location',
      cell: (u) => (
        <span className="text-xs text-slate-600">
          {u.district ? `${u.district}, ${u.state}` : u.state || 'India'}
        </span>
      ),
    },
    {
      header: 'Account Status',
      cell: (u) => (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
            u.isActive ? 'text-emerald-700' : 'text-slate-400'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-600' : 'bg-slate-400'}`}
          />
          {u.isActive ? 'Active' : 'Suspended'}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      cell: (u) => (
        <div className="flex items-center justify-end gap-2">
          {u.role === 'expert' && !u.isApproved && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs text-emerald-700 hover:bg-emerald-50 py-1"
              onClick={() => handleApproveExpert(u)}
              leftIcon={<UserCheck className="w-3.5 h-3.5" />}
            >
              Approve Specialist
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            className="text-xs py-1"
            onClick={() => handleToggleStatus(u)}
          >
            {u.isActive ? 'Deactivate' : 'Activate'}
          </Button>

          {u.role !== 'admin' && (
            <button
              onClick={() => setDeleteTargetUser(u)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete user"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Governance & Approvals"
        description="Oversee registered farmers, verify academic agronomists, and manage account statuses."
        breadcrumbs={[
          { label: 'Admin Portal', href: '/admin' },
          { label: 'Manage Users' },
        ]}
      />

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full text-xs rounded-lg border border-slate-300 py-2 pl-8 pr-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 py-1.5 px-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="All">All Roles</option>
              <option value="farmer">Farmers</option>
              <option value="expert">Agricultural Experts</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Total Users: <strong className="text-slate-900">{filteredUsers.length}</strong>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        keyExtractor={(u) => u._id || u.id || ''}
        isLoading={isLoading}
        emptyMessage="No users found matching the search criteria."
      />

      {/* Delete User Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetUser}
        onClose={() => setDeleteTargetUser(null)}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete user "${deleteTargetUser?.name}" (${deleteTargetUser?.email})? All associated records will be removed.`}
        confirmText="Delete Account"
      />
    </div>
  );
};
