'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Target } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { YieldPredictionResult } from '@/types';

interface YieldSnippetCardProps {
  prediction?: YieldPredictionResult;
}

export function YieldSnippetCard({ prediction }: YieldSnippetCardProps) {
  const predictedYield = prediction?.predictedYield ?? 2.8;
  const minimumYield = prediction?.minimumYield ?? 2.5;
  const maximumYield = prediction?.maximumYield ?? 3.1;
  const confidence = prediction?.confidence ?? 82;

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between text-left">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Yield Prediction</h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Prototype Harvest Estimate</p>
            </div>
          </div>
          <Badge variant="emerald" size="sm">
            {confidence}% Confidence
          </Badge>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Expected Production
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                {predictedYield} tons
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold mt-1">
              Expected range: <strong className="text-slate-800 dark:text-zinc-200">{minimumYield} – {maximumYield} tons</strong>
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xs">
            <Target className="w-7 h-7" />
          </div>
        </div>

        <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-[11px] text-slate-600 dark:text-zinc-400">
          Based on 87% crop health, loamy soil pH 6.8 & favorable microclimate.
        </div>
      </div>

      <Link
        href="/yield-prediction"
        className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center justify-between group cursor-pointer"
      >
        <span>View Prediction</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
