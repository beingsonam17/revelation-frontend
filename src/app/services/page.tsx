import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Pest Control Services | Revelation Pest Control',
  description:
    'Comprehensive pest control services in Kathmandu Valley including Residential Pest Control, Bed Bug Elimination, Termite Barrier Treatment, Bees Removal, and Mosquito Control.',
  alternates: { canonical: 'https://revelationpestcontrol.com/services' },
};

async function getServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    // Backend wraps in { success, data: [...] }
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json)) return json;
    return [];
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pest Control Services Offered by Revelation Pest Control',
    itemListElement: services.map((s: any, index: number) => ({
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Our Pest Control Solutions
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Providing 24/7 safe, effective, and eco-friendly pest elimination across Kathmandu Valley.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {services.length === 0 ? (
          <p className="text-center text-slate-500 py-16">No services available at the moment. Please check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s: any) => (
              <div
                key={s.slug}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between hover:border-amber-500/50 transition duration-300 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black text-xl">
                    {s.iconName ? s.iconName.charAt(0).toUpperCase() : '🐛'}
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">{s.title}</h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {s.summary || s.description?.substring(0, 140)}
                  </p>
                  {s.priceStarting && (
                    <div className="pt-2">
                      <span className="inline-block px-3 py-1 bg-amber-950/60 border border-amber-800/60 text-amber-400 text-xs font-bold rounded-lg">
                        Starting from NRS {Number(s.priceStarting).toLocaleString()}
                      </span>
                    </div>
                  )}
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
        )}
      </section>

      <PublicFooter />
    </div>
  );
}
