'use client';

import React, { useState } from 'react';
import { useGetAdminStatsQuery } from '@/store/api/dashboardApi';
import { useGetAllBookingsAdminQuery, useUpdateBookingStatusAdminMutation } from '@/store/api/bookingApi';
import { useGetAllInquiriesAdminQuery } from '@/store/api/inquiryApi';
import { useGetAdminTestimonialsQuery, useToggleApproveTestimonialMutation, useDeleteTestimonialMutation } from '@/store/api/testimonialsApi';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import {
  Calendar,
  Layers,
  Inbox,
  Users,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  PhoneCall,
  Mail,
  Star,
  CheckCircle2,
  Trash2,
  Power,
  Quote,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [selectedTab, setSelectedTab] = useState<'bookings' | 'inquiries' | 'reviews'>('bookings');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: statsData, isLoading: isStatsLoading, refetch: refetchStats } = useGetAdminStatsQuery(undefined);
  const { data: bookingsData, isLoading: isBookingsLoading, refetch: refetchBookings } = useGetAllBookingsAdminQuery(statusFilter || undefined);
  const { data: inquiriesData, isLoading: isInquiriesLoading } = useGetAllInquiriesAdminQuery(undefined);
  const { data: testimonialsData = [], isLoading: isTestimonialsLoading, refetch: refetchTestimonials } = useGetAdminTestimonialsQuery(undefined);

  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusAdminMutation();
  const [toggleApprove, { isLoading: isTogglingApprove }] = useToggleApproveTestimonialMutation();
  const [deleteTestimonial, { isLoading: isDeletingTestimonial }] = useDeleteTestimonialMutation();

  const stats = statsData?.data?.stats || {
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    activeServices: 6,
    newInquiries: 0,
    totalCustomers: 0,
  };

  const bookings = bookingsData?.data || [];
  const inquiries = inquiriesData?.data || [];
  const testimonials = testimonialsData;

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      refetchBookings();
      refetchStats();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleToggleApprove = async (id: string) => {
    try {
      await toggleApprove(id).unwrap();
    } catch (err) {
      alert('Failed to toggle review approval.');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return;
    try {
      await deleteTestimonial(id).unwrap();
    } catch (err) {
      alert('Failed to delete review.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Admin Operations Panel</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Management Console</h1>
          </div>
          <button
            onClick={() => {
              refetchStats();
              refetchBookings();
              refetchTestimonials();
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-4 py-2.5 rounded-xl hover:bg-amber-900/60 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Analytics Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.totalBookings}</p>
            <p className="text-xs text-amber-400 font-semibold">{stats.pendingBookings} Pending Quote Requests</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Services</span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.activeServices}</p>
            <p className="text-xs text-slate-400">Residential & Commercial catalog</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inquiries Inbox</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Inbox className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.newInquiries}</p>
            <p className="text-xs text-purple-400 font-semibold">New Contact Submissions</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Reviews</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Quote className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">{testimonials.length}</p>
            <p className="text-xs text-emerald-400 font-semibold">
              {testimonials.filter((t) => t.isApproved).length} Published Reviews
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-3">
          <button
            onClick={() => setSelectedTab('bookings')}
            className={`pb-3 font-bold text-sm transition border-b-2 ${
              selectedTab === 'bookings'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Booking Requests ({bookings.length})
          </button>
          <button
            onClick={() => setSelectedTab('inquiries')}
            className={`pb-3 font-bold text-sm transition border-b-2 ${
              selectedTab === 'inquiries'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Contact Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => setSelectedTab('reviews')}
            className={`pb-3 font-bold text-sm transition border-b-2 ${
              selectedTab === 'reviews'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Customer Reviews ({testimonials.length})
          </button>
        </div>

        {/* Bookings Queue View */}
        {selectedTab === 'bookings' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-xl font-extrabold text-white">Service Booking Queue</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {isBookingsLoading ? (
              <div className="p-8 text-center text-slate-400">Loading bookings data...</div>
            ) : bookings.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No booking requests found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs uppercase bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3.5">Ref ID</th>
                      <th className="px-4 py-3.5">Customer</th>
                      <th className="px-4 py-3.5">Service</th>
                      <th className="px-4 py-3.5">Preferred Date</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {bookings.map((b: any) => (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-4 font-mono font-bold text-amber-400 text-xs">
                          #{b.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-4 py-4 space-y-0.5">
                          <p className="font-bold text-white">{b.customerName}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {b.customerEmail}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <PhoneCall className="w-3 h-3" /> {b.customerPhone}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-200">
                            {b.service?.title || 'General Pest Control'}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-300">
                          {b.preferredDate}
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                            disabled={isUpdating}
                            className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border outline-none ${
                              b.status === 'CONFIRMED'
                                ? 'bg-blue-950 text-blue-300 border-blue-800'
                                : b.status === 'COMPLETED'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : b.status === 'CANCELLED'
                                ? 'bg-red-950 text-red-300 border-red-800'
                                : 'bg-amber-950 text-amber-300 border-amber-800'
                            }`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-xs text-slate-400 font-mono">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Inquiries Inbox View */}
        {selectedTab === 'inquiries' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-6 space-y-4">
            <h2 className="text-xl font-extrabold text-white">Contact Form Inquiries</h2>
            {isInquiriesLoading ? (
              <div className="p-8 text-center text-slate-400">Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No contact inquiries received.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inquiries.map((inq: any) => (
                  <div key={inq.id} className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base">{inq.name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{inq.email} • {inq.phone}</p>
                    <p className="text-sm text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                      {inq.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Customer Reviews Moderation View */}
        {selectedTab === 'reviews' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white">Customer Reviews Moderation</h2>
              <span className="text-xs font-semibold text-slate-400">
                Click status button to toggle publication
              </span>
            </div>

            {isTestimonialsLoading ? (
              <div className="p-8 text-center text-slate-400">Loading reviews...</div>
            ) : testimonials.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No customer reviews submitted yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => handleToggleApprove(t.id)}
                          disabled={isTogglingApprove}
                          className={`text-xs font-bold px-3 py-1 rounded-full border transition flex items-center gap-1.5 ${
                            t.isApproved
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                              : 'bg-amber-950 text-amber-400 border-amber-800 hover:bg-amber-900'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.isApproved ? 'APPROVED' : 'PENDING APPROVAL'}</span>
                        </button>
                      </div>

                      <h3 className="font-bold text-white text-base">&quot;{t.title || 'Client Feedback'}&quot;</h3>
                      <p className="text-xs text-slate-400">
                        By <strong>{t.name}</strong> ({t.email}) • {t.roleOrLocation || t.serviceTitle || 'Customer'}
                      </p>
                      <p className="text-sm text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800/80 italic">
                        &quot;{t.comment}&quot;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
                      <span>Submitted on {new Date(t.createdAt).toLocaleDateString()}</span>
                      <button
                        onClick={() => handleDeleteReview(t.id)}
                        disabled={isDeletingTestimonial}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/40 border border-transparent hover:border-rose-900 transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

