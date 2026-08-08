'use client';

import React from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store';
import { useGetMyBookingsQuery } from '@/store/api/bookingApi';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  PlusCircle,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: bookingsData, isLoading, refetch } = useGetMyBookingsQuery(undefined);

  const bookings = bookingsData?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">CONFIRMED</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">COMPLETED</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border border-red-200">CANCELLED</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">PENDING APPROVAL</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/60 border border-slate-800 p-6 md:p-10 shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span>Customer Service Portal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Welcome back, {user?.fullName || 'Valued Customer'}!
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Track your service bookings, manage appointments, or request immediate emergency pest control inspections.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/book-now"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Request Instant Quote</span>
              </Link>
              <a
                href="tel:+9779863847696"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold text-sm transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>24/7 Hotline (+977 9863847696)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-amber-500" />
                <span>Your Service Bookings</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Real-time status updates from our field technician team</p>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-3" />
              <p>Loading your booking history...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No active bookings found</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Need bed bug treatment, termite control, or mosquito fogging? Request an instant service quote today.
              </p>
              <Link
                href="/book-now"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition"
              >
                <span>Book Service Now</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((b: any) => (
                <div
                  key={b.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-amber-400 font-mono font-bold">#REF-{b.id.slice(0, 8).toUpperCase()}</p>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {b.service?.title || 'General Pest Control Service'}
                      </h3>
                    </div>
                    {getStatusBadge(b.status)}
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Preferred Date: <strong>{b.preferredDate}</strong></span>
                    </div>
                    {b.preferredTimeSlot && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Time Slot: {b.preferredTimeSlot}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>Address: {b.address}</span>
                    </div>
                  </div>

                  {b.notes && (
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-400">
                      <strong>Customer Notes:</strong> {b.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
