'use client';

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikField } from '@/components/forms/FormikField';
import {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useToggleActiveAdminMutation,
  AdminUser,
} from '@/store/api/adminApi';
import {
  Users,
  UserCheck,
  UserX,
  PlusCircle,
  Mail,
  Lock,
  Phone,
  User as UserIcon,
  Power,
  Trash2,
  AlertCircle,
  X,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Search,
  Crown,
} from 'lucide-react';

const createAdminSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Enter a valid email address').required('Email address is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  phone: Yup.string(),
});

export function AdminTeamTab() {
  const { data: admins = [], isLoading, refetch } = useGetAdminsQuery();

  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();
  const [toggleActiveAdmin, { isLoading: isToggling }] = useToggleActiveAdminMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const adminList: AdminUser[] = Array.isArray(admins)
    ? admins
    : (admins as any)?.admins && Array.isArray((admins as any).admins)
    ? (admins as any).admins
    : (admins as any)?.data && Array.isArray((admins as any).data)
    ? (admins as any).data
    : [];

  const filteredAdmins = adminList.filter(
    (a) =>
      a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeAdminsCount = adminList.filter((a) => a.isActive).length;
  const inactiveAdminsCount = adminList.filter((a) => !a.isActive).length;

  const handleToggleActive = async (admin: AdminUser) => {
    try {
      setSuccessMessage(null);
      await toggleActiveAdmin(admin.id).unwrap();
      setSuccessMessage(`Account status for ${admin.fullName || admin.email} updated.`);
      refetch();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(err?.data || 'Failed to toggle admin status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setSuccessMessage(null);
      await deleteAdmin(deleteTarget.id).unwrap();
      setSuccessMessage(`Admin account ${deleteTarget.email} deleted successfully.`);
      setDeleteTarget(null);
      refetch();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(err?.data || 'Failed to delete admin account.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span>Admin Team Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage administrative accounts, access credentials, and active permissions.</p>
        </div>
        <button
          onClick={() => {
            setModalError(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Admin</span>
        </button>
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Administrators</p>
            <h3 className="text-xl font-extrabold text-white">{adminList.length}</h3>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Accounts</p>
            <h3 className="text-xl font-extrabold text-white">{activeAdminsCount}</h3>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Disabled Accounts</p>
            <h3 className="text-xl font-extrabold text-white">{inactiveAdminsCount}</h3>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search admin team by name or email..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Admin Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span>Loading admin accounts...</span>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-300 font-medium text-sm">No admin accounts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Admin Member</th>
                  <th className="py-3.5 px-4 font-bold">Contact Email</th>
                  <th className="py-3.5 px-4 font-bold">Role</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                          {admin.role === 'SUPER_ADMIN' ? <Crown className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{admin.fullName || 'Admin User'}</p>
                          <p className="text-[10px] text-slate-500 font-mono">ID: {admin.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300 font-mono">{admin.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        admin.role === 'SUPER_ADMIN'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        admin.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${admin.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        {admin.isActive ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {admin.role !== 'SUPER_ADMIN' && (
                          <>
                            <button
                              onClick={() => handleToggleActive(admin)}
                              disabled={isToggling}
                              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                                admin.isActive
                                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400'
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                              }`}
                            >
                              <Power className="w-3.5 h-3.5" />
                              <span>{admin.isActive ? 'Disable' : 'Enable'}</span>
                            </button>
                            <button
                              onClick={() => setDeleteTarget(admin)}
                              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add New Admin */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <span>Create Admin Account</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Issue new administrative credentials for Revelation Pest Control staff.</p>
            </div>

            {modalError && (
              <div className="p-3 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <Formik
              initialValues={{ fullName: '', email: '', password: '', phone: '' }}
              validationSchema={createAdminSchema}
              onSubmit={async (values) => {
                setModalError(null);
                try {
                  await createAdmin(values).unwrap();
                  setSuccessMessage(`New Admin account (${values.email}) created successfully!`);
                  setIsModalOpen(false);
                  refetch();
                  setTimeout(() => setSuccessMessage(null), 4000);
                } catch (err: any) {
                  setModalError(err?.data || 'Failed to create admin account.');
                }
              }}
            >
              {() => (
                <Form className="space-y-4">
                  <FormikField
                    name="fullName"
                    label="Full Name"
                    placeholder="e.g. Sonam Gurung"
                    required
                    leftIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
                  />

                  <FormikField
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="admin@revelationpestcontrol.com"
                    required
                    leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  />

                  <FormikField
                    name="password"
                    label="Initial Password"
                    type="password"
                    placeholder="••••••••"
                    required
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  />

                  <FormikField
                    name="phone"
                    label="Phone Number (Optional)"
                    placeholder="+977 9800000000"
                    leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  />

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition flex items-center gap-2"
                    >
                      {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[999] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-6 space-y-5 text-center shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete Admin Account</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to permanently delete <strong className="text-amber-400">{deleteTarget.email}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
