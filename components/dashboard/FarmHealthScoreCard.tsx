'use client';

import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  CloudSun,
  Sprout,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { FarmHealthScoreResult } from '@/types';
import Link from 'next/link';

interface FarmHealthScoreCardProps {
  healthResult: FarmHealthScoreResult;
  farmName?: string;
}

export function FarmHealthScoreCard({ healthResult, farmName }: FarmHealthScoreCardProps) {
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const toggleAction = (id: string) => {
    setCompletedActions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { score, status, factors, topActionsToday } = healthResult;

  const getStatusBadgeColor = (st: string) => {
    switch (st) {
      case 'Healthy':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Attention Needed':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Under Stress':
      default:
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
  };

  const getScoreColor = (sc: number) => {
    if (sc >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (sc >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getProgressBarColor = (sc: number) => {
    if (sc >= 80) return 'bg-emerald-500';
    if (sc >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const factorList = [
    { key: 'soil', label: 'Soil condition', factor: factors.soilCondition, icon: Sprout },
    { key: 'weather', label: 'Weather', factor: factors.weather, icon: CloudSun },
    { key: 'water', label: 'Water availability', factor: factors.waterAvailability, icon: Droplets },
    { key: 'pest', label: 'Pest risk', factor: factors.pestRisk, icon: ShieldCheck },
    { key: 'nutrients', label: 'Nutrient condition', factor: factors.nutrientCondition, icon: Sparkles },
  ];

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800/80 shadow-sm text-left relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                AgriAI Farm Health Score
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                {farmName ? `Plot Telemetry: ${farmName}` : 'AI-assisted farm risk indicator'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(status)}`}>
            Status: {status}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium hidden sm:inline">
            Updated {healthResult.calculatedAt}
          </span>
        </div>
      </div>

      {/* Main Grid: Score Gauge & Component Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Big Score Dial (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50/80 dark:bg-zinc-800/50 rounded-2xl p-5 border border-slate-100 dark:border-zinc-800">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
              Overall Farm Health
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl sm:text-5xl font-black tracking-tight ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-xl font-bold text-slate-400 dark:text-zinc-500">/ 100</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed pt-1">
              Transparent composite indicator synthesizing soil pH, moisture tension, microclimate forecasts, and vision pest scouting.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
            <span>Model: <strong>Rule-based telemetry</strong></span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Live evaluation</span>
          </div>
        </div>

        {/* Right Column: Major Contributing Factors (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-1">
            Major Contributing Factors
          </span>

          <div className="space-y-2.5">
            {factorList.map(({ key, label, factor, icon: Icon }) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                    <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                    <span>{label}</span>
                  </div>
                  <span className={`font-bold ${getScoreColor(factor.score)}`}>
                    {factor.score}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(factor.score)}`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP ACTIONS TODAY SECTION */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Top Actions Today
            </span>
            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Prioritized
            </span>
          </div>
          <Link
            href="/advisory"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 group"
          >
            <span>View All Advisories</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topActionsToday.map((item, idx) => {
            const isDone = !!completedActions[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleAction(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isDone
                    ? 'bg-slate-50 dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-800 opacity-60'
                    : item.priority === 'High'
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-800/50 hover:border-rose-300'
                    : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/50 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-black w-5 h-5 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-700 dark:text-zinc-300">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {item.timing}
                    </span>
                  </div>
                  <p className={`text-xs font-bold leading-tight ${isDone ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-900 dark:text-zinc-100'}`}>
                    {item.action}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.reason}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-zinc-800 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-400 dark:text-zinc-500">{item.category}</span>
                  <span className={`font-bold flex items-center gap-1 ${isDone ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500 hover:text-emerald-700'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isDone ? 'Done' : 'Mark'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
