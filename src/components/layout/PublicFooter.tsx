'use client';

import React from 'react';
import Link from 'next/link';
import { useGetSiteSettingsQuery } from '@/store/api/siteSettingsApi';
import { ShieldCheck, Phone, Mail, MapPin, Clock } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { data: settings } = useGetSiteSettingsQuery();

  const siteName = settings?.siteName || 'Revelation Pest Control';
  const logoUrl = settings?.logoUrl;
  const footerAboutText = settings?.footerAboutText || 'For over 8 years, we\'ve delivered trusted, high-quality pest control services across Kathmandu Valley, building strong relationships through dedication and guaranteed customer satisfaction.';
  const address = settings?.address || 'Kathmandu Valley & Surrounding Regions, Nepal';
  const phone = settings?.phonePrimary || settings?.emergencyHotline || '+977 9863847696';
  const email = settings?.email || 'info@revelationpestcontrol.com';
  const copyright = settings?.footerCopyright || 'Copyright © 2026 Revelation Pest Control | All Rights Reserved.';

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 text-amber-500 font-extrabold text-xl">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-8 w-auto object-contain" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-amber-500" />
              )}
              <span className="text-white">{siteName}</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              {footerAboutText}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" /> 24/7 Emergency Service
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-amber-400 transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-amber-400 transition">About Us</Link></li>
              <li><Link href="/services" className="hover:text-amber-400 transition">Our Services</Link></li>
              <li><Link href="/faq" className="hover:text-amber-400 transition">Frequently Asked Questions</Link></li>
              <li><Link href="/blog" className="hover:text-amber-400 transition">Blog & Articles</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Our Services</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/services" className="hover:text-amber-400 transition">Residential Pest Control</Link></li>
              <li><Link href="/services" className="hover:text-amber-400 transition">Bed Bug Treatment</Link></li>
              <li><Link href="/services" className="hover:text-amber-400 transition">Bees & Wasps Removal</Link></li>
              <li><Link href="/services" className="hover:text-amber-400 transition">Antitermite Treatment</Link></li>
              <li><Link href="/services" className="hover:text-amber-400 transition">Rodent Control</Link></li>
              <li><Link href="/services" className="hover:text-amber-400 transition">Mosquito Control</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Contact Info</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-amber-400 font-bold text-amber-400">
                  {phone} (24/7 Hotline)
                </a>
              </li>
              <li className="flex items-center gap-2.5 min-w-0">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="break-all">{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{copyright}</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms-of-service" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
