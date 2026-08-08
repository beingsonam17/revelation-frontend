import React from 'react';
import { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { HelpCircle, PhoneCall, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Revelation Pest Control',
  description: 'Find answers to common questions about pest control in Kathmandu Valley, pet safety, 24/7 emergency response, and treatment procedures.',
  alternates: {
    canonical: 'https://revelationpestcontrol.com/faq',
  },
};

export default function FAQPage() {
  const faqs = [
    {
      question: 'Which area of the city do you provide service?',
      answer: 'We cover the entire Kathmandu Valley, providing efficient and reliable pest control services to all areas within the region including Kathmandu, Lalitpur, and Bhaktapur.',
    },
    {
      question: 'How can I get in touch with you guys for service?',
      answer: 'You can get in touch with us by calling our 24/7 hotline (+977 9863847696) or by requesting an instant quote through the online booking form on our website.',
    },
    {
      question: 'Do you offer emergency pest control services?',
      answer: 'Yes, we offer 24/7 emergency pest control services to address urgent infestations quickly and efficiently, ensuring your home or business is protected.',
    },
    {
      question: 'Are your pest control treatments safe for pets and children?',
      answer: 'Absolutely! Our pest control treatments are eco-friendly and safe for both pets and children, ensuring a pest-free environment without compromising family safety.',
    },
    {
      question: 'How long do the treatments take?',
      answer: 'Treatment duration varies depending on the type of pest and the extent of infestation. Typically, treatments take 1 to 3 hours, with follow-up visits scheduled as needed.',
    },
    {
      question: 'Do you offer ongoing pest control maintenance?',
      answer: 'Yes, we offer regular maintenance plans (quarterly/annual) to ensure ongoing protection from pests year-round.',
    },
    {
      question: 'Can you provide same-day pest control services?',
      answer: 'Yes, we offer same-day pest control services depending on technician availability. Contact us as soon as possible for urgent dispatch.',
    },
    {
      question: 'How quickly can you remove a bee or wasp nest?',
      answer: 'We respond quickly to bee or wasp nest emergencies. Our team can safely and efficiently remove nests within hours to ensure your safety and prevent stings.',
    },
  ];

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <JsonLd data={jsonLdData} />
      <PublicHeader />

      {/* Header Banner */}
      <section className="py-20 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">Knowledge Base</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Everything you need to know about our treatment safety, emergency dispatch, and Kathmandu coverage.
          </p>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-lg hover:border-slate-700 transition"
            >
              <h3 className="text-lg font-bold text-white flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 pl-8 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="mt-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Still Have Questions?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Our customer support and technical experts are available 24 hours a day to answer your specific questions.
          </p>
          <a
            href="tel:+9779863847696"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-lg transition"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 24/7 Helpline (+977 9863847696)</span>
          </a>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
