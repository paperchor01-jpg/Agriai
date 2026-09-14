'use client';

import React from 'react';
import { MandiPriceItem } from '@/types';

interface MarketWatchSectionProps {
  data: MandiPriceItem;
}

export function MarketWatchSection({ data }: MarketWatchSectionProps) {
  const isAboveMsp = data.msp > 0 && data.modalPrice >= data.msp;

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-7 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📈</span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Mandi Market Watch & Price Intelligence
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            APMC Mandi price benchmarks for {data.crop} in {data.district}, {data.state}
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full border border-zinc-200 dark:border-zinc-700">
            Benchmark Date: {data.date}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Modal Price */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-4">
          <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Modal Trade Price</div>
          <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-1">
            ₹{data.modalPrice}
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400">
            per Quintal (100 kg)
          </div>
        </div>

        {/* Min / Max Range */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 rounded-xl p-4">
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Trading Range</div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            ₹{data.minPrice} – ₹{data.maxPrice}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Min to Max Mandi bids
          </div>
        </div>

        {/* Official MSP */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 rounded-xl p-4">
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Govt. MSP Floor</div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            {data.msp > 0 ? `₹${data.msp}` : 'No Central MSP'}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {data.msp > 0 ? (isAboveMsp ? '✓ Trading above MSP' : '⚠ Below MSP floor') : 'Commercial vegetable'}
          </div>
        </div>

        {/* Mandi Committee */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 rounded-xl p-4">
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Nearest Mandi</div>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1 truncate">
            {data.marketName}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            APMC Yard, {data.district}
          </div>
        </div>
      </div>

      {/* Honest Disclaimer Banner */}
      <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/50 rounded-xl p-3.5 flex items-start gap-2.5">
        <span className="text-base">ℹ️</span>
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong className="font-semibold">Honest Market Intelligence:</strong> {data.disclaimer}
        </div>
      </div>
    </div>
  );
}
