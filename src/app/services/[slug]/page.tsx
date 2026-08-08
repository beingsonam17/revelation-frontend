import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { ShieldCheck, CheckCircle, Calendar, PhoneCall, ArrowLeft, Clock, Shield } from 'lucide-react';

const servicesMap: Record<string, { title: string; summary: string; description: string; price: string; features: string[] }> = {
  'residential-pest-control': {
    title: 'Residential Pest Control',
    summary: 'Residential pest control services help homeowners manage and eliminate pests like insects and rodents through effective treatments.',
    description: 'We specialize in providing reliable and effective pest control solutions for homes. With a focus on safety and customer satisfaction, our expert team ensures long-lasting protection against pests. From thorough inspections to targeted chemical-barrier treatments, we deliver tailored services to keep your property pest-free and comfortable all year round.',
    price: 'Starting from NRS 2,500',
    features: [
      'Comprehensive Home & Yard Inspection',
      'Child & Pet-Safe Non-Toxic Chemicals',
      'Targeted Eradication for Cockroaches, Ants & Spiders',
      'Ongoing Quarterly Maintenance Options',
      '100% Satisfaction Service Guarantee',
    ],
  },
  'bed-bug-treatment': {
    title: 'Bed Bug Treatment',
    summary: 'Bed bug treatment involves thorough inspection, targeted elimination using safe and effective methods, and preventive strategies.',
    description: 'Bed bug treatment involves thorough inspection, targeted elimination using safe and effective methods, and preventive strategies to eradicate infestations and ensure a comfortable, pest-free living space. We utilize deep thermal fogging and chemical application to destroy bed bugs at all life stages.',
    price: 'Starting from NRS 3,500',
    features: [
      'Deep Mattress & Furniture Inspection',
      'Thermal Heat & Chemical Combination Treatment',
      'Eradication of Eggs, Nymphs & Adult Bed Bugs',
      'Follow-up Inspection Visit Included',
      'Odourless & Non-Staining Formula',
    ],
  },
  'bees-wasps-removal': {
    title: 'Bees & Wasps Removal',
    summary: 'Safe elimination of nests using professional methods, protecting homes and families from stings.',
    description: 'Bees and wasps removal ensures safe elimination of nests using professional methods, protecting homes and families from stings while preserving beneficial pollinators whenever possible.',
    price: 'Starting from NRS 3,000',
    features: [
      'Emergency Hive & Nest Removal',
      'Protective Equipment & Safe Extraction Methods',
      'Prevention of Nest Re-establishment',
      'Same-Day Service Availability in Kathmandu',
    ],
  },
  'antitermite-treatment': {
    title: 'Antitermite Treatment',
    summary: 'Protects structures by applying advanced chemical barriers to eliminate termites and prevent wood damage.',
    description: 'Antitermite treatment protects structures by applying advanced chemicals to eliminate termites, preventing severe damage to wood and ensuring long-lasting structural protection for homes and commercial buildings.',
    price: 'Starting from NRS 5,000',
    features: [
      'Pre & Post-Construction Subterranean Barrier',
      'Drill-Fill-Seal Soil Treatment Technology',
      '5-Year Anti-Termite Protection Warranty',
      'Eco-Friendly Non-Repellent Termiticides',
    ],
  },
  'rodent-control': {
    title: 'Rodent Control',
    summary: 'Identifying infestations, sealing entry points, and using traps or bait to safely remove rodents.',
    description: 'Rodent control involves identifying infestations, sealing entry points, and using traps or bait to safely remove rodents, safeguarding health and preventing property damage.',
    price: 'Starting from NRS 2,800',
    features: [
      'Entry Point Identification & Sealing',
      'Tamper-Resistant Bait Stations & Traps',
      'Sanitization of Infested Areas',
      'Preventive Rodent Proofing Guidance',
    ],
  },
  'mosquito-control': {
    title: 'Mosquito Control',
    summary: 'Reduces populations through larvicide application, fogging, and habitat management.',
    description: 'Mosquito control reduces populations through larvicide application, thermal fogging, and habitat management, minimizing the risk of mosquito-borne diseases like Dengue and Malaria.',
    price: 'Starting from NRS 2,200',
    features: [
      'Thermal Cold & Hot Outdoor Fogging',
      'Larvicidal Water Source Treatment',
      'Lawn & Shrub Mosquito Repellent Spray',
      'Seasonal Event Coverage Package',
    ],
  },
};

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = servicesMap[params.slug];
  if (!service) {
    return { title: 'Service Not Found | Revelation Pest Control' };
  }

  return {
    title: `${service.title} | Revelation Pest Control`,
    description: service.summary,
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

export default function ServiceDetailPage({ params }: Props) {
  const service = servicesMap[params.slug];

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
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-2xl font-extrabold text-white">Treatment Details & Process</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{service.description}</p>
          <div className="pt-2">
            <span className="inline-block px-4 py-2 bg-amber-950/80 border border-amber-800 text-amber-400 font-bold text-sm rounded-xl">
              {service.price}
            </span>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
            <span>Service Features & Guarantees</span>
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
            {service.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

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
