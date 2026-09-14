'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sprout, ShieldCheck } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-8 sm:p-12 lg:p-16 overflow-hidden text-center shadow-2xl border border-slate-800">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
            <Sprout className="w-3.5 h-3.5" />
            <span>Start Optimizing Your Yields Today</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2]">
            Make Every Farming Decision Smarter.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get personalized crop health insights, disease detection, irrigation recommendations, and farm intelligence — all in one simple platform.
          </p>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 text-base font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-800 active:scale-98 text-white border border-slate-700 text-base font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Demo</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Free Demo Access
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Zero Sensor Setup Needed
            </span>
          </div>

          <p className="text-[11px] text-slate-400/80 pt-2">
            Demo Credentials: <span className="text-slate-300 font-mono">farmer@agriai.demo</span> / <span className="text-slate-300 font-mono">demo123</span>
          </p>
        </div>
      </div>
    </section>
  );
}
