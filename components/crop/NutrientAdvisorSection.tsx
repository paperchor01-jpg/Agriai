'use client';

import React from 'react';
import { NutrientAdvisorData } from '@/types';

interface NutrientAdvisorSectionProps {
  data: NutrientAdvisorData;
  cropName?: string;
}

export function NutrientAdvisorSection({ data, cropName = "Crop" }: NutrientAdvisorSectionProps) {
  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-7 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧪</span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Nutrient & Soil Health Advisor
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Customized N-P-K & organic fertilization regimen for {cropName}
          </p>
        </div>
        <div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              data.hasSoilTest
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
            }`}
          >
            {data.hasSoilTest ? '✓ Verified Soil Test Data' : '⚠ Estimated Baseline — Test Recommended'}
          </span>
        </div>
      </div>

      {/* Soil pH & Primary Macro-Nutrients */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Soil pH */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Soil pH</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              {data.phStatus}
            </span>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            {data.soilPh}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Optimal range: 6.2 - 7.5
          </div>
        </div>

        {/* Nitrogen */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Nitrogen (N)</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              data.nitrogen.level === 'Low' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
            }`}>
              {data.nitrogen.level}
            </span>
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-tight">
            {data.nitrogen.recommendation}
          </div>
        </div>

        {/* Phosphorus */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Phosphorus (P)</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              data.phosphorus.level === 'Low' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
            }`}>
              {data.phosphorus.level}
            </span>
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-tight">
            {data.phosphorus.recommendation}
          </div>
        </div>

        {/* Potassium */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Potassium (K)</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              data.potassium.level === 'Low' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
            }`}>
              {data.potassium.level}
            </span>
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-tight">
            {data.potassium.recommendation}
          </div>
        </div>
      </div>

      {/* Fertilizer & Organic Solutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-200/70 dark:border-zinc-800">
        <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/50 rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
            <span>🌱</span> Key Mineral Recommendations
          </h4>
          <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/50 rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
            <span>🌿</span> Organic & Bio-Fertilizer Alternatives
          </h4>
          <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
            {data.organicAlternatives.map((org, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span>{org}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-zinc-400 dark:text-zinc-500 italic text-center">
        {data.disclaimer}
      </div>
    </div>
  );
}
