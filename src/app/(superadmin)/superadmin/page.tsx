'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { SuperAdminHeader } from '@/components/layout/SuperAdminHeader';
import { FormikField } from '@/components/forms/FormikField';
import { useAppSelector, useAppDispatch } from '@/store';
import { useGetMeQuery } from '@/store/api/authApi';
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
  ShieldAlert,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const createAdminSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Enter a valid email address').required('Email address is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  phone: Yup.string(),
});

export default function SuperAdminPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: meUser, isLoading: isCheckingAuth } = useGetMeQuery(undefined);

  const activeUser = user || meUser;
  const isSuperAdmin = activeUser?.role === 'SUPER_ADMIN';

  const { data: admins = [], isLoading, isError, refetch } = useGetAdminsQuery(undefined, {
    skip: !isSuperAdmin,
  });

  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();
  const [toggleActiveAdmin, { isLoading: isToggling }] = useToggleActiveAdminMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (isCheckingAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Verifying session permissions...</p>
        </div>
      </div>
    );
  }

  // Guarding
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center max-w-md space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-sm text-slate-400">
            You must be logged in as a SuperAdmin to access this management dashboard.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const adminList: AdminUser[] = Array.isArray(admins)
    ? admins
    : (admins as any)?.data && Array.isArray((admins as any).data)
    ? (admins as any).data
    : [];

  const activeAdminsCount = adminList.filter((a) => a.isActive).length;
  const inactiveAdminsCount = adminList.filter((a) => !a.isActive).length;

  const handleToggleActive = async (admin: AdminUser) => {
    try {
      setSuccessMessage(null);
      await toggleActiveAdmin(admin.id).unwrap();
      setSuccessMessage(`Account status for ${admin.fullName || admin.email} updated.`);
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
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(err?.data || 'Failed to delete admin account.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <SuperAdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Admin Management</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Create, configure, and manage administrator access for Revelation Pest Control.
            </p>
          </div>

          <button
            onClick={() => {
              setModalError(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/10 transition duration-200"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New Admin</span>
          </button>
        </div>

        {/* Global Feedback Banner */}
        {successMessage && (
          <div className="bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 p-4 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Admin Accounts</p>
              <p className="text-2xl font-extrabold text-white mt-0.5">{admins.length}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Admins</p>
              <p className="text-2xl font-extrabold text-white mt-0.5">{activeAdminsCount}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inactive / Disabled</p>
              <p className="text-2xl font-extrabold text-white mt-0.5">{inactiveAdminsCount}</p>
            </div>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              <span>Administrator Accounts</span>
            </h2>
            <button
              onClick={() => refetch()}
              className="text-xs text-slate-400 hover:text-amber-400 transition underline font-medium"
            >
              Refresh List
            </button>
          </div>

          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
              <p className="text-sm text-slate-400">Loading administrator accounts...</p>
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-red-400 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto" />
              <p className="text-sm font-semibold">Failed to load administrators.</p>
            </div>
          ) : adminList.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <UserX className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-base font-semibold text-slate-300">No Admin accounts found</p>
              <p className="text-xs text-slate-500">
                Click &quot;Create New Admin&quot; above to add your first administrator.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Admin User</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {adminList.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">
                            {admin.fullName ? admin.fullName.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{admin.fullName || 'Admin User'}</p>
                            <p className="text-xs text-slate-400">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        {admin.phone || '—'}
                      </td>
                      <td className="px-6 py-4">
                        {admin.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(admin.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(admin)}
                            disabled={isToggling}
                            title={admin.isActive ? 'Disable Admin' : 'Activate Admin'}
                            className={`p-2 rounded-xl border transition ${
                              admin.isActive
                                ? 'bg-amber-950/40 text-amber-400 border-amber-800/60 hover:bg-amber-900/60'
                                : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60 hover:bg-emerald-900/60'
                            }`}
                          >
                            <Power className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(admin)}
                            disabled={isDeleting}
                            title="Delete Admin Account"
                            className="p-2 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-800/60 hover:bg-rose-900/60 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create Admin Formik Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2.5">
                <PlusCircle className="w-6 h-6 text-amber-500" />
                <span>Create Admin Account</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3.5 text-sm text-red-400 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <Formik
              initialValues={{ fullName: '', email: '', password: '', phone: '' }}
              validationSchema={createAdminSchema}
              onSubmit={async (values, { resetForm }) => {
                setModalError(null);
                try {
                  await createAdmin(values).unwrap();
                  resetForm();
                  setIsModalOpen(false);
                  setSuccessMessage(`New Admin account for ${values.email} created successfully.`);
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
                    type="text"
                    placeholder="e.g. John Doe"
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
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    required
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  />

                  <FormikField
                    name="phone"
                    label="Phone Number (Optional)"
                    type="text"
                    placeholder="+977 98XXXXXXXX"
                    leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  />

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <span>Create Admin Account</span>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Delete Administrator?</h3>
              <p className="text-sm text-slate-400">
                Are you sure you want to permanently delete{' '}
                <span className="text-amber-400 font-semibold">{deleteTarget.fullName || deleteTarget.email}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/20 transition disabled:opacity-50 flex items-center gap-2"
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
