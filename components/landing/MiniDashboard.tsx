'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  CloudSun,
  Stethoscope,
  Droplets,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { HealthRing } from '@/components/ui/HealthRing';
import { Badge } from '@/components/ui/Badge';

export function MiniDashboard() {
  return (
    <div className="relative mx-auto max-w-6xl">
      {/* Background Soft Glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-amber-500/20 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

      {/* Main SaaS Mockup Window */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-slate-200/90 dark:border-zinc-800 shadow-2xl overflow-hidden text-left">
        {/* Top Window Chrome Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-50/90 dark:bg-zinc-800/80 border-b border-slate-200/80 dark:border-zinc-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-rose-400/90" />
              <div className="w-3 h-3 rounded-full bg-amber-400/90" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/90" />
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-300 hidden sm:inline ml-2">
              AgriAI Field Intelligence — Green Valley Farm (Ludhiana, Punjab)
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-300 sm:hidden ml-1">
              AgriAI Live Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/25 dark:border-emerald-800/60 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live AI Models Active
            </span>
          </div>
        </div>

        {/* Miniature Dashboard Cards Grid (5 Specified Sections) */}
        <div className="p-4 sm:p-6 lg:p-7 bg-slate-50/40 dark:bg-zinc-950/40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. CROP HEALTH */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        1. Crop Health
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">Multispectral status</p>
                    </div>
                  </div>
                  <Badge variant="success">Optimal</Badge>
                </div>

                <div className="py-4 flex items-center justify-around gap-2">
                  <HealthRing score={88} size="md" sublabel="Wheat HD-2967" />
                  <div className="space-y-1.5 text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">4.2 Acres Plot</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Loamy Alluvial Soil</p>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-950/60 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                      <span>NDRE Index: 0.78</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                <span>Canopy Vigour: High</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Scanned 2h ago</span>
              </div>
            </div>

            {/* 2. WEATHER */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
                      <CloudSun className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        2. Weather
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">Hyperlocal microclimate</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/20">
                    28°C Sunny
                  </span>
                </div>

                <div className="py-3 space-y-2.5">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60">
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400">Humidity</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-zinc-100">62%</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60">
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400">Wind</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-zinc-100">12 km/h</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60">
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400">Soil Moisture</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-zinc-100">44%</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200 font-medium leading-snug flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 text-sm leading-none">💧</span>
                    <span>Rain in 36h (70% prob). Hold scheduled sprinkler cycle.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                <span>Evapotranspiration: 4.1 mm</span>
                <span className="text-slate-600 dark:text-zinc-300 font-medium">Ludhiana Station</span>
              </div>
            </div>

            {/* 3. AI CROP DOCTOR */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        3. AI Crop Doctor
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">Vision leaf diagnostics</p>
                    </div>
                  </div>
                  <Badge variant="warning">Alert Found</Badge>
                </div>

                <div className="py-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">Identified Issue</span>
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/20">
                      Yellow Rust (Stage 2)
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-zinc-400">Diagnostic Confidence</span>
                      <span className="font-bold text-slate-800 dark:text-zinc-200">94%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-600 h-2 rounded-full w-[94%]" />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-300 bg-slate-50/80 dark:bg-zinc-800/60 p-2 rounded-lg border border-slate-200/60 dark:border-zinc-700/60 leading-tight">
                    <strong>Rx:</strong> Spray Propiconazole 25% EC (1ml/L) before rain event.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 dark:text-zinc-500 text-[11px]">Affected foliage: ~12%</span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  Ready to Treat
                </span>
              </div>
            </div>

            {/* 4. SMART ADVISORY */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between md:col-span-2 lg:col-span-2">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        4. Smart Advisory
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">Precision water & nutrient schedules</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-sky-800 dark:text-sky-300 bg-sky-500/10 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                    Saves 35% Water
                  </span>
                </div>

                <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-sky-500/10 dark:bg-sky-950/30 border border-sky-500/20 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 dark:text-sky-300">
                      <Droplets className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      <span>Next Drip Irrigation Cycle</span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 mt-1">Tomorrow @ 06:15 AM</p>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5">
                      Duration: 45 min • Target Zone 2 (Wheat Block)
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Nutrient Management</span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 mt-1">Urea Top-Dressing</p>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5">
                      Apply 25 kg/acre 4 days post-rain event
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                <span>Calculated for Loamy Alluvial soil retention</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Zero water wastage</span>
              </div>
            </div>

            {/* 5. YIELD PREDICTION */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        5. Yield Prediction
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">Machine learning forecast</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    +14.2% Gain
                  </span>
                </div>

                <div className="py-3 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100">3.2 Tons</p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">Projected per Acre (Wheat)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">2.9 – 3.4 t</p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500">95% Conf. Range</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-zinc-400 font-medium">Harvest Risk Score</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Low (8 / 100)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                <span>District Avg: 2.8 Tons/Acre</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200">Est. ₹72k/Acre</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Bar */}
        <div className="px-5 py-3 bg-white/90 dark:bg-zinc-900/90 border-t border-slate-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Real-Time Soil Data Connected
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Verified Agronomic Knowledgebase
            </span>
          </div>

          <Link
            href="/dashboard"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 group py-1"
          >
            <span>Open Interactive Demo Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
}
