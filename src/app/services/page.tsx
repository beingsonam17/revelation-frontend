import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { Home as HomeIcon, Bug, Shield, ShieldCheck, Rat, Wind, ArrowRight, Calendar, PhoneCall } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Pest Control Services | Revelation Pest Control',
  description: 'Comprehensive pest control services in Kathmandu Valley including Residential Pest Control, Bed Bug Elimination, Termite Barrier Treatment, Bees Removal, and Mosquito Control.',
  alternates: {
    canonical: 'https://revelationpestcontrol.com/services',
  },
};

export default function ServicesPage() {
  const services = [
    {
      title: 'Residential Pest Control',
      slug: 'residential-pest-control',
      summary: 'Residential pest control services help homeowners manage and eliminate pests like insects and rodents through effective treatments and preventive measures tailored to household needs.',
      price: 'Starting from NRS 2,500',
      icon: <HomeIcon className="w-8 h-8 text-amber-500" />,
    },
    {
      title: 'Bed Bug Treatment',
      slug: 'bed-bug-treatment',
      summary: 'Bed bug treatment involves thorough inspection, targeted elimination using safe and effective methods, and preventive strategies to eradicate infestations and ensure a comfortable living space.',
      price: 'Starting from NRS 3,500',
      icon: <Bug className="w-8 h-8 text-amber-500" />,
    },
    {
      title: 'Bees & Wasps Removal',
      slug: 'bees-wasps-removal',
      summary: 'Bees and wasps removal ensures safe elimination of nests using professional methods, protecting homes and families from stings while preserving beneficial pollinators.',
      price: 'Starting from NRS 3,000',
      icon: <Shield className="w-8 h-8 text-amber-500" />,
    },
    {
      title: 'Antitermite Treatment',
      slug: 'antitermite-treatment',
      summary: 'Antitermite treatment protects structures by applying advanced chemicals to eliminate termites, preventing damage to wood and ensuring long-lasting protection.',
      price: 'Starting from NRS 5,000',
      icon: <ShieldCheck className="w-8 h-8 text-amber-500" />,
    },
    {
      title: 'Rodent Control',
      slug: 'rodent-control',
      summary: 'Rodent control involves identifying infestations, sealing entry points, and using traps or bait to safely remove rodents, safeguarding health and preventing property damage.',
      price: 'Starting from NRS 2,800',
      icon: <Rat className="w-8 h-8 text-amber-500" />,
    },
    {
      title: 'Mosquito Control',
      slug: 'mosquito-control',
      summary: 'Mosquito control reduces populations through larvicide application, fogging, and habitat management, minimizing the risk of mosquito-borne diseases.',
      price: 'Starting from NRS 2,200',
      icon: <Wind className="w-8 h-8 text-amber-500" />,
    },
  ];

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pest Control Services Offered by Revelation Pest Control',
    itemListElement: services.map((s, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: s.title,
      url: `https://revelationpestcontrol.com/services/${s.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <JsonLd data={jsonLdData} />
      <PublicHeader />

      {/* Header Banner */}
      <section className="py-20 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">Service Catalog</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Our Pest Control Solutions</h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Providing 24/7 safe, effective, and eco-friendly pest elimination across Kathmandu Valley for over 8 years.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div
              key={s.slug}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between hover:border-amber-500/50 transition duration-300 shadow-xl"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  {s.icon}
                </div>
                <h2 className="text-2xl font-extrabold text-white">{s.title}</h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{s.summary}</p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-amber-950/60 border border-amber-800/60 text-amber-400 text-xs font-bold rounded-lg">
                    {s.price}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/book-now"
                  className="text-xs font-bold px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
