'use client';

import React from 'react';
import { useGetClientsQuery } from '@/store/api/testimonialsApi';
import { Building2, Hotel, Utensils, Stethoscope, ShieldCheck, CheckCircle2 } from 'lucide-react';

const fallbackClients = [
  {
    id: '1',
    name: 'Kathmandu Boutique Hotel',
    category: 'Hospitality',
    description: 'Heritage hotel in Thamel under quarterly pest management contract.',
    icon: Hotel,
  },
  {
    id: '2',
    name: 'Himalayan Food Court & Bakery',
    category: 'Food & Beverage',
    description: 'Premier restaurant chain maintaining 100% hygiene compliance.',
    icon: Utensils,
  },
  {
    id: '3',
    name: 'Apex Healthcare Center',
    category: 'Healthcare',
    description: 'Sterile, chemical-safe pest management for clinical environments.',
    icon: Stethoscope,
  },
  {
    id: '4',
    name: 'Central Commercial Plaza',
    category: 'Corporate Office',
    description: 'Multi-story commercial complex in New Baneshwor.',
    icon: Building2,
  },
];

export const RegularClientsSection: React.FC = () => {
  const { data: clientsData = [] } = useGetClientsQuery();
  const clients = clientsData.length > 0 ? clientsData : fallbackClients;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hospitality':
        return <Hotel className="w-6 h-6 text-amber-400" />;
      case 'food & beverage':
        return <Utensils className="w-6 h-6 text-amber-400" />;
      case 'healthcare':
        return <Stethoscope className="w-6 h-6 text-amber-400" />;
      default:
        return <Building2 className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section className="py-20 bg-slate-900 border-t border-b border-slate-800/80 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Trusted Commercial Partners</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our Regular & Corporate Clients
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            We provide scheduled, long-term pest management contracts to leading hotels, healthcare centers, restaurants, and commercial complexes across Nepal.
          </p>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {clients.map((client: any) => (
            <div
              key={client.id}
              className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-amber-500/50 hover:bg-slate-950 transition duration-300 group shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition">
                    {getCategoryIcon(client.category)}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Verified Client
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{client.category}</span>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition mt-0.5">
                    {client.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {client.description || 'Regular contract holder maintaining pest-free commercial operations.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Contract Active</span>
                <span className="text-emerald-400 font-semibold">100% Protected</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
