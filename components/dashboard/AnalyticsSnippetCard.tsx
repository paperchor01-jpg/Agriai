'use client';

import React from 'react';
import Link from 'next/link';
import { LineChart, ArrowRight, Activity, Droplets, ShieldAlert, TrendingUp } from 'lucide-react';
import { FarmAnalyticsData } from '@/lib/analytics-service';

interface AnalyticsSnippetCardProps {
  analytics?: FarmAnalyticsData;
}

export function AnalyticsSnippetCard({ analytics }: AnalyticsSnippetCardProps) {
  const cropHealth = analytics?.summary.cropHealth ?? 87;
  const waterUsage = analytics?.summary.waterUsageTotalLiters ?? '1,240 L';
  const diseaseRisk = analytics?.summary.diseaseRisk ?? 'Medium';
  const expectedYield = analytics?.summary.expectedYield ?? '2.8 tons';

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between text-left">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <LineChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Farm Analytics</h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Weekly Health & Water Telemetry</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Live
          </span>
        </div>

        {/* 4 Mini Metric Cards */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-0.5">
              <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Crop Health</span>
            </div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-zinc-100">{cropHealth}%</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-0.5">
              <Droplets className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span>Water Usage</span>
            </div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-zinc-100">{waterUsage}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-0.5">
              <ShieldAlert className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Disease Risk</span>
            </div>
            <p className="text-lg font-extrabold text-amber-900 dark:text-amber-300">{diseaseRisk}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Yield Forecast</span>
            </div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-zinc-100">{expectedYield}</p>
          </div>
        </div>
      </div>

      <Link
        href="/analytics"
        className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center justify-between group cursor-pointer"
      >
        <span>View Analytics</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
