'use client';

import React from 'react';
import { ShieldAlert, ArrowRight, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { DiseaseRiskPoint } from '@/lib/analytics-service';
import { Badge } from '@/components/ui/Badge';

interface DiseaseRiskTrendProps {
  data: DiseaseRiskPoint[];
}

export function DiseaseRiskTrend({ data }: DiseaseRiskTrendProps) {
  const getBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      case 'Low':
      default:
        return 'success';
    }
  };

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
              Pathogen Radar
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 mt-1">
            Disease Risk
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Foliar infection risk trend tracked over past 5 scouting periods
          </p>
        </div>

        <Badge variant="warning" size="sm">
          Current: Medium Risk
        </Badge>
      </div>

      {/* Visual Sequence Display: Low -> Medium -> Medium -> Low -> Medium */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 py-2">
        {data.map((item, index) => {
          const isLatest = index === data.length - 1;
          const isMedium = item.risk === 'Medium';
          const isLow = item.risk === 'Low';

          return (
            <div
              key={item.day}
              className={`p-3 sm:p-4 rounded-2xl border transition-all text-center flex flex-col justify-between ${
                isLatest
                  ? 'bg-amber-50/70 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700/60 shadow-2xs ring-2 ring-amber-400/20 dark:ring-amber-500/10'
                  : isMedium
                  ? 'bg-amber-50/40 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/40'
                  : 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/40'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                  {item.day}
                </span>

                <div className="w-8 h-8 mx-auto my-1 rounded-xl flex items-center justify-center bg-white dark:bg-zinc-800 shadow-2xs border border-slate-200/80 dark:border-zinc-700">
                  {isMedium ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>

                <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-zinc-100 mt-1">
                  {item.risk}
                </p>
              </div>

              {isLatest && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-600 text-white rounded-md mt-2 block">
                  TODAY
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Flow Summary */}
      <div className="mt-5 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-zinc-300">
        <div className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
          <span>Progression: <strong>Low → Medium → Medium → Low → Medium</strong></span>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
          Prototype telemetry — simulated for demonstration
        </span>
      </div>
    </div>
  );
}
