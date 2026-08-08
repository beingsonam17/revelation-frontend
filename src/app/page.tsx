import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { RegularClientsSection } from '@/components/home/RegularClientsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  ShieldCheck,
  PhoneCall,
  Calendar,
  CheckCircle2,
  Bug,
  Home as HomeIcon,
  Shield,
  Wind,
  Rat,
  Award,
  Users,
  Clock,
  ArrowRight,
  Star,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Revelation Pest Control | Professional Pest Management in Kathmandu',
  description: 'Trusted 24/7 Pest Control Services in Kathmandu Valley. Residential & Commercial protection against Termites, Bed Bugs, Rodents, and Mosquitoes. Call +977 9863847696.',
  openGraph: {
    title: 'Revelation Pest Control - Have a Pest Control Your Way',
    description: 'Over 8 years of trusted, eco-friendly pest elimination in Kathmandu Valley.',
    url: 'https://revelationpestcontrol.com',
    type: 'website',
  },
  alternates: {
    canonical: 'https://revelationpestcontrol.com',
  },
};

export default function HomePage() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Revelation Pest Control',
    description: 'Professional pest control solutions for homes and businesses in Kathmandu Valley.',
    url: 'https://revelationpestcontrol.com',
    telephone: '+977 9863847696',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP',
    },
    areaServed: 'Kathmandu Valley',
    priceRange: '$$',
  };

  const services = [
    {
      title: 'Residential Pest Control',
      slug: 'residential-pest-control',
      summary: 'Manage and eliminate insects and rodents through effective treatments tailored to household needs.',
      icon: <HomeIcon className="w-7 h-7 text-amber-500" />,
      num: '01',
    },
    {
      title: 'Bed Bug Treatment',
      slug: 'bed-bug-treatment',
      summary: 'Thorough inspection and targeted elimination using non-toxic methods to ensure a comfortable space.',
      icon: <Bug className="w-7 h-7 text-amber-500" />,
      num: '02',
    },
    {
      title: 'Bees & Wasps Removal',
      slug: 'bees-wasps-removal',
      summary: 'Safe elimination of nests using professional methods, protecting families while preserving pollinators.',
      icon: <Shield className="w-7 h-7 text-amber-500" />,
      num: '03',
    },
    {
      title: 'Antitermite Treatment',
      slug: 'antitermite-treatment',
      summary: 'Protects structural integrity by applying advanced chemical barriers to eliminate termites.',
      icon: <ShieldCheck className="w-7 h-7 text-amber-500" />,
      num: '04',
    },
    {
      title: 'Rodent Control',
      slug: 'rodent-control',
      summary: 'Identifying infestations, sealing entry points, and using humane traps to safely remove rodents.',
      icon: <Rat className="w-7 h-7 text-amber-500" />,
      num: '05',
    },
    {
      title: 'Mosquito Control',
      slug: 'mosquito-control',
      summary: 'Larvicide application and thermal fogging to reduce populations and disease risks.',
      icon: <Wind className="w-7 h-7 text-amber-500" />,
      num: '06',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <JsonLd data={jsonLdData} />
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>24/7 Emergency Pest Control Service</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight text-white">
            Have a Pest Control <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Your Way</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            For over 8 years, we’ve delivered trusted, high-quality pest control services across Kathmandu Valley, building strong relationships through dedication and guaranteed customer satisfaction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/book-now"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-base shadow-xl transition transform hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5" />
              <span>Get a Free Quote</span>
            </Link>

            <a
              href="tel:+9779863847696"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-amber-400 font-extrabold text-base transition"
            >
              <PhoneCall className="w-5 h-5 text-amber-500 animate-bounce" />
              <span>Emergency Call: +977 9863847696</span>
            </a>
          </div>
        </div>
      </section>

      {/* About Highlights */}
      <section className="py-20 bg-slate-900/60 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">About Us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              We Are Professional Pest Control Experts
            </h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              We specialize in providing reliable and effective pest control solutions for homes and businesses. With a focus on safety and customer satisfaction, our expert team ensures long-lasting protection against pests. From inspections to treatments, we deliver tailored services to keep your property pest-free and comfortable all year round.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-2xl font-extrabold text-amber-500">8+ Years</p>
                <p className="text-xs text-slate-400">Industry Experience</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-2xl font-extrabold text-amber-500">100% Safe</p>
                <p className="text-xs text-slate-400">Eco & Pet Friendly</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-amber-950/40 border border-slate-800 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-amber-500" />
              <span>Why Homeowners Trust Us</span>
            </h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span><strong>Kathmandu Valley Coverage:</strong> Complete service coverage across all areas of Kathmandu, Lalitpur, and Bhaktapur.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span><strong>24/7 Rapid Emergency Response:</strong> Immediate dispatch for urgent bed bug, bee, or termite emergencies.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span><strong>Child & Pet Safe Formula:</strong> Non-toxic, eco-certified chemical treatments ensuring family safety.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">Our Services</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">Available for 24/7 Emergency Service</h2>
          <p className="text-sm text-slate-400">Tailored treatment plans designed for homes, offices, and commercial establishments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div
              key={s.slug}
              className="group bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6 hover:border-amber-500/50 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-slate-700 group-hover:text-amber-500 transition">
                    {s.num}.
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white group-hover:text-amber-400 transition">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {s.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                >
                  <span>Learn More & Pricing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Regular Corporate Clients Section */}
      <RegularClientsSection />

      {/* Customer Testimonials & Reviews Section */}
      <TestimonialsSection />

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-950">Got a Pest Emergency Right Now?</h2>
            <p className="text-sm font-semibold text-slate-900">
              Our technicians are on standby 24/7 to clear your property immediately.
            </p>
          </div>
          <Link
            href="/book-now"
            className="px-8 py-4 bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-sm rounded-2xl shadow-2xl transition shrink-0"
          >
            Get Instant Quote
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
