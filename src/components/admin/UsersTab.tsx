'use client';

import React, { useState } from 'react';
import { useGetUsersQuery, useToggleUserActiveMutation, AdminUser } from '@/store/api/adminApi';
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Power,
  Loader2,
  CheckCircle2,
  User as UserIcon,
  Shield,
  Crown,
  Mail,
  Phone,
} from 'lucide-react';

export function UsersTab() {
  const { data: users = [], isLoading, refetch } = useGetUsersQuery();
  const [toggleUserActive, { isLoading: isToggling }] = useToggleUserActiveMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const userList: AdminUser[] = Array.isArray(users)
    ? users
    : (users as any)?.users && Array.isArray((users as any).users)
    ? (users as any).users
    : (users as any)?.data && Array.isArray((users as any).data)
    ? (users as any).data
    : [];

  const filteredUsers = userList.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery)
  );

  const activeCount = userList.filter((u) => u.isActive).length;
  const verifiedCount = userList.filter((u) => u.isVerified).length;

  const handleToggle = async (user: AdminUser) => {
    try {
      setSuccessMessage(null);
      await toggleUserActive(user.id).unwrap();
      setSuccessMessage(`Account status for ${user.fullName || user.email} updated.`);
      refetch();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert('Failed to update account status.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Registered Customers & Users</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage customer accounts, active permissions, and registered user profiles.</p>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Registered Users</p>
            <h3 className="text-xl font-extrabold text-white">{userList.length}</h3>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Verified Accounts</p>
            <h3 className="text-xl font-extrabold text-white">{verifiedCount}</h3>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Accounts</p>
            <h3 className="text-xl font-extrabold text-white">{activeCount}</h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search registered accounts by name, email, or phone..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* User Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span>Loading user directory...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-300 font-medium text-sm">No registered user accounts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">User / Customer</th>
                  <th className="py-3.5 px-4 font-bold">Contact Email & Phone</th>
                  <th className="py-3.5 px-4 font-bold">Account Role</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
                          {u.role === 'SUPER_ADMIN' ? (
                            <Crown className="w-4 h-4 text-amber-400" />
                          ) : u.role === 'ADMIN' ? (
                            <Shield className="w-4 h-4 text-blue-400" />
                          ) : (
                            <UserIcon className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{u.fullName || 'Registered User'}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 space-y-1">
                      <p className="text-slate-300 font-mono flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>{u.email}</span>
                      </p>
                      {u.phone && (
                        <p className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{u.phone}</span>
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : u.role === 'ADMIN'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        {u.isActive ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleToggle(u)}
                        disabled={isToggling}
                        className={`p-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1 transition ${
                          u.isActive
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{u.isActive ? 'Disable' : 'Enable'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
