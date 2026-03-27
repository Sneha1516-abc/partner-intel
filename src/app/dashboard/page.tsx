"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Calendar, Link as LinkIcon, ArrowRight, X, Sparkles } from 'lucide-react';
import Link from 'next/link';

type Partner = {
  id: number;
  name: string;
  url: string;
  category: string;
  ecosystemContext: string;
  overview: string;
  strategy: string;
  synergy: string;
  gtmStrategy: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const res = await fetch('/api/partners');
        const data = await res.json();
        if (data.success) {
          setPartners(data.partners);
        }
      } catch (error) {
        console.error('Failed to fetch partners:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPartners();
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto py-10 px-6 w-full relative z-0">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-zinc-900">Partner Dashboard</h1>
            <p className="text-zinc-500">View and manage your researched partnerships.</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-black/10 text-zinc-900 transition-all font-medium shadow-sm"
          >
            Research New Partner <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white border border-black/10 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white rounded-3xl border border-dashed border-black/20 shadow-sm">
            <Building2 className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-zinc-900">No partners yet</h3>
            <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
              You haven't researched and saved any partners yet. Head back to the research tool to get started.
            </p>
            <Link href="/" className="btn-primary inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium">
              Start Researching
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={partner.id}
                onClick={() => setSelectedPartner(partner)}
                className="cursor-pointer glass-panel rounded-2xl p-6 flex flex-col h-full hover:border-[#8b5cf6]/50 transition-colors group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight group-hover:text-violet-600 transition-colors text-zinc-900">{partner.name}</h3>
                      {partner.category && (
                        <span className="px-2 py-0.5 mt-1 inline-block bg-zinc-100 rounded border border-zinc-200 text-[10px] font-mono tracking-wide text-zinc-600 uppercase">
                          {partner.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-6">
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-[#8b5cf6] uppercase mb-2">Partnership Overview</h4>
                    <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed">
                      {(partner.overview || partner.strategy).replace(/^[-*•]\s*/gm, '')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">Approach Strategy</h4>
                    <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed">
                      {partner.strategy.replace(/^[-*•]\s*/gm, '')}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(partner.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </div>
                  <span className="text-xs text-violet-500 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Report <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedPartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPartner(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-5xl my-8 rounded-3xl p-8 border border-black/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative"
            >
              <button
                onClick={() => setSelectedPartner(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-8 pb-8 border-b border-black/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/10 to-blue-500/10 shadow-[0_0_20px_rgba(139,92,246,0.1)] border border-violet-500/20 flex items-center justify-center text-violet-500 shrink-0">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900">{selectedPartner.name}</h2>
                  {selectedPartner.category && (
                    <span className="px-3 py-1 mt-2 inline-block bg-zinc-100 rounded border border-zinc-200 text-xs font-mono tracking-wide text-zinc-600 uppercase">
                      {selectedPartner.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <h3 className="text-xs font-bold tracking-widest text-[#8b5cf6] uppercase mb-4">
                    PARTNERSHIP OVERVIEW
                  </h3>
                  <ul className="bg-zinc-50 rounded-2xl p-6 border border-black/5 space-y-4 max-w-none shadow-sm">
                    {(selectedPartner.overview || selectedPartner.strategy).split('\n').filter(Boolean).map((line: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <div className="w-2 h-2 rounded-full bg-violet-500 shrink-0 mt-2"></div>
                        <span className="text-zinc-600 leading-relaxed group-hover:text-zinc-900 transition-colors">{line.replace(/^[-*•]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-4">
                    APPROACH STRATEGY FOR CONDENSE
                  </h3>
                  <ul className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 space-y-4 max-w-none shadow-sm">
                    {selectedPartner.strategy.split('\n').filter(Boolean).map((line: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2"></div>
                        <span className="text-zinc-600 leading-relaxed group-hover:text-zinc-900 transition-colors">{line.replace(/^[-*•]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedPartner.gtmStrategy && (
                <div className="mt-8 pt-8 border-t border-black/5">
                  <h3 className="text-xs font-bold tracking-widest text-[#10b981] uppercase mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> GTM STRATEGY
                  </h3>
                  <ul className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 space-y-4 max-w-none shadow-sm">
                    {selectedPartner.gtmStrategy.split('\n').filter(Boolean).map((line: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <div className="w-2 h-2 rounded-full bg-[#10b981] shrink-0 mt-2"></div>
                        <span className="text-zinc-600 leading-relaxed group-hover:text-zinc-900 transition-colors">{line.replace(/^[-*•]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
