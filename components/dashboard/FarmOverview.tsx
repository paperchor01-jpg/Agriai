'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Sprout, ArrowRight, ShieldCheck, Layers, Droplets } from 'lucide-react';
import { HealthRing } from '@/components/ui/HealthRing';
import { Badge } from '@/components/ui/Badge';
import { Farm } from '@/types';

interface FarmOverviewProps {
  farm: Farm;
}

export function FarmOverview({ farm }: FarmOverviewProps) {
  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-sm transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
              {farm.name}
            </h2>
            <Badge variant="success" size="sm">
              Status: {farm.status}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
            <span>{farm.location}</span>
            <span className="text-slate-300 dark:text-zinc-600">•</span>
            <span className="font-semibold text-slate-700 dark:text-zinc-300">{farm.areaAcres} acres</span>
          </p>
        </div>

        <Link
          href="/farms"
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors self-start sm:self-auto py-1"
        >
          <span>View Farm Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Grid: Health Ring + Key Parameters */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Circular Health Ring Display */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-slate-50/80 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-800 text-center">
          <HealthRing score={farm.healthScore} size="lg" sublabel={`${farm.healthScore}%`} />
          <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 mt-2">
            Crop Health: {farm.healthScore}%
          </span>
          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">
            Optimal Growth Condition
          </span>
        </div>

        {/* 4 Detail Specification Cards */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-left">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Current Crop
            </span>
            <p className="text-base font-extrabold text-slate-900 dark:text-zinc-100 mt-0.5">
              {typeof farm.crop === 'object' && farm.crop ? farm.crop.name : (farm.crop || 'Wheat')}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              {typeof farm.crop === 'object' && farm.crop?.stage ? `${farm.crop.stage} Stage` : 'Flowering Stage'} (Active)
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-left">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Soil Type
            </span>
            <p className="text-base font-extrabold text-slate-900 dark:text-zinc-100 mt-0.5">
              {farm.soil?.soilType || farm.soilType || 'Loamy'} Soil
            </p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              Optimal {farm.soil?.ph ? `pH ${farm.soil.ph}` : 'pH 6.8'} & Aeration
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-left">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Cultivated Area
            </span>
            <p className="text-base font-extrabold text-slate-900 dark:text-zinc-100 mt-0.5">
              {farm.areaAcres} acres
            </p>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">100% Active Sowing</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-left">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Health Status
            </span>
            <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{farm.status}</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">Low Overall Vulnerability</p>
          </div>
        </div>
      </div>
    </div>
  );
}
