'use client';

import React from 'react';
import {
  Lightbulb,
  CloudRain,
  Eye,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { WeatherAdviceItem } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface WeatherAdviceProps {
  adviceList: WeatherAdviceItem[];
}

export function WeatherAdvice({ adviceList }: WeatherAdviceProps) {
  const getIcon = (type?: string) => {
    switch (type) {
      case 'irrigation':
        return CloudRain;
      case 'monitoring':
        return Eye;
      case 'disease':
        return AlertTriangle;
      default:
        return Lightbulb;
    }
  };

  const getBadgeVariant = (priority?: string) => {
    switch (priority) {
      case 'High':
        return 'warning';
      case 'Medium':
        return 'emerald';
      default:
        return 'info';
    }
  };

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs text-left">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              Farming Weather Advice
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Agronomic recommendations tuned to the forecasted microclimate
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
          Smart Advice
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {adviceList.map((item) => {
          const Icon = getIcon(item.type);
          const badgeVariant = getBadgeVariant(item.priority);

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/80 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge variant={badgeVariant} size="sm">
                    {item.priority || 'Normal'} Priority
                  </Badge>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-1">
                  {item.title}
                </h4>

                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200/60 dark:border-emerald-800/50 mt-2">
                  &ldquo;{item.advice}&rdquo;
                </p>

                {item.recommendation && (
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                    {item.recommendation}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Field action guidance active</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
