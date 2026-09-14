'use client';

import React from 'react';
import Link from 'next/link';
import { Stethoscope, Plus, Sparkles, CloudSun, ArrowRight } from 'lucide-react';

export function QuickAction() {
  const actions = [
    {
      title: 'Analyze Crop',
      subtitle: 'Diagnose disease or pests',
      href: '/crop-doctor',
      icon: Stethoscope,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      buttonBg: 'hover:border-emerald-400 dark:hover:border-emerald-700 hover:shadow-xs',
      badge: 'AI Doctor',
    },
    {
      title: 'Add Farm',
      subtitle: 'Register new plot',
      href: '/farms',
      icon: Plus,
      iconBg: 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700',
      buttonBg: 'hover:border-slate-400 dark:hover:border-zinc-600 hover:shadow-xs',
      badge: 'Manage',
    },
    {
      title: 'Smart Advisory',
      subtitle: 'Water & fertilizer timing',
      href: '/advisory',
      icon: Sparkles,
      iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      buttonBg: 'hover:border-amber-400 dark:hover:border-amber-700 hover:shadow-xs',
      badge: 'Agronomy',
    },
    {
      title: 'Weather',
      subtitle: '7-day rain & wind radar',
      href: '/weather',
      icon: CloudSun,
      iconBg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      buttonBg: 'hover:border-sky-400 dark:hover:border-sky-700 hover:shadow-xs',
      badge: 'Radar',
    },
  ];

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs text-left">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
            Quick Actions
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Instant shortcuts to core farmer tools</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className={`p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-150 flex flex-col justify-between text-left group ${action.buttonBg}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${action.iconBg} group-hover:scale-105 transition-transform duration-150`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400">
                    {action.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {action.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug">
                  {action.subtitle}
                </p>
              </div>

              <div className="mt-4 flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                <span>Launch</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
