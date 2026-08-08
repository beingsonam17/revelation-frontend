'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { ShieldAlert, LogOut, Phone, Crown } from 'lucide-react';

export const SuperAdminHeader: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur-xl border-b border-amber-500/20 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/superadmin" className="flex items-center gap-2.5 text-amber-400 font-extrabold text-lg sm:text-xl">
            <ShieldAlert className="w-7 h-7 text-amber-500" />
            <span>Revelation Pest Control</span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
            <Crown className="w-3 h-3 text-amber-400" />
            SuperAdmin Center
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href="tel:+9779863847696"
            className="hidden md:flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-3 py-1.5 rounded-full"
          >
            <Phone className="w-3.5 h-3.5 animate-pulse" />
            <span>24/7 Support: +977 9863847696</span>
          </a>

          {user && (
            <div className="flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-medium">
              <div className="w-7 h-7 rounded-full bg-amber-500/30 flex items-center justify-center text-amber-300 font-bold border border-amber-400/40">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-semibold text-slate-200">{user.fullName || user.email}</p>
                <p className="text-[10px] text-amber-400 font-mono tracking-wider">SUPER_ADMIN</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
