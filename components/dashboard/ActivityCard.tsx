'use client';

import React from 'react';
import { Clock, Stethoscope, CloudSun, Sprout, CheckCircle2 } from 'lucide-react';
import { DEFAULT_ACTIVITIES } from '@/lib/mock-data';

export function ActivityCard() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'crop':
        return Stethoscope;
      case 'weather':
        return CloudSun;
      case 'farm':
      default:
        return Sprout;
    }
  };

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between text-left">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Recent Activity</h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Timeline of farm operations</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
            Audit Log
          </span>
        </div>

        {/* Timeline Items */}
        <div className="mt-5 space-y-4 text-left">
          {DEFAULT_ACTIVITIES.map((act, index) => {
            const Icon = getIcon(act.type);
            const isLast = index === DEFAULT_ACTIVITIES.length - 1;

            return (
              <div key={act.id} className="relative flex items-start gap-3.5">
                {/* Connecting Line */}
                {!isLast && (
                  <div className="absolute left-4 top-7 bottom-0 w-0.5 bg-slate-200/80 dark:bg-zinc-800 -mb-2" />
                )}

                {/* Dot / Icon Container */}
                <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                      {act.title}
                    </p>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 shrink-0">
                      {act.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Green Valley Farm • Ludhiana
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Synchronized to cloud
        </span>
        <span className="font-semibold text-slate-700 dark:text-zinc-300">Auto-logging active</span>
      </div>
    </div>
  );
}
