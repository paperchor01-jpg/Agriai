'use client';

import React from 'react';
import {
  Activity,
  Sprout,
  Droplets,
  CloudSun,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { YieldContributingFactor } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface ContributingFactorsCardProps {
  factors: YieldContributingFactor[];
}

export function ContributingFactorsCard({ factors }: ContributingFactorsCardProps) {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Activity':
        return Activity;
      case 'Sprout':
        return Sprout;
      case 'Droplets':
        return Droplets;
      case 'CloudSun':
        return CloudSun;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'CheckCircle2':
      default:
        return CheckCircle2;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Positive':
        return <Badge variant="success" size="sm">Positive</Badge>;
      case 'Watch':
        return <Badge variant="warning" size="sm">Watch</Badge>;
      case 'Negative':
      default:
        return <Badge variant="danger" size="sm">Negative</Badge>;
    }
  };

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs text-left">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
            Contributing Factors
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Telemetry variables driving the yield prediction model
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
          6 Variables
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {factors.map((factor) => {
          const Icon = getIcon(factor.iconName);
          const isPositive = factor.status === 'Positive';
          const isWatch = factor.status === 'Watch';

          return (
            <div
              key={factor.name}
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                isPositive
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200/70 dark:border-emerald-800/50 hover:bg-emerald-50/70'
                  : isWatch
                  ? 'bg-amber-50/40 dark:bg-amber-950/30 border-amber-200/70 dark:border-amber-800/50 hover:bg-amber-50/70'
                  : 'bg-rose-50/40 dark:bg-rose-950/30 border-rose-200/70 dark:border-rose-800/50 hover:bg-rose-50/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isPositive
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                        : isWatch
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {getStatusBadge(factor.status)}
                </div>

                <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                  {factor.name}
                </span>
                <p className="text-base font-extrabold text-slate-900 dark:text-zinc-100 mt-0.5">
                  {factor.value}
                </p>

                {factor.detail && (
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                    {factor.detail}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                <span>Model Impact</span>
                <span
                  className={
                    factor.impact.startsWith('+')
                      ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                      : factor.impact.startsWith('-')
                      ? 'text-rose-700 dark:text-rose-400 font-bold'
                      : 'text-slate-600 dark:text-zinc-400'
                  }
                >
                  {factor.impact}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
