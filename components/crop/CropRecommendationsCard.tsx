'use client';

import React, { useState } from 'react';
import { CropRecommendationResult } from '@/types';

interface CropRecommendationsCardProps {
  data: CropRecommendationResult;
}

export function CropRecommendationsCard({ data }: CropRecommendationsCardProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-7 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              AI Crop Suitability Recommendations
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Multi-factor agronomic analysis for {data.farmName} ({data.soilType} Soil, pH {data.soilPh}, {data.season} Season)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full">
            {data.topRecommendations.length} Suitable Crops
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {data.topRecommendations.map((crop, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={crop.cropName}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xs'
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="p-4.5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                        {crop.cropName}
                      </h3>
                      {crop.scientificName && (
                        <span className="text-xs italic text-zinc-400">({crop.scientificName})</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <span>Season: {crop.season}</span>
                      <span>•</span>
                      <span>Water: {crop.waterRequirement}</span>
                      <span>•</span>
                      <span>Yield: {crop.estimatedYieldRange}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <div className="text-xs text-zinc-400">AgriAI Score</div>
                    <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {crop.suitabilityScore} <span className="text-xs font-normal">/ 100</span>
                    </div>
                  </div>
                  <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm font-bold px-2">
                    {isExpanded ? '▲' : '▼'}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4.5 pb-4.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {/* Why this crop */}
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 rounded-xl p-3.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                        <span>✓</span> Why AgriAI Recommends This
                      </div>
                      <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                        {crop.whyFactors.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Risk Factors */}
                    <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 rounded-xl p-3.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                        <span>⚠</span> Risk Factors to Manage
                      </div>
                      <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                        {crop.riskFactors.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Best Practices */}
                  <div className="mt-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl p-3 border border-zinc-200/60 dark:border-zinc-700/60">
                    <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Recommended Best Practices:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {crop.recommendedPractices.map((prac, i) => (
                        <span key={i} className="text-[11px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-md text-zinc-700 dark:text-zinc-300">
                          {prac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
