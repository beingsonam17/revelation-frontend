import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { ShieldCheck, CheckCircle, ArrowLeft } from 'lucide-react';

type Props = { params: { slug: string } };

async function getServiceBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    // Backend wraps in { success, data: {...} }
    return json?.data ?? json ?? null;
  } catch {
    return null;
  }
}

async function getAllServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json)) return json;
    return [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: 'Service Not Found | Revelation Pest Control' };

  return {
    title: `${service.title} | Revelation Pest Control`,
    description: service.summary || service.description?.substring(0, 160),
    openGraph: {
      title: `${service.title} - 24/7 Professional Pest Control`,
      description: service.summary,
      url: `https://revelationpestcontrol.com/services/${params.slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://revelationpestcontrol.com/services/${params.slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Revelation Pest Control',
      telephone: '+977 9863847696',
    },
    areaServed: 'Kathmandu Valley',
    description: service.summary,
  };

  const features: string[] = Array.isArray(service.features) ? service.features : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <JsonLd data={jsonLdData} />
      <PublicHeader />

      {/* Header Breadcrumb Banner */}
      <section className="py-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Services
          </Link>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{service.title}</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">{service.summary}</p>
        </div>
      </section>

      {/* Content Body */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-12">
        {/* Description + Price */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-2xl font-extrabold text-white">Treatment Details &amp; Process</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{service.description}</p>
          {service.priceStarting && (
            <div className="pt-2">
              <span className="inline-block px-4 py-2 bg-amber-950/80 border border-amber-800 text-amber-400 font-bold text-sm rounded-xl">
                Starting from NRS {Number(service.priceStarting).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              <span>Service Features &amp; Guarantees</span>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
              {features.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA Card */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-extrabold">Ready for a Pest-Free Space?</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-900">
              Book your {service.title} online or call our 24/7 helpline.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/book-now"
              className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-sm rounded-xl transition shadow-xl"
            >
              Book Service Now
            </Link>
            <a
              href="tel:+9779863847696"
              className="px-4 py-3 bg-white/20 hover:bg-white/30 text-slate-950 font-extrabold text-sm rounded-xl transition"
            >
              Call 24/7
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
