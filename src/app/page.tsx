"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Building2, Link as LinkIcon, CheckCircle2, BookmarkPlus, Loader2 } from 'lucide-react';

export default function Home() {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [ecosystemContext, setEcosystemContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    setResult(null);
    setSaved(false);
    setErrorMsg('');

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: name, companyUrl: url, companyCategory: category, ecosystemContext }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setErrorMsg(data.error || 'Failed to generate research. Please try again.');
      }
    } catch (error) {
      console.error('Research failed', error);
      setErrorMsg('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
      }
    } catch (error) {
      console.error('Save failed', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full mt-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-zinc-900">
          Condense by <span className="text-gradient">Zeliot</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-500 leading-relaxed max-w-2xl mx-auto">
          Instantly research target companies and generate tailored GTM strategies and synergy maps to accelerate your partnerships.
        </p>
      </motion.div>

      {/* Main Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="glow-effect rounded-2xl">
          <form onSubmit={handleResearch} className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-violet-400" />
              Add a Partner
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Company Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="w-5 h-5 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Palantir"
                    className="w-full bg-white border border-black/10 rounded-xl py-3 pl-11 pr-4 text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Website URL (optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LinkIcon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="e.g. acme.com"
                    className="w-full bg-white border border-black/10 rounded-xl py-3 pl-11 pr-4 text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Category</label>
                <div className="relative">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Data Analytics"
                    className="w-full bg-white border border-black/10 rounded-xl py-3 px-4 text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Ecosystem Context (optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={ecosystemContext}
                    onChange={(e) => setEcosystemContext(e.target.value)}
                    placeholder="e.g. Confluent partner via Kafka integration"
                    className="w-full bg-white border border-black/10 rounded-xl py-3 px-4 text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-zinc-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setName(''); setUrl(''); setCategory(''); setEcosystemContext(''); setResult(null); }}
                className="btn-secondary flex-1 py-4 rounded-xl font-bold text-lg transition-all border border-black/10 hover:border-black/30 bg-white hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !name}
                className="btn-primary flex-[2] py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing...</>
                ) : (
                  <>Add Partner <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-start gap-2">
                <div className="w-5 h-5 shrink-0 mt-0.5">⚠️</div>
                <p>{errorMsg}</p>
              </div>
            )}
          </form>
        </div>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-4xl mt-12 mb-20 overflow-hidden"
          >
            <div className="glass-panel border border-violet-500/30 rounded-3xl p-8 relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-black/10 pb-6 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100 mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Intelligence Generated
                  </div>
                  <h2 className="text-3xl font-bold text-zinc-900">{result.name}</h2>
                  {result.url && (
                    <a href={result.url.startsWith('http') ? result.url : `https://${result.url}`} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900 transition-colors mt-1 flex items-center gap-1.5 text-sm">
                      <LinkIcon className="w-4 h-4" /> {result.url}
                    </a>
                  )}
                </div>

                <div className="flex shrink-0">
                  <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-sm ${saved
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-white hover:bg-zinc-50 text-zinc-900 border border-black/10 hover:border-black/20'
                      }`}
                  >
                    {saving ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                    ) : saved ? (
                      <><CheckCircle2 className="w-5 h-5" /> Saved to Dashboard</>
                    ) : (
                      <><BookmarkPlus className="w-5 h-5" /> Save Partner</>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                    PARTNERSHIP OVERVIEW
                  </h3>
                  <ul className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm space-y-4">
                    {result.overview.split('\n').filter(Boolean).map((line: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                        <span className="text-zinc-600 leading-relaxed group-hover:text-zinc-900 transition-colors">{line.replace(/^[-*•]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold tracking-widest text-[#8b5cf6] uppercase">
                    APPROACH STRATEGY FOR CONDENSE
                  </h3>
                  <ul className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm space-y-4">
                    {result.strategy.split('\n').filter(Boolean).map((line: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-zinc-600 leading-relaxed group-hover:text-zinc-900 transition-colors">{line.replace(/^[-*•]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {result.gtmStrategy && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-xs font-bold tracking-widest text-[#10b981] uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> GTM STRATEGY
                  </h3>
                  <ul className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
                    {result.gtmStrategy.split('\n').filter(Boolean).map((line: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <div className="w-2 h-2 rounded-full bg-[#10b981] shrink-0 mt-2"></div>
                        <span className="text-zinc-600 leading-relaxed group-hover:text-zinc-900 transition-colors">{line.replace(/^[-*•]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
