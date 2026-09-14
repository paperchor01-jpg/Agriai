'use client';

import React from 'react';
import { Sprout, Camera, Stethoscope, Sparkles, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Add Your Farm',
    subtitle: 'Setup in 30 seconds',
    description:
      'Enter your farm location, acreage, soil type, and sown crop variety. No complex mapping or hardware installation required.',
    icon: Sprout,
    highlight: 'Zero hardware setup',
  },
  {
    step: '02',
    title: 'Upload Crop Image',
    subtitle: 'Snap with any smartphone',
    description:
      'Photograph diseased leaves, wilted stems, or anomalous crop patches directly from your phone camera while in the field.',
    icon: Camera,
    highlight: 'Works on basic mobile cameras',
  },
  {
    step: '03',
    title: 'AI Analyzes Your Crop',
    subtitle: 'Instant vision intelligence',
    description:
      'Neural vision models examine symptoms against thousands of crop pathology records, identifying diseases with 94%+ precision.',
    icon: Stethoscope,
    highlight: '94%+ diagnostic accuracy',
  },
  {
    step: '04',
    title: 'Get Actionable Recommendations',
    subtitle: 'Clear, step-by-step guidance',
    description:
      'Receive localized spray dosages, drip irrigation timings, fertilizer schedules, and preventive measures calibrated to your soil.',
    icon: Sparkles,
    highlight: 'Saves water & input costs',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-100/50 dark:bg-zinc-950/40 border-y border-slate-200/80 dark:border-zinc-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20 dark:border-emerald-800/60 backdrop-blur-xs">
            Simple 4-Step Process
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            How AgriAI Empowers Farmers
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed">
            Designed from the ground up for practical field use by small and marginal farmers — simple, fast, and highly reliable.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200 text-left flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/20 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-2xl font-black text-slate-200 dark:text-zinc-800 group-hover:text-emerald-500/30 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Step {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 dark:text-zinc-500 mt-0.5">
                    {item.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-3.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
