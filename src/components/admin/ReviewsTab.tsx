'use client';

import React, { useState } from 'react';
import {
  useGetAdminTestimonialsQuery,
  useToggleApproveTestimonialMutation,
  useDeleteTestimonialMutation,
} from '@/store/api/testimonialsApi';
import { Quote, Star, CheckCircle2, Trash2, Power, Search, User } from 'lucide-react';

export function ReviewsTab() {
  const { data: testimonials = [], isLoading, refetch } = useGetAdminTestimonialsQuery(undefined);
  const [toggleApprove] = useToggleApproveTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = testimonials.filter(
    (t: any) =>
      t.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.designation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = async (id: string) => {
    try {
      await toggleApprove(id).unwrap();
      refetch();
    } catch (err) {
      alert('Failed to toggle review approval.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteTestimonial(id).unwrap();
      refetch();
    } catch (err) {
      alert('Failed to delete review.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Quote className="w-5 h-5 text-amber-400" />
            <span>Customer Reviews & Testimonials ({testimonials.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Moderate public customer reviews displayed on the website homepage.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reviews by customer name, designation, or comment..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((rev: any) => (
          <div
            key={rev.id}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < (rev.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => handleToggle(rev.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${
                    rev.isApproved
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{rev.isApproved ? 'Approved' : 'Pending Approval'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-4">
                "{rev.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-sm">
                  {rev.clientName?.charAt(0) || 'C'}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{rev.clientName}</h4>
                  <p className="text-xs text-slate-400">{rev.designation || 'Verified Client'}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleDelete(rev.id)}
                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
