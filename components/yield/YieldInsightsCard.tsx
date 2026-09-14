'use client';

import React from 'react';
import {
  Lightbulb,
  CheckCircle2,
  Info,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface YieldInsightsCardProps {
  insights: string[];
  actions: string[];
}

export function YieldInsightsCard({ insights, actions }: YieldInsightsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      {/* 1. What is influencing your yield? */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-zinc-800 mb-5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                What is influencing your yield?
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Key agronomic drivers detected across your farm
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-3 h-3" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 font-medium leading-relaxed">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs text-slate-400 dark:text-zinc-500 font-medium">
          Insights generated dynamically from farm telemetry & microclimate radar.
        </div>
      </div>

      {/* 2. Improvement Actions */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-zinc-800 mb-5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                Recommended Actions
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Field steps to reach the 3.1 tons maximum yield target
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {actions.map((action, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-emerald-950 dark:text-emerald-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            Need tailored field steps?
          </span>
          <Link
            href="/advisory"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 group"
          >
            <span>Open Smart Advisory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
