'use client';

import React from 'react';
import { IrrigationAdvisorData } from '@/types';

interface IrrigationAdvisorSectionProps {
  data: IrrigationAdvisorData;
  farmName?: string;
}

export function IrrigationAdvisorSection({ data, farmName }: IrrigationAdvisorSectionProps) {
  const isNeeded = data.status === 'Irrigation Needed';
  const isHold = data.status === 'High Moisture / Hold Off';

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-7 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💧</span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Smart Irrigation Advisor
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Precision water delivery based on real-time soil moisture & microclimate rain forecast
          </p>
        </div>
        <div>
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
              isNeeded
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                : isHold
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
            }`}
          >
            {data.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Soil Moisture */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/60">
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Root Zone Moisture</div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {data.soilMoisturePercent}%
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full ${
                data.soilMoisturePercent < 45
                  ? 'bg-rose-500'
                  : data.soilMoisturePercent > 75
                  ? 'bg-blue-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, data.soilMoisturePercent)}%` }}
            />
          </div>
        </div>

        {/* 48h Rain Forecast */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/60">
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Rain Expected (Next 48h)</div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            {data.rainExpectedNext48hMm} <span className="text-sm font-normal text-zinc-500">mm</span>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {data.rainExpectedNext48hMm > 10 ? 'Significant rain forecast' : 'Minimal / No rain expected'}
          </div>
        </div>

        {/* Water Stress Status */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/60">
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Crop Water Stress</div>
          <div className={`text-xl font-bold mb-1 ${
            data.waterStressLevel === 'High' ? 'text-rose-600 dark:text-rose-400' : data.waterStressLevel === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {data.waterStressLevel} Stress
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Timing: {data.timing}
          </div>
        </div>
      </div>

      {/* Advisory & Specific Method */}
      <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-800/50 rounded-xl p-4 mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 mb-1.5 flex items-center gap-1.5">
          <span>💧</span> Actionable Recommendation
        </h4>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
          {data.recommendation}
        </p>
        <div className="text-xs font-semibold text-blue-950 dark:text-blue-200 pt-2 border-t border-blue-200/60 dark:border-blue-800/60">
          {data.methodSpecificAdvice}
        </div>
      </div>

      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
        <span>💡</span>
        <span>{data.waterConservationTip}</span>
      </div>
    </div>
  );
}
