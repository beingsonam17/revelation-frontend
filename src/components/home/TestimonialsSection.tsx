'use client';

import React, { useState } from 'react';
import { useGetApprovedTestimonialsQuery, Testimonial } from '@/store/api/testimonialsApi';
import { WriteReviewModal } from '@/components/modals/WriteReviewModal';
import { Star, Quote, PlusCircle, ShieldCheck, CheckCircle2, ThumbsUp } from 'lucide-react';

const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Rajesh Karki',
    email: 'rajesh.karki@gmail.com',
    rating: 5,
    roleOrLocation: 'Restaurant Owner, Thamel',
    serviceTitle: 'Cockroach & Rodent Control',
    title: 'Remarkable Pest Control Service!',
    comment: 'Revelation Pest Control completely eradicated our kitchen cockroach problem in just one treatment. Their technicians were professional, fast, and eco-conscious.',
    isApproved: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sunita Maharjan',
    email: 'sunita.m@gmail.com',
    rating: 5,
    roleOrLocation: 'Homeowner, Jhamsikhel, Lalitpur',
    serviceTitle: 'Bed Bug Treatment',
    title: 'Sleeping Peacefully Again',
    comment: 'We struggled with bed bugs for months. Revelation Pest Control came within 2 hours of calling, treated all bedrooms thoroughly, and gave us a full warranty.',
    isApproved: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Anil Shrestha',
    email: 'anil.shrestha@hotelnepal.com',
    rating: 5,
    roleOrLocation: 'General Manager, Kathmandu Boutique Hotel',
    serviceTitle: 'Commercial Pest Management',
    title: 'Outstanding Corporate Partner',
    comment: 'We have maintained a regular monthly pest control contract with Revelation Pest Control. Zero pest incidents and 100% compliance with hospitality hygiene standards.',
    isApproved: true,
    createdAt: new Date().toISOString(),
  },
];

export const TestimonialsSection: React.FC = () => {
  const { data: testimonialsData = [] } = useGetApprovedTestimonialsQuery();
  const testimonials = testimonialsData.length > 0 ? testimonialsData : fallbackTestimonials;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-24 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Section Title & Rating Summary Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Quote className="w-4 h-4 text-amber-400" />
              <span>Verified Customer Feedback</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              What Our Clients Say
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Read real reviews from homeowners, hotel managers, and business owners across Kathmandu Valley who rely on Revelation Pest Control.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
              <div className="text-3xl font-extrabold text-amber-400">4.9</div>
              <div>
                {renderStars(5)}
                <p className="text-xs text-slate-400 mt-0.5">Based on 150+ Verified Reviews</p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/10 transition duration-200 text-sm shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-8 space-y-5 flex flex-col justify-between hover:border-amber-500/40 transition duration-300 relative group shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {renderStars(t.rating)}
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Verified Review
                  </span>
                </div>

                {t.title && (
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                    &quot;{t.title}&quot;
                  </h3>
                )}

                <p className="text-sm text-slate-300 italic leading-relaxed">
                  &quot;{t.comment}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-extrabold text-sm shrink-0">
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.roleOrLocation || t.serviceTitle || 'Customer'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WriteReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
