import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pest Control Blog & Articles | Revelation Pest Control',
  description: 'Read expert advice, tips, and guides on termite prevention, bed bug elimination, and mosquito control in Kathmandu Valley.',
  alternates: {
    canonical: 'https://revelationpestcontrol.com/blog',
  },
};

export default function BlogIndexPage() {
  const posts = [
    {
      title: 'Complete Guide to Pest Control in Kathmandu Valley',
      slug: 'complete-guide-pest-control-kathmandu',
      excerpt: 'Learn how to keep your home pest-free during rainy and summer seasons in Kathmandu Valley.',
      date: '2026-07-24',
      category: 'Prevention Tips',
    },
  ];

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Revelation Pest Control Blog',
    url: 'https://revelationpestcontrol.com/blog',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <JsonLd data={jsonLdData} />
      <PublicHeader />

      {/* Header Banner */}
      <section className="py-20 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">Pest Prevention Insights</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Knowledge Center & Blog</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Articles and expert guidance to protect your family and property from pests.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-amber-500/40 transition shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-400 font-bold border border-amber-800">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    {post.date}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white hover:text-amber-400 transition">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" />
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
