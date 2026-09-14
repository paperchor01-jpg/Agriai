'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Target, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface ExpectedYieldCardProps {
  current: number;
  range: string;
  min: number;
  max: number;
  unit: string;
}

export function ExpectedYieldCard({ current, range, min, max, unit }: ExpectedYieldCardProps) {
  // Compute percentage positions for progress bar [min * 0.9, max * 1.1]
  const domainMin = min * 0.92;
  const domainMax = max * 1.08;
  const span = domainMax - domainMin;
  const expectedPercent = Math.round(((current - domainMin) / span) * 100);

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs text-left flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                Harvest Forecast
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 mt-1">
              Expected Yield
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Deterministic yield bracket based on crop health and soil sensors
            </p>
          </div>

          <Badge variant="emerald" size="sm">
            82% Confidence
          </Badge>
        </div>

        {/* Highlight Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/60 mb-5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                Current estimate
              </span>
              <p className="text-4xl font-black text-emerald-950 dark:text-emerald-100 tracking-tight mt-0.5">
                {current} {unit}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
                Expected Range
              </span>
              <p className="text-base font-extrabold text-slate-800 dark:text-zinc-200 mt-0.5">
                {range}
              </p>
            </div>
          </div>

          {/* Simple Visual Range Track */}
          <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60">
            <div className="h-2.5 w-full bg-emerald-100/70 dark:bg-emerald-950/50 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${expectedPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 font-semibold mt-1.5">
              <span>Min: {min}t</span>
              <span className="text-emerald-800 dark:text-emerald-300 font-bold">Target: {current}t</span>
              <span>Max: {max}t</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-zinc-400">
          Integrated with AgriAI Yield Model v1.2
        </span>
        <Link
          href="/yield-prediction"
          className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 group"
        >
          <span>Full Yield Report</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
