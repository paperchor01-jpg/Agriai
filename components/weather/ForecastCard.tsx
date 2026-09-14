'use client';

import React from 'react';
import { CloudSun, CloudRain, Sun, Cloud, Droplets } from 'lucide-react';
import { ForecastItem } from '@/types';

interface ForecastCardProps {
  forecast: ForecastItem[];
}

export function ForecastCard({ forecast }: ForecastCardProps) {
  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('shower')) {
      return <CloudRain className="w-6 h-6 text-sky-500" />;
    }
    if (cond.includes('cloudy') && !cond.includes('partly')) {
      return <Cloud className="w-6 h-6 text-slate-400" />;
    }
    if (cond.includes('partly')) {
      return <CloudSun className="w-6 h-6 text-amber-500" />;
    }
    return <Sun className="w-6 h-6 text-amber-500" />;
  };

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs text-left">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
            5-Day Microclimate Forecast
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Agro-meteorological outlook for planned farm field tasks</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
          5-Day Radar
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {forecast.slice(0, 5).map((item, index) => {
          const isToday = index === 0;
          const isTomorrow = index === 1;

          return (
            <div
              key={item.day}
              className={`p-4 rounded-2xl border transition-all text-center flex flex-col justify-between ${
                isToday
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300/80 dark:border-emerald-800/60 shadow-2xs'
                  : isTomorrow && item.rainChance >= 50
                  ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60 shadow-2xs'
                  : 'bg-slate-50/80 dark:bg-zinc-800/50 border-slate-200/70 dark:border-zinc-700/60 hover:bg-white dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                    {item.day}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-600 text-white rounded-md">
                      NOW
                    </span>
                  )}
                  {isTomorrow && item.rainChance >= 50 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-sky-600 text-white rounded-md">
                      RAIN
                    </span>
                  )}
                </div>

                <div className="my-3 flex justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-750 shadow-2xs flex items-center justify-center">
                    {getWeatherIcon(item.condition)}
                  </div>
                </div>

                <p className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                  {`${item.temperature}°C`}
                </p>

                <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400 mt-1 line-clamp-1">
                  {item.condition}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-sky-500" />
                  <span>Rain</span>
                </span>
                <span className={item.rainChance >= 50 ? 'text-sky-700 dark:text-sky-400 font-bold' : 'text-slate-700 dark:text-zinc-300'}>
                  {`${item.rainChance}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
