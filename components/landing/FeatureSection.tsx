'use client';

import React from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  Sparkles,
  CloudSun,
  Activity,
  TrendingUp,
  BarChart3,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface FeatureCardProps {
  number: string;
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  badge: string;
  href: string;
}

const features: FeatureCardProps[] = [
  {
    number: '01',
    title: 'AI Crop Doctor',
    category: 'Computer Vision Diagnosis',
    description:
      'Instant disease, pest, and nutrient deficiency detection from smartphone leaf photos with 94%+ diagnostic precision, stage severity rating, and verified agronomic remedies.',
    icon: Stethoscope,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 border-emerald-100',
    badge: 'Vision AI',
    href: '/crop-doctor',
  },
  {
    number: '02',
    title: 'Smart Advisory',
    category: 'Dynamic Agronomy Engine',
    description:
      'Personalized irrigation and fertilizer recommendations tailored to your crop variety, plot soil type, and exact vegetative stage, preventing overwatering and nutrient runoff.',
    icon: Sparkles,
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-50 border-sky-100',
    badge: 'Dynamic Scheduling',
    href: '/advisory',
  },
  {
    number: '03',
    title: 'Weather Intelligence',
    category: 'Hyperlocal Microclimate',
    description:
      '7-day field-level rainfall forecasts, temperature thresholds, humidity trends, and timely warnings for unseasonal rains or heatwaves so you can protect vulnerable crops.',
    icon: CloudSun,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50 border-amber-100',
    badge: '7-Day Radar',
    href: '/weather',
  },
  {
    number: '04',
    title: 'Crop Health Monitoring',
    category: 'Vegetative Vigor Index',
    description:
      'Continuous health scoring and moisture stress monitoring that highlights unseen root or nitrogen stress days before visible foliage yellowing or wilting occurs.',
    icon: Activity,
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50 border-teal-100',
    badge: 'Continuous Monitoring',
    href: '/dashboard',
  },
  {
    number: '05',
    title: 'Yield Prediction',
    category: 'Predictive Harvest Models',
    description:
      'Forecast harvest tonnage and grain quality weeks in advance using machine learning trained on regional weather, historical crop performance, and biomass health curves.',
    icon: TrendingUp,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50 border-indigo-100',
    badge: 'Machine Learning',
    href: '/analytics',
  },
  {
    number: '06',
    title: 'Farm Analytics',
    category: 'Resource & Cost Ledger',
    description:
      'Unified acreage ledger tracking seed expenditures, fertilizer consumption, water savings, and projected revenue per acre to maximize farmer profitability.',
    icon: BarChart3,
    iconColor: 'text-emerald-700',
    iconBg: 'bg-emerald-50 border-emerald-100',
    badge: 'Farm Intelligence',
    href: '/analytics',
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/25 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
          Precision Agriculture for Every Farm
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed">
          Comprehensive, accessible tools engineered specifically for smallholder growers — eliminating guesswork, reducing input costs, and safeguarding harvest yields.
        </p>
      </div>

      {/* 6 Feature Cards Grid */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.number}
              className="relative p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group text-left"
            >
              <div>
                {/* Card Top: Icon & Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs transition-transform duration-200 group-hover:scale-105 ${item.iconBg} ${item.iconColor}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-700 tracking-wide">
                    {item.badge}
                  </span>
                </div>

                {/* Number & Category */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {item.number}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Card Footer Link */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <Link
                  href={item.href}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 flex items-center gap-1.5"
                >
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500">Zero Hardware Needed</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
