'use client';

import React from 'react';
import { CropCalendarData } from '@/types';

interface CropCalendarSectionProps {
  data: CropCalendarData;
}

export function CropCalendarSection({ data }: CropCalendarSectionProps) {
  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-7 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Crop Calendar & Lifecycle
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Tracking {data.cropName} ({data.variety}) — Planted on {data.plantingDate} (Day {data.daysElapsed} of ~{data.totalDurationDays})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Est. Harvest</div>
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              {data.estimatedHarvestDate}
            </div>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{data.progressPercentage}%</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Lifecycle</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 mb-8 overflow-hidden">
        <div
          className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${data.progressPercentage}%` }}
        />
      </div>

      {/* Stages Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {data.stages.map((stage) => {
          const isCurrent = stage.isCurrent;
          const isDone = stage.isCompleted;

          return (
            <div
              key={stage.order}
              className={`rounded-xl border p-3.5 transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                  : isDone
                  ? 'bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 opacity-75'
                  : 'bg-zinc-50/30 dark:bg-zinc-900/20 border-zinc-200/60 dark:border-zinc-800/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                    Stage {stage.order}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isCurrent
                        ? 'bg-emerald-600 text-white'
                        : isDone
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isCurrent ? 'ACTIVE' : isDone ? 'DONE' : `Day ${stage.startDay}-${stage.endDay}`}
                  </span>
                </div>

                <h3 className={`text-xs font-bold mb-1.5 ${isCurrent ? 'text-emerald-900 dark:text-emerald-200' : 'text-zinc-800 dark:text-zinc-200'}`}>
                  {stage.stageName}
                </h3>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-tight mb-3">
                  {stage.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-[11px]">
                <div className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Key Action:</div>
                <div className="text-zinc-600 dark:text-zinc-400 leading-tight">
                  • {stage.keyTasks[0]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
