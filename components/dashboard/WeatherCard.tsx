'use client';

import React from 'react';
import Link from 'next/link';
import { CloudSun, ArrowRight, CloudRain } from 'lucide-react';
import { DEFAULT_WEATHER } from '@/lib/mock-data';
import { WeatherData } from '@/types';

interface WeatherCardProps {
  weather?: WeatherData;
}

export function WeatherCard({ weather = DEFAULT_WEATHER }: WeatherCardProps) {
  const current = weather.current || weather;
  const rainfall24hMm = (weather as any)?.rainfall24hMm ?? (weather as any)?.precipitationMm ?? (current as any)?.precipitationMm;
  const sourceName = (weather as any)?.source || 'IMD / Open-Meteo';

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between text-left">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CloudSun className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Weather & Rainfall</h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">{weather.location || DEFAULT_WEATHER.location}</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {sourceName}
          </span>
        </div>

        {/* Main Temperature Display */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                {`${current.temperature}°C`}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-zinc-300 mt-0.5">
              {current.condition}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50/70 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-2xs">
            <CloudSun className="w-8 h-8" />
          </div>
        </div>

        {/* 3 Metric Grid: Humidity, Rain Chance, Wind */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Humidity
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
              {`${current.humidity}%`}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              {rainfall24hMm !== undefined && rainfall24hMm > 0 ? 'Rainfall (24h)' : 'Rain Chance'}
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
              {rainfall24hMm !== undefined && rainfall24hMm > 0 ? `${rainfall24hMm} mm` : `${current.rainChance}%`}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Wind
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
              {`${current.windSpeedKmH} km/h`}
            </p>
          </div>
        </div>

        {/* Rain alert pill */}
        <div className="mt-4 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 text-[11px] text-amber-900 dark:text-amber-300 flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            {rainfall24hMm !== undefined && rainfall24hMm > 0
              ? `${rainfall24hMm} mm natural precipitation recorded. Conserve irrigation.`
              : 'Rain forecasted within 36 hours. Avoid excess irrigation.'}
          </span>
        </div>
      </div>

      {/* Footer Link */}
      <Link
        href="/weather"
        className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center justify-between group"
      >
        <span>View full radar & 7-day forecast</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
