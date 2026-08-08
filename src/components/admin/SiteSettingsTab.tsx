'use client';

import React, { useState, useEffect } from 'react';
import {
  useGetSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
  useUploadLogoMutation,
} from '@/store/api/siteSettingsApi';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Upload,
  Save,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  Share2,
  FileText,
  Search,
} from 'lucide-react';

export function SiteSettingsTab() {
  const { data: settingsData, isLoading, refetch } = useGetSiteSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSiteSettingsMutation();
  const [uploadLogo] = useUploadLogoMutation();

  const [formData, setFormData] = useState<any>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (settingsData) {
      setFormData(settingsData);
    }
  }, [settingsData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logoUrl' | 'faviconUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadLogo(fd).unwrap();
      if (res.url) {
        setFormData((prev: any) => ({ ...prev, [fieldName]: res.url }));
      }
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData).unwrap();
      setSaveSuccess(true);
      refetch();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save site settings.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-400 animate-pulse">
        Loading site settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md sticky top-4 z-10 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>Dynamic Site Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Everything updated here reflects live across your entire public website immediately.
          </p>
        </div>
        <button
          type="submit"
          disabled={isUpdating}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl flex items-center gap-2 text-sm transition shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isUpdating ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Site settings saved successfully! Your public website has been updated dynamically.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Branding & Logo */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Company Branding & Logo</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
            <input
              type="text"
              name="siteName"
              value={formData.siteName || ''}
              onChange={handleChange}
              placeholder="Revelation Pest Control"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline / Slogan</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline || ''}
              onChange={handleChange}
              placeholder="Professional & Eco-Friendly Pest Extermination"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Header / Navbar Logo Image</label>
            <div className="flex items-center gap-4">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" className="h-12 w-auto object-contain bg-slate-950 p-2 rounded-xl border border-slate-800" />
              ) : (
                <div className="h-12 w-24 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-xs text-slate-600">No Logo</div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoUpload(e, 'logoUrl')}
                className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Top Announcement Bar & Emergency Hotline */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span>Top Announcement Banner & Hotline</span>
          </h3>

          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">Show Top Announcement Bar</span>
            <input
              type="checkbox"
              name="showAnnouncementBar"
              checked={!!formData.showAnnouncementBar}
              onChange={handleChange}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Top Bar Announcement Message</label>
            <input
              type="text"
              name="announcementText"
              value={formData.announcementText || ''}
              onChange={handleChange}
              placeholder="Emergency Pest Control Service Available 24/7 in Kathmandu Valley"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Hotline Number</label>
            <input
              type="text"
              name="emergencyHotline"
              value={formData.emergencyHotline || ''}
              onChange={handleChange}
              placeholder="+977 9863847696"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Card 3: Contact & Business Hours */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Contact Details & Hours</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Phone</label>
              <input
                type="text"
                name="phonePrimary"
                value={formData.phonePrimary || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary Phone</label>
              <input
                type="text"
                name="phoneSecondary"
                value={formData.phoneSecondary || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Public Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Physical Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Business Operating Hours</label>
            <input
              type="text"
              name="businessHours"
              value={formData.businessHours || ''}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Card 4: Hero Copy & Footer Details */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Homepage Copy & Footer</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Section Main Title</label>
            <input
              type="text"
              name="heroTitle"
              value={formData.heroTitle || ''}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Section Subtitle Copy</label>
            <textarea
              name="heroSubtitle"
              rows={2}
              value={formData.heroSubtitle || ''}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Footer About Text</label>
            <textarea
              name="footerAboutText"
              rows={2}
              value={formData.footerAboutText || ''}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Footer Copyright Notice</label>
            <input
              type="text"
              name="footerCopyright"
              value={formData.footerCopyright || ''}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Privacy Policy Document (HTML/Text)</label>
            <textarea
              name="privacyPolicy"
              rows={4}
              value={formData.privacyPolicy || ''}
              onChange={handleChange}
              placeholder="Privacy policy content..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Terms of Service Document (HTML/Text)</label>
            <textarea
              name="termsOfService"
              rows={4}
              value={formData.termsOfService || ''}
              onChange={handleChange}
              placeholder="Terms of service content..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Analytics & Custom Tracking Scripts</h4>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Google Analytics Measurement ID (e.g. G-QWLSRQMK66)</label>
              <input
                type="text"
                name="googleAnalyticsId"
                value={formData.googleAnalyticsId || ''}
                onChange={handleChange}
                placeholder="G-QWLSRQMK66"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Header HTML Scripts (GTM / Meta Pixel / Custom Code)</label>
              <textarea
                name="customHeaderScripts"
                rows={5}
                value={formData.customHeaderScripts || ''}
                onChange={handleChange}
                placeholder="<!-- Paste your Google Tag Manager or tracking script here -->"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
