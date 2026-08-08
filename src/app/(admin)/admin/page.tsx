'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGetAdminStatsQuery } from '@/store/api/dashboardApi';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { SiteSettingsTab } from '@/components/admin/SiteSettingsTab';
import { BlogsTab } from '@/components/admin/BlogsTab';
import { ServicesTab } from '@/components/admin/ServicesTab';
import { BookingsTab } from '@/components/admin/BookingsTab';
import { InquiriesTab } from '@/components/admin/InquiriesTab';
import { ReviewsTab } from '@/components/admin/ReviewsTab';
import { AdminTeamTab } from '@/components/admin/AdminTeamTab';
import { UsersTab } from '@/components/admin/UsersTab';
import { useAppSelector } from '@/store';

import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Layers,
  Calendar,
  Inbox,
  Quote,
  TrendingUp,
  CheckCircle,
  Clock,
  Users,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Crown,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams.get('tab') || 'overview') as
    | 'overview' | 'users' | 'settings' | 'blogs'
    | 'services' | 'bookings' | 'inquiries' | 'reviews' | 'team';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const setActiveTab = (tab: string) => {
    router.push(`/admin?tab=${tab}`);
  };

  const { data: statsData, refetch: refetchStats } = useGetAdminStatsQuery(undefined);

  const stats = statsData?.data?.stats || {
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    activeServices: 6,
    newInquiries: 0,
    totalCustomers: 0,
  };

  const { user } = useAppSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const navItems = [
    { id: 'overview', label: 'Overview Metrics', icon: LayoutDashboard },
    { id: 'users', label: 'Registered Customers', icon: Users },
    { id: 'settings', label: 'Site Settings & Logo', icon: Building2 },
    { id: 'blogs', label: 'Blog & Articles', icon: BookOpen },
    { id: 'services', label: 'Pest Services', icon: Layers },
    { id: 'bookings', label: 'Bookings & Calendar', icon: Calendar },
    { id: 'inquiries', label: 'Inquiries Inbox', icon: Inbox },
    { id: 'reviews', label: 'Customer Reviews', icon: Quote },
    ...(isSuperAdmin ? [{ id: 'team', label: 'Admin Team', icon: Crown }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <DashboardHeader />

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {/* Mobile Navigation Toggle Bar */}
        <div className="lg:hidden flex items-center justify-between bg-slate-900/90 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Navigation Menu</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar Navigation (Desktop + Mobile Drawer) */}
        <aside
          className={`lg:w-64 flex-shrink-0 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 space-y-2 backdrop-blur-md transition-all duration-300 ${
            mobileMenuOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800 mb-2">
            Admin Management
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/40 text-amber-400 font-bold shadow-lg'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <span>Operational Control Panel</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard Overview</h1>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Bookings</span>
                    <Calendar className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{stats.totalBookings}</div>
                  <p className="text-xs text-slate-500">Service appointments logged</p>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Pending Bookings</span>
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-amber-400">{stats.pendingBookings}</div>
                  <p className="text-xs text-slate-500">Awaiting confirmation</p>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Services</span>
                    <Layers className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-emerald-400">{stats.activeServices}</div>
                  <p className="text-xs text-slate-500">Pest control offerings</p>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Customer Inquiries</span>
                    <Inbox className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-3xl font-black text-blue-400">{stats.newInquiries}</div>
                  <p className="text-xs text-slate-500">Contact submissions</p>
                </div>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl text-left transition group space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition">Update Site Settings & Logo</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Edit phone numbers, emergency hotline, logo image, business hours, and SEO metadata.</p>
                </button>

                <button
                  onClick={() => setActiveTab('blogs')}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl text-left transition group space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition">Compose Blog Article</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Publish new blog posts using the dynamic rich text editor with image uploads.</p>
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl text-left transition group space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition">Manage Services & Prices</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Add new service packages, update pricing, descriptions, and active status.</p>
                </button>
              </div>
            </div>
          )}

          {/* USERS & CLIENTS TAB */}
          {activeTab === 'users' && <UsersTab />}

          {/* SITE SETTINGS TAB */}
          {activeTab === 'settings' && <SiteSettingsTab />}

          {/* BLOGS TAB */}
          {activeTab === 'blogs' && <BlogsTab />}

          {/* SERVICES TAB */}
          {activeTab === 'services' && <ServicesTab />}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && <BookingsTab />}

          {/* INQUIRIES TAB */}
          {activeTab === 'inquiries' && <InquiriesTab />}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && <ReviewsTab />}

          {/* ADMIN TEAM TAB */}
          {activeTab === 'team' && <AdminTeamTab />}
        </main>
      </div>
    </div>
  );
}
