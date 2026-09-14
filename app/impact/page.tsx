'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Award,
  Sparkles,
  Droplets,
  ShieldCheck,
  Sprout,
  Activity,
  Calculator,
  CheckCircle2,
  Info,
  Clock,
  Layers,
  ArrowRight,
  Database,
  BarChart3,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { getImpactDashboardData } from '@/lib/impact-service';
import { ImpactDashboardData } from '@/types';

export default function ImpactPage() {
  const [data, setData] = useState<ImpactDashboardData | null>(null);
  const [calculatorAcres, setCalculatorAcres] = useState<number>(4.2);

  useEffect(() => {
    setData(getImpactDashboardData());
  }, []);

  // Calculated estimates based on user acreage input
  const estimatedWaterSavedLiters = Math.round(calculatorAcres * 48000 * 0.21);
  const estimatedCostSavedRupees = Math.round(calculatorAcres * 4150);
  const estimatedPumpingHoursSaved = Math.round(calculatorAcres * 14.5);

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto text-left">
        {/* 1. Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                    Impact & Evidence
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    SIH25010 Validation
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Actual prototype telemetry metrics and field trial impact evaluation models.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs self-start sm:self-auto text-xs font-semibold text-slate-600 dark:text-zinc-300">
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Prototype Version: <strong className="text-slate-900 dark:text-zinc-100">v1.0 (Hardened)</strong></span>
          </div>
        </div>

        {/* 2. SECTION 1: ACTUAL PROTOTYPE METRICS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Actual Prototype Metrics (Measured)
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Verified telemetry and computational benchmarks derived directly from live database state.
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-200/60 dark:border-emerald-800 hidden sm:inline">
              ✓ Verified Live Telemetry
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {data?.actualMetrics.map((m) => (
              <div
                key={m.id}
                className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 dark:border-zinc-800 shadow-2xs space-y-1.5 text-left"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block truncate">
                  {m.label}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
                    {m.value}
                  </span>
                  {m.unit && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">{m.unit}</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-tight line-clamp-2">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. INTERACTIVE IMPACT ESTIMATOR CALCULATOR */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-emerald-800/40 backdrop-blur-md">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight">
                    Interactive Seasonal Impact Calculator
                  </h3>
                  <p className="text-xs text-emerald-200/70">
                    Simulate water conservation and economic benefit for small and marginal holdings.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                <span className="text-xs text-emerald-200">Plot Size:</span>
                <input
                  type="number"
                  min={0.5}
                  max={500}
                  step={0.5}
                  value={calculatorAcres}
                  onChange={(e) => setCalculatorAcres(Math.max(0.5, Number(e.target.value) || 1))}
                  className="w-16 bg-white/20 text-white font-bold text-xs text-center py-1 rounded-lg border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
                />
                <span className="text-xs font-semibold">Acres</span>
              </div>
            </div>

            {/* Impact Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                  <Droplets className="w-4 h-4" />
                  <span>Groundwater Conserved</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  ~{estimatedWaterSavedLiters.toLocaleString()} <span className="text-sm font-normal text-emerald-200">Liters</span>
                </div>
                <p className="text-[11px] text-emerald-100/70 leading-tight">
                  By pausing pump cycles 24h prior to verified rainfall forecasts.
                </p>
              </div>

              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                  <TrendingUp className="w-4 h-4" />
                  <span>Estimated Input Cost Saved</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  ₹{estimatedCostSavedRupees.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-100/70 leading-tight">
                  Optimized split-dose nitrogen timing and targeted pest sanitation.
                </p>
              </div>

              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300">
                  <Clock className="w-4 h-4" />
                  <span>Pumping Energy Saved</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  ~{estimatedPumpingHoursSaved} <span className="text-sm font-normal text-emerald-200">Hours</span>
                </div>
                <p className="text-[11px] text-emerald-100/70 leading-tight">
                  Reduced electricity load and diesel pump wear-and-tear.
                </p>
              </div>
            </div>

            <p className="text-[10px] text-emerald-200/60 italic text-right">
              * Calculations use Punjab Agricultural University (PAU) wheat water duty and ICAR cost baselines.
            </p>
          </div>
        </div>

        {/* 4. SECTION 2: PROJECTED IMPACT & FIELD VALIDATION ROADMAP */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Projected Impact & Field Validation Roadmap
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Scientific projections to be rigorously validated through multi-season agricultural trials.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data?.projectedImpact.map((item) => (
              <div
                key={item.id}
                className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                      {item.statusText}
                    </span>
                    <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800">
                      {item.estimate}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-100">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {item.rationale}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-500 dark:text-zinc-400 bg-slate-50/60 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <span className="font-bold text-slate-700 dark:text-zinc-300 block text-[10px] uppercase tracking-wider mb-0.5">
                    Baseline Comparison:
                  </span>
                  {item.baselineComparison}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Hackathon Submission Notes & Disclaimer */}
        <div className="p-4 rounded-2xl glass-card bg-slate-100/80 dark:bg-zinc-800/60 backdrop-blur-md border border-slate-200/80 dark:border-zinc-700/80 text-xs text-slate-600 dark:text-zinc-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
            <Info className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
            <span>Smart India Hackathon (SIH25010) Evidence Statement</span>
          </div>
          <p className="leading-relaxed text-[11px] text-slate-600 dark:text-zinc-400">
            AgriAI prototype metrics represent real telemetry processed by the application engine. Economic and environmental projections are derived from published ICAR / state agricultural extension standards and are designated for validation through formal field trials in partnership with local Krishi Vigyan Kendras (KVKs).
          </p>
        </div>
      </div>
    </AppShell>
  );
}
