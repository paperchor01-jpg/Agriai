'use client';

import React, { useState } from 'react';
import { GovSchemeItem } from '@/types';

interface GovernmentSchemesSectionProps {
  schemes: GovSchemeItem[];
}

export function GovernmentSchemesSection({ schemes }: GovernmentSchemesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Income Support', 'Insurance', 'Soil & Inputs', 'Irrigation', 'Mechanization', 'Credit'];

  const filteredSchemes = selectedCategory === 'All'
    ? schemes
    : schemes.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-7 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛</span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Government Schemes & Direct Subsidies
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Central & State agricultural welfare initiatives available for Indian farmers
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/40 dark:bg-zinc-900/30 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {scheme.category}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {scheme.officialPortal}
                </span>
              </div>

              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                {scheme.shortName}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2.5">
                {scheme.name}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
                {scheme.description}
              </p>

              <div className="space-y-2 text-xs pt-3 border-t border-zinc-200/70 dark:border-zinc-800">
                <div>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Eligibility: </span>
                  <span className="text-zinc-600 dark:text-zinc-400">{scheme.eligibility}</span>
                </div>
                <div>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">Benefits: </span>
                  <span className="text-zinc-600 dark:text-zinc-400">{scheme.benefits}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2">
              <a
                href={scheme.howToApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors"
              >
                <span>Visit Official Portal</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
