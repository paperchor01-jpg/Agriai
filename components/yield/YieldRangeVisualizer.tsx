'use client';

import React from 'react';
import { Target } from 'lucide-react';
import { YieldPredictionResult } from '@/types';

interface YieldRangeVisualizerProps {
  prediction: YieldPredictionResult;
}

export function YieldRangeVisualizer({ prediction }: YieldRangeVisualizerProps) {
  const { minimumYield, predictedYield, maximumYield, unit } = prediction;

  // Calculate percentage positions across the range [min * 0.9, max * 1.1]
  const domainMin = minimumYield * 0.92;
  const domainMax = maximumYield * 1.08;
  const domainSpan = domainMax - domainMin;

  const minPercent = Math.round(((minimumYield - domainMin) / domainSpan) * 100);
  const expectedPercent = Math.round(((predictedYield - domainMin) / domainSpan) * 100);
  const maxPercent = Math.round(((maximumYield - domainMin) / domainSpan) * 100);

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-zinc-800 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              Yield Bracket Radar
            </span>
            <span className="text-xs text-slate-400 dark:text-zinc-500">•</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-300">Deterministic Model</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 mt-1">
            Yield Range Projection
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Estimated production trajectory from minimum baseline to optimal upper bound
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-300 self-start sm:self-auto">
          <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Expected: <strong>{predictedYield} {unit}</strong></span>
        </div>
      </div>

      {/* 3 Range Anchor Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {/* Minimum */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/80 text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
            Minimum
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-700 dark:text-zinc-200 mt-0.5">
            {minimumYield} <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">{unit}</span>
          </p>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1">
            Baseline threshold
          </p>
        </div>

        {/* Expected (Highlight) */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/70 text-left shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
              Expected
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-emerald-100 mt-0.5">
            {predictedYield} <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{unit}</span>
          </p>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
            Target projection
          </p>
        </div>

        {/* Maximum */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/80 text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
            Maximum
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-700 dark:text-zinc-200 mt-0.5">
            {maximumYield} <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">{unit}</span>
          </p>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1">
            Optimal conditions
          </p>
        </div>
      </div>

      {/* Visual Range Bar */}
      <div className="relative pt-4 pb-3 px-2">
        {/* Track */}
        <div className="h-3 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden relative border border-slate-200/80 dark:border-zinc-700">
          {/* Active Range Gradient */}
          <div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-slate-300 via-emerald-500 to-teal-400 rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
        </div>

        {/* Target Pointer on Bar */}
        <div
          className="absolute -top-1 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{ left: `${expectedPercent}%` }}
        >
          <div className="w-5 h-5 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 bg-white dark:bg-zinc-900 px-1.5 py-0.2 rounded-md shadow-2xs border border-emerald-200 dark:border-emerald-800 mt-1">
            {predictedYield}t
          </span>
        </div>
      </div>

      {/* Axis Labels */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-zinc-500 pt-2 border-t border-slate-100 dark:border-zinc-800">
        <span>Minimum: {minimumYield} tons</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">Expected: {predictedYield} tons</span>
        <span>Maximum: {maximumYield} tons</span>
      </div>
    </div>
  );
}
