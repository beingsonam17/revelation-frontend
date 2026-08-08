'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store';
import { ShieldCheck, Phone, Menu, X, Calendar, User as UserIcon } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top Emergency Topbar */}
      <div className="bg-amber-600 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            <span>Emergency Pest Control Service Available 24/7 in Kathmandu Valley</span>
          </p>
          <a
            href="tel:+9779863847696"
            className="flex items-center gap-1.5 hover:underline font-extrabold tracking-wide"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 24/7: +977 9863847696</span>
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-amber-500 font-extrabold text-xl">
          <ShieldCheck className="w-8 h-8 text-amber-500" />
          <span>Revelation Pest Control</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition ${
                  isActive ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA & User Status */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              href={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
              className="inline-flex items-center gap-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 px-4 py-2 rounded-xl transition"
            >
              <UserIcon className="w-4 h-4" />
              <span>{user?.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/book-now"
            className="inline-flex items-center gap-2 text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2.5 rounded-xl shadow-lg transition"
          >
            <Calendar className="w-4 h-4" />
            <span>Get a Free Quote</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 space-y-3 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 hover:text-amber-400 py-1.5"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <Link
              href="/book-now"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block text-xs font-extrabold bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
