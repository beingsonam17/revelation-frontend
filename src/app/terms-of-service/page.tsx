'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useGetSiteSettingsQuery } from '@/store/api/siteSettingsApi';
import { FileText, ShieldCheck } from 'lucide-react';

export default function TermsOfServicePage() {
  const { data: settings, isLoading } = useGetSiteSettingsQuery();

  const siteName = settings?.siteName || 'Revelation Pest Control';
  const termsHtml = settings?.termsOfService || `
    <h2>Terms of Service</h2>
    <p>Last updated: August 2026</p>
    <p>Welcome to ${siteName}. By booking or using our pest management services, you agree to these Terms of Service.</p>
    <h3>Service Agreements & Access</h3>
    <p>Clients must grant our certified technicians safe and clear access to the designated property at the scheduled appointment time. Any safety hazards or chemical allergies must be disclosed prior to treatment.</p>
    <h3>Cancellation & Rescheduling</h3>
    <p>Appointments may be rescheduled or cancelled at least 24 hours prior to the scheduled service time without penalty.</p>
    <h3>Service Guarantee & Liability</h3>
    <p>We follow strict safety standards and government-approved treatment protocols. Our maximum liability is limited to the total service fee paid.</p>
  `;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Banner */}
        <div className="text-center space-y-3 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Service Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms of Service</h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Please read the terms governing our pest control services at {siteName}.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 animate-pulse">Loading terms document...</div>
          ) : (
            <div
              className="prose prose-invert prose-amber max-w-none text-slate-300 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: termsHtml }}
            />
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
