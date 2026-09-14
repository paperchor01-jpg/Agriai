'use client';

import React from 'react';
import { Lightbulb, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FarmInsightsSectionProps {
  insights: string[];
  disclaimer: string;
}

export function FarmInsightsSection({ insights, disclaimer }: FarmInsightsSectionProps) {
  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs text-left">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              Farm Insights
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Agronomic conclusions synthesized from weekly telemetry
            </p>
          </div>
        </div>

        <Link
          href="/advisory"
          className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 group"
        >
          <span>Open Smart Advisory</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 flex items-start gap-3 hover:border-emerald-200 dark:hover:border-emerald-700 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 leading-relaxed">
              {insight}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-400 dark:text-zinc-500 font-medium">
        <span>{disclaimer}</span>
        <span>Updated just now</span>
      </div>
    </div>
  );
}
