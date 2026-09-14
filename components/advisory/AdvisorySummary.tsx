'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { AdvisoryItem } from '@/types';

interface AdvisorySummaryProps {
  advisories: AdvisoryItem[];
  farmName: string;
}

export function AdvisorySummary({ advisories, farmName }: AdvisorySummaryProps) {
  const highCount = advisories.filter((a) => a.priority === 'High').length;
  const mediumCount = advisories.filter((a) => a.priority === 'Medium').length;
  const lowCount = advisories.filter((a) => a.priority === 'Low').length;

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100 dark:border-zinc-800 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              Active Agronomic Synthesis
            </span>
            <span className="text-xs text-slate-400 dark:text-zinc-500">•</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-300">{farmName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight mt-1.5">
            Today&apos;s Recommendations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
            {advisories.length} {advisories.length === 1 ? 'Action' : 'Actions'} Recommended based on real-time soil, crop stage & microclimate weather
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Rule-Based Advisory v2.1</span>
          </span>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* High Priority */}
        <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 text-left">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              High Priority
            </span>
            <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-900 dark:text-rose-100 mt-1">
            {highCount}
          </p>
          <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5 font-medium">
            Requires immediate attention
          </p>
        </div>

        {/* Medium Priority */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-left">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Medium Priority
            </span>
            <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-900 dark:text-amber-100 mt-1">
            {mediumCount}
          </p>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 font-medium">
            Plan within 24–48 hours
          </p>
        </div>

        {/* Low Priority */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 text-left">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Low Priority
            </span>
            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-900 dark:text-emerald-100 mt-1">
            {lowCount}
          </p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 font-medium">
            Routine maintenance & care
          </p>
        </div>
      </div>
    </div>
  );
}
