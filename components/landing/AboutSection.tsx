'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, CheckCircle2, ArrowRight, Users, Smartphone, Droplets, TrendingUp } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Context & Mission */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/25 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Problem Statement SIH25010</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight leading-tight">
            Democratizing Precision Agronomy for Small & Marginal Farmers
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed">
            In India, over 86% of farmers cultivate less than 2 hectares. While commercial precision agriculture exists, it relies on prohibitively expensive drone mapping, IoT sensor arrays, and subscription software.
          </p>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
            <strong>AgriAI (SIH25010)</strong> changes this paradigm. By bridging state-of-the-art computer vision models with open weather APIs and ICAR agronomic research, we deliver enterprise-grade crop diagnostics and dynamic irrigation scheduling directly to basic smartphones — zero hardware required.
          </p>

          {/* Core Commitments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800 flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">100% Smartphone Ready</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Operates flawlessly on entry-level Android devices and intermittent 2G/3G networks.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800 flex items-start gap-3">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">Farmer-First Simplicity</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Designed with high-contrast visuals, minimal text clutter, and clear dosage instructions.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
            >
              <span>Explore the working prototype</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Column: Impact Metric Cards */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800 shadow-xs text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
              <Droplets className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">35%</p>
            <p className="text-xs font-bold text-slate-700 dark:text-zinc-300 mt-1">Water Saved</p>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Via real-time evapotranspiration and rain forecasting.
            </p>
          </div>

          <div className="p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800 shadow-xs text-left">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">94%</p>
            <p className="text-xs font-bold text-slate-700 dark:text-zinc-300 mt-1">Diagnosis Accuracy</p>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Deep vision models trained on thousands of plant pathogen images.
            </p>
          </div>

          <div className="p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800 shadow-xs text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">+22%</p>
            <p className="text-xs font-bold text-slate-700 dark:text-zinc-300 mt-1">Yield Improvement</p>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Achieved through timely nutrient and disease intervention.
            </p>
          </div>

          <div className="p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800 shadow-xs text-left">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">₹0</p>
            <p className="text-xs font-bold text-slate-700 dark:text-zinc-300 mt-1">Hardware Cost</p>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Works directly with standard mobile devices in the farmer&apos;s hands.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
