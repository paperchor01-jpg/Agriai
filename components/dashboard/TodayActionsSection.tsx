'use client';

import React, { useState } from 'react';
import { TodayActionItem } from '@/types';
import { i18nService } from '@/lib/i18n-service';

interface TodayActionsSectionProps {
  actions: TodayActionItem[];
  farmName?: string;
}

export function TodayActionsSection({ actions, farmName }: TodayActionsSectionProps) {
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});

  const toggleCompleted = (id: string) => {
    setCompletedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const title = i18nService.t('today.title');
  const subtitle = i18nService.t('today.subtitle');

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <section className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-7 shadow-sm mb-8 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{title}</h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {farmName ? `Personalized for ${farmName} — ` : ''}{subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-full">
            {actions.filter(a => completedIds[a.id]).length} / {actions.length} Completed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((act) => {
          const isDone = completedIds[act.id];
          const isHigh = act.priority === 'HIGH';
          const isMedium = act.priority === 'MEDIUM';

          return (
            <div
              key={act.id}
              className={`relative rounded-xl border p-4.5 transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 opacity-60'
                  : isHigh
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/50 hover:border-rose-300 shadow-xs'
                  : isMedium
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 hover:border-amber-300 shadow-xs'
                  : 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isHigh
                          ? 'bg-rose-500 text-white'
                          : isMedium
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {act.priority}
                    </span>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {act.category}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleCompleted(act.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md transition-colors bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    title={isDone ? "Mark as Pending" : "Mark as Completed"}
                  >
                    <input
                      type="checkbox"
                      checked={!!isDone}
                      onChange={() => toggleCompleted(act.id)}
                      className="cursor-pointer accent-emerald-600 rounded"
                    />
                    <span>{isDone ? 'Done' : 'Complete'}</span>
                  </button>
                </div>

                <h3 className={`font-semibold text-base mb-1.5 ${isDone ? 'line-through text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                  {act.action}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
                  {act.reason}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                  <span>⏱ {act.timeframe}</span>
                </div>
                <div className="text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                  {act.relevantData}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
