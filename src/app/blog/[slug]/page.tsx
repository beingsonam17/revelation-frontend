import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArrowLeft, Calendar, User, Clock, ShieldCheck } from 'lucide-react';

const postsMap: Record<string, { title: string; excerpt: string; content: string; date: string; author: string }> = {
  'complete-guide-pest-control-kathmandu': {
    title: 'Complete Guide to Pest Control in Kathmandu Valley',
    excerpt: 'Learn how to keep your home pest-free during rainy and summer seasons in Kathmandu Valley.',
    content: `
      <p className="mb-4">Pests can pose a significant challenge to homeowners across the Kathmandu Valley, particularly during the warm monsoon and summer months. High humidity and rainfall create optimal conditions for termites, mosquitoes, and rodents to thrive.</p>
      
      <h3 className="text-xl font-bold text-white mt-6 mb-3">1. Understanding Termite Threats</h3>
      <p className="mb-4">Subterranean termites are responsible for millions of rupees in structural timber damage annually. Chemical-barrier soil treatments around building foundations are essential to preventing subterranean entry.</p>

      <h3 className="text-xl font-bold text-white mt-6 mb-3">2. Bed Bug Infestation Prevention</h3>
      <p className="mb-4">Bed bugs travel easily via luggage and public transit. Regular deep cleaning, mattress inspections, and prompt thermal heat treatments eliminate bed bugs before they spread across rooms.</p>

      <h3 className="text-xl font-bold text-white mt-6 mb-3">3. Mosquito Vector Control</h3>
      <p className="mb-4">Eliminating standing water in flower pots, water storage tanks, and drainage gutters prevents mosquito breeding, significantly lowering Dengue risks.</p>
    `,
    date: '2026-07-24',
    author: 'Revelation Pest Control Team',
  },
};

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = postsMap[params.slug];
  if (!post) {
    return { title: 'Article Not Found | Revelation Pest Control' };
  }

  return {
    title: `${post.title} | Revelation Pest Control`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://revelationpestcontrol.com/blog/${params.slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://revelationpestcontrol.com/blog/${params.slug}`,
    },
  };
}

export default function SingleBlogPostPage({ params }: Props) {
  const post = postsMap[params.slug];

  if (!post) {
    notFound();
  }

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'Revelation Pest Control',
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <JsonLd data={jsonLdData} />
      <PublicHeader />

      {/* Header Banner */}
      <section className="py-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Knowledge Center
          </Link>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{post.title}</h1>
          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-500" /> {post.author}
            </span>
          </div>
        </div>
      </section>

      {/* Post Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8 flex-1">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 md:p-10 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-extrabold">Need Professional Pest Control?</h3>
            <p className="text-xs font-semibold text-slate-900">Get a free inspection quote for your home or business in Kathmandu.</p>
          </div>
          <Link
            href="/book-now"
            className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs rounded-xl shadow-xl transition shrink-0"
          >
            Get Free Quote
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
