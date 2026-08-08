'use client';

import React, { useState } from 'react';
import { useGetAllInquiriesAdminQuery } from '@/store/api/inquiryApi';
import { Inbox, Search, Mail, Phone, Calendar, User, Trash2 } from 'lucide-react';

export function InquiriesTab() {
  const { data: inquiriesData, isLoading } = useGetAllInquiriesAdminQuery(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const inquiries = Array.isArray(inquiriesData)
    ? inquiriesData
    : Array.isArray((inquiriesData as any)?.data)
    ? (inquiriesData as any).data
    : [];

  const filteredInquiries = inquiries.filter(
    (inq: any) =>
      inq.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone?.includes(searchQuery) ||
      inq.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-amber-400" />
            <span>Customer Inquiries Inbox ({inquiries.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">View and manage contact form submissions from website visitors.</p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search inquiries by name, email, phone, or message..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Inquiries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInquiries.map((inq: any) => (
          <div
            key={inq.id}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>{inq.fullName || 'Anonymous Visitor'}</span>
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>{inq.phone}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-blue-400" />
                    <span>{inq.email}</span>
                  </span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {new Date(inq.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              "{inq.message}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
