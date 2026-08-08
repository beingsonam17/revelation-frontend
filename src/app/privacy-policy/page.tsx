'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useGetSiteSettingsQuery } from '@/store/api/siteSettingsApi';
import { ShieldCheck, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { data: settings, isLoading } = useGetSiteSettingsQuery();

  const siteName = settings?.siteName || 'Revelation Pest Control';
  const privacyHtml = settings?.privacyPolicy || `
    <h2>Privacy Policy</h2>
    <p>Last updated: August 2026</p>
    <p>Revelation Pest Control values your privacy. We collect personal information (such as your name, phone number, email, and address) solely for the purpose of fulfilling your pest control service bookings, processing inquiries, and providing customer support across Nepal.</p>
    <h3>Information We Collect</h3>
    <p>When you book a service or contact us, we collect your contact details, service location, and preferences. We do not sell or share your personal information with third parties for marketing purposes.</p>
    <h3>Data Security</h3>
    <p>We implement industry-standard administrative and technical security measures to safeguard your personal data from unauthorized access or disclosure.</p>
  `;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Banner */}
        <div className="text-center space-y-3 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Official Policy Document</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Learn how {siteName} protects and manages your personal data.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 animate-pulse">Loading policy document...</div>
          ) : (
            <div
              className="prose prose-invert prose-amber max-w-none text-slate-300 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: privacyHtml }}
            />
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
