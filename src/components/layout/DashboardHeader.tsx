'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { useLogoutApiMutation } from '@/store/api/authApi';
import { logout } from '@/store/slices/authSlice';
import { ShieldCheck, LogOut, Phone, User as UserIcon } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [logoutApi] = useLogoutApiMutation();

  const handleLogout = async () => {
    try {
      await logoutApi(undefined).unwrap();
    } catch (e) {
      // Ignore network errors on logout
    }
    dispatch(logout());
    router.push('/login');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-amber-500 font-extrabold text-lg sm:text-xl">
          <ShieldCheck className="w-7 h-7 text-amber-500" />
          <span>Revelation Pest Control</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href="tel:+9779863847696"
            className="hidden md:flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-3 py-1.5 rounded-full"
          >
            <Phone className="w-3.5 h-3.5 animate-pulse" />
            <span>24/7 Hotline: +977 9863847696</span>
          </a>

          {user && (
            <div className="flex items-center gap-2.5 bg-slate-800 border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs font-medium">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-semibold text-slate-200">{user.fullName || user.email}</p>
                <p className="text-[10px] text-amber-400 font-mono tracking-wider">{user.role}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
