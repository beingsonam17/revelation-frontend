import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { ShieldCheck, Award, Users, CheckCircle2, PhoneCall } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Revelation Pest Control',
  description: 'Learn about Revelation Pest Control. Over 8 years of providing reliable and effective pest control solutions for homes and businesses in Kathmandu Valley.',
  alternates: {
    canonical: 'https://revelationpestcontrol.com/about',
  },
};

export default function AboutPage() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Revelation Pest Control',
    url: 'https://revelationpestcontrol.com/about',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <JsonLd data={jsonLdData} />
      <PublicHeader />

      {/* Header Banner */}
      <section className="py-20 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">About Our Company</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">We Are Professional Pest Control Experts</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Delivering trusted, high-quality pest control solutions across Kathmandu Valley for over 8 years.
          </p>
        </div>
      </section>

      {/* Main Body */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-extrabold text-white">Dedicated to Safe & Lasting Protection</h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            We specialize in providing reliable and effective pest control solutions for homes and businesses. With a focus on safety and customer satisfaction, our expert team ensures long-lasting protection against pests. From inspections to treatments, we deliver tailored services to keep your property pest-free and comfortable all year round.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-amber-500">8+ Years</p>
              <p className="text-xs text-slate-400">Industry Excellence</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-amber-500">24/7</p>
              <p className="text-xs text-slate-400">Emergency Hotline</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-amber-500">100%</p>
              <p className="text-xs text-slate-400">Safe Chemical Formula</p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
            <h3 className="text-lg font-bold text-white">Safety First</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We strictly utilize non-toxic, eco-certified formulations safe for children, pets, and family members.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
            <Award className="w-8 h-8 text-amber-500" />
            <h3 className="text-lg font-bold text-white">Certified Technicians</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our field teams are trained in advanced inspection, chemical-barrier application, and rodent proofing.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
            <Users className="w-8 h-8 text-amber-500" />
            <h3 className="text-lg font-bold text-white">Customer Satisfaction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We stand behind every service with follow-up inspections and guaranteed pest elimination warranties.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
