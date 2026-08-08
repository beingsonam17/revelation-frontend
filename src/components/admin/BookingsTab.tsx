'use client';

import React, { useState } from 'react';
import {
  useGetAllBookingsAdminQuery,
  useUpdateBookingStatusAdminMutation,
  useCreateBookingMutation,
} from '@/store/api/bookingApi';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Phone,
  MapPin,
  X,
  Trash2,
} from 'lucide-react';

export function BookingsTab() {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: bookingsData, isLoading, refetch } = useGetAllBookingsAdminQuery(statusFilter || undefined);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusAdminMutation();
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();

  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    serviceName: 'Cockroach Control',
    preferredDate: '',
    preferredTime: '10:00 AM',
    notes: 'Phone call booking',
  });

  const bookings = Array.isArray(bookingsData)
    ? bookingsData
    : Array.isArray((bookingsData as any)?.data)
    ? (bookingsData as any).data
    : [];

  const filteredBookings = bookings.filter(
    (b: any) =>
      b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone?.includes(searchQuery) ||
      b.serviceName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      refetch();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBooking(manualForm).unwrap();
      setShowManualModal(false);
      refetch();
    } catch (err) {
      alert('Failed to create manual booking.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Bookings & Appointments ({bookings.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage customer service appointments and manual bookings.</p>
        </div>
        <button
          onClick={() => setShowManualModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl flex items-center gap-2 text-sm transition shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Booking</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, or service..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Address</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <div className="font-bold text-white">{b.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-amber-400" />
                      <span>{b.phone}</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-amber-300">{b.serviceName}</td>
                  <td className="p-4 text-xs text-slate-300">
                    <div>{b.preferredDate}</div>
                    <div className="text-slate-500">{b.preferredTime}</div>
                  </td>
                  <td className="p-4 text-xs text-slate-400 max-w-xs truncate">{b.address}</td>
                  <td className="p-4">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : b.status === 'COMPLETED'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : b.status === 'CANCELLED'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      <option value="PENDING" className="bg-slate-900 text-amber-400">PENDING</option>
                      <option value="CONFIRMED" className="bg-slate-900 text-emerald-400">CONFIRMED</option>
                      <option value="COMPLETED" className="bg-slate-900 text-blue-400">COMPLETED</option>
                      <option value="CANCELLED" className="bg-slate-900 text-rose-400">CANCELLED</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleStatusChange(b.id, 'CANCELLED')}
                      className="p-1.5 hover:bg-rose-500/10 text-rose-400 rounded-lg transition"
                      title="Cancel Booking"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Manual Booking */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl relative">
            <button onClick={() => setShowManualModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white">Add Manual Booking</h3>

            <form onSubmit={handleCreateManualBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={manualForm.name}
                  onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={manualForm.phone}
                  onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={manualForm.address}
                  onChange={(e) => setManualForm({ ...manualForm, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowManualModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={isCreating} className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition">
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
