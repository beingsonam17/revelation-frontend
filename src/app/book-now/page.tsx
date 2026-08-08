'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { FormikField } from '@/components/forms/FormikField';
import { useCreateBookingMutation } from '@/store/api/bookingApi';
import { useAppSelector } from '@/store';
import { Calendar, Clock, MapPin, User, Mail, Phone, CheckCircle2, ShieldCheck, AlertCircle, Check } from 'lucide-react';

const bookingSchema = Yup.object().shape({
  customerName: Yup.string().required('Full name is required'),
  customerEmail: Yup.string().email('Valid email address required').required('Email is required'),
  customerPhone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Service address is required'),
  preferredDate: Yup.string().required('Preferred service date is required'),
});

export default function BookNowPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [createBooking, { isLoading }] = useCreateBookingMutation();
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <PublicHeader />

      {/* Header Banner */}
      <section className="py-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">Instant Service Quote</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Book Pest Control Inspection</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Fill out the form below for immediate service scheduling across Kathmandu Valley.
          </p>
        </div>
      </section>

      {/* Form Area */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full flex-1">
        {submittedBooking ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">Booking Request Submitted!</h2>
              <p className="text-sm text-slate-300">
                Thank you, <strong className="text-white">{submittedBooking.customerName}</strong>. Your request has been queued.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left max-w-md mx-auto space-y-2 text-xs text-slate-300">
              <p><strong>Booking Reference:</strong> <span className="text-amber-400 font-mono">#{submittedBooking.id.slice(0, 8).toUpperCase()}</span></p>
              <p><strong>Service Date:</strong> {submittedBooking.preferredDate}</p>
              <p><strong>Address:</strong> {submittedBooking.address}</p>
              <p><strong>Status:</strong> <span className="text-amber-400 font-bold">{submittedBooking.status}</span></p>
            </div>

            <p className="text-xs text-slate-400">
              Our technician team will call you at <strong className="text-slate-200">{submittedBooking.customerPhone}</strong> shortly to confirm arrival details.
            </p>

            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-lg transition"
              >
                Track in Customer Dashboard
              </Link>
              <button
                onClick={() => setSubmittedBooking(null)}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
              >
                Book Another Service
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-500" />
                <h2 className="text-xl font-bold text-white">Service Request Details</h2>
              </div>
              {user && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Logged in as {user.fullName || user.email} (Details auto-filled)</span>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3.5 text-sm text-red-400 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Formik
              enableReinitialize
              initialValues={{
                customerName: user?.fullName || '',
                customerEmail: user?.email || '',
                customerPhone: user?.phone || '',
                address: '',
                preferredDate: new Date().toISOString().split('T')[0],
                preferredTimeSlot: 'Morning (9:00 AM - 12:00 PM)',
                notes: '',
              }}
              validationSchema={bookingSchema}
              onSubmit={async (values) => {
                setErrorMessage(null);
                try {
                  const res: any = await createBooking(values).unwrap();
                  setSubmittedBooking(res.data);
                } catch (err: any) {
                  setErrorMessage(err?.data || 'Failed to submit booking request.');
                }
              }}
            >
              {() => (
                <Form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormikField
                      name="customerName"
                      label="Full Name"
                      placeholder="John Doe"
                      required
                      leftIcon={<User className="w-4 h-4 text-slate-400" />}
                    />
                    <FormikField
                      name="customerEmail"
                      label="Email Address"
                      type="email"
                      placeholder="john@example.com"
                      required
                      leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormikField
                      name="customerPhone"
                      label="Phone Number"
                      placeholder="+977 9863847696"
                      required
                      leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                    />
                    <FormikField
                      name="preferredDate"
                      label="Preferred Service Date"
                      type="text"
                      placeholder="YYYY-MM-DD"
                      required
                      leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
                    />
                  </div>

                  <FormikField
                    name="address"
                    label="Property Address (Kathmandu Valley)"
                    placeholder="Area, Street Name, House No., City"
                    required
                    leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
                  />

                  <FormikField
                    name="notes"
                    label="Pest Problem Details / Notes (Optional)"
                    type="textarea"
                    placeholder="Describe infestation signs, room location, or emergency urgency..."
                    rows={3}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold py-4 rounded-xl shadow-xl transition duration-200 disabled:opacity-50 text-sm tracking-wide"
                  >
                    {isLoading ? 'Submitting Request...' : 'Confirm & Request Free Quote'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </section>

      <PublicFooter />
    </div>
  );
}
