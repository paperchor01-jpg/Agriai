'use client';

import React from 'react';
import { CropEconomicsData } from '@/types';

interface CropEconomicsSectionProps {
  data: CropEconomicsData;
}

export function CropEconomicsSection({ data }: CropEconomicsSectionProps) {
  const isProfitable = data.profit.isProfitable;

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-7 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Crop Economics & Profit Projection
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Input cost breakdown & estimated financial return for {data.farmAcreage} Acre(s) of {data.cropName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-xl border text-center ${
            isProfitable
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300'
          }`}>
            <div className="text-xs font-bold">Estimated ROI: {data.profit.returnOnInvestmentPercent}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Cost Breakdown */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/60">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
            Estimated Production Costs
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
              <span>Seeds & Planting Material:</span>
              <span className="font-mono font-semibold">₹{data.costs.seeds.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
              <span>Fertilizers & Nutrients:</span>
              <span className="font-mono font-semibold">₹{data.costs.fertilizers.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
              <span>Pesticides & Biocontrol:</span>
              <span className="font-mono font-semibold">₹{data.costs.pesticides.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
              <span>Field Labor & Weeding:</span>
              <span className="font-mono font-semibold">₹{data.costs.labor.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
              <span>Irrigation Energy / Diesel:</span>
              <span className="font-mono font-semibold">₹{data.costs.irrigation.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
              <span>Tractor & Machinery Hire:</span>
              <span className="font-mono font-semibold">₹{data.costs.machinery.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between font-bold text-zinc-900 dark:text-zinc-100">
              <span>Total Input Cost:</span>
              <span className="font-mono text-sm text-rose-600 dark:text-rose-400">₹{data.costs.totalCost.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Expected Revenue */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/60">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
            Expected Revenue
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <div className="text-zinc-500 dark:text-zinc-400 mb-0.5">Projected Yield</div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                {data.revenue.expectedYieldQuintals} <span className="text-xs font-normal">Quintals</span>
              </div>
            </div>
            <div>
              <div className="text-zinc-500 dark:text-zinc-400 mb-0.5">Market Benchmark Rate</div>
              <div className="text-base font-semibold text-zinc-800 dark:text-zinc-200 font-mono">
                ₹{data.revenue.expectedPricePerQuintal.toLocaleString('en-IN')} / Quintal
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
              <div className="text-zinc-500 dark:text-zinc-400 mb-0.5">Gross Market Value</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{data.revenue.grossRevenue.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/50 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-2">
              Projected Net Margin
            </div>
            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 font-mono mb-2">
              ₹{data.profit.netProfit.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Net estimated farmer earnings after accounting for all input expenses across {data.farmAcreage} acre(s).
            </p>
          </div>

          <div className="pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 text-[11px] text-zinc-500 dark:text-zinc-400">
            * Estimates based on average seasonal yield and standard APMC rates.
          </div>
        </div>
      </div>
    </div>
  );
}
