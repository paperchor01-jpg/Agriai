'use client';

import React from 'react';
import { Activity, Droplets, ShieldAlert, TrendingUp } from 'lucide-react';
import { FarmAnalyticsData } from '@/lib/analytics-service';
import { Badge } from '@/components/ui/Badge';

interface AnalyticsOverviewProps {
  analytics: FarmAnalyticsData;
}

export function AnalyticsOverview({ analytics }: AnalyticsOverviewProps) {
  const { summary } = analytics;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
      {/* 1. Crop Health */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <Badge variant="success" size="sm">
            Optimal
          </Badge>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
            Crop Health
          </span>
          <p className="text-3xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-0.5">
            {`${summary.cropHealth}%`}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            +4% over last 7 days
          </p>
        </div>
      </div>

      {/* 2. Water Usage */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between hover:border-sky-300 dark:hover:border-sky-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <Badge variant="info" size="sm">
            Weekly Total
          </Badge>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
            Water Usage
          </span>
          <p className="text-3xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-0.5">
            {summary.waterUsageTotalLiters}
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold mt-1">
            Across active drip lines
          </p>
        </div>
      </div>

      {/* 3. Disease Risk */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <Badge variant="warning" size="sm">
            Active Watch
          </Badge>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
            Disease Risk
          </span>
          <p className="text-3xl font-black text-amber-900 dark:text-amber-200 tracking-tight mt-0.5">
            {summary.diseaseRisk}
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mt-1">
            Foliar rust monitoring active
          </p>
        </div>
      </div>

      {/* 4. Expected Yield */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <Badge variant="emerald" size="sm">
            Target
          </Badge>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
            Expected Yield
          </span>
          <p className="text-3xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-0.5">
            {summary.expectedYield}
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold mt-1">
            Range: 2.5 – 3.1 tons
          </p>
        </div>
      </div>
    </div>
  );
}
