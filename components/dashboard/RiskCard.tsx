'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Sun, Droplets, Bug, ShieldAlert, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { DEFAULT_FARM_RISKS } from '@/lib/mock-data';
import { FarmRiskItem } from '@/types';

interface RiskCardProps {
  risks?: FarmRiskItem[];
}

export function RiskCard({ risks = DEFAULT_FARM_RISKS }: RiskCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'disease':
        return AlertTriangle;
      case 'weather':
        return Sun;
      case 'water':
        return Droplets;
      case 'pest':
        return Bug;
      default:
        return ShieldAlert;
    }
  };

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between text-left">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Farm Risk Monitor</h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">4 Active Risk Vectors</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Low Overall
          </span>
        </div>

        {/* 4 Risk Categories */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {risks.map((risk) => {
            const Icon = getIcon(risk.type);
            const isWarning = risk.level.toLowerCase() === 'medium' || risk.level.toLowerCase() === 'high';

            return (
              <div
                key={risk.category}
                className={`p-3.5 rounded-xl border transition-all text-left ${
                  isWarning
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-800/50'
                    : 'bg-slate-50 dark:bg-zinc-800/50 border-slate-100 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isWarning
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge variant={isWarning ? 'warning' : 'success'} size="sm">
                    {risk.level}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">{risk.category}</h4>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-tight">{risk.status}</p>
                {risk.explanation && (
                  <p className="text-[9px] text-slate-400 dark:text-zinc-500 mt-1 line-clamp-1">
                    {risk.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Link */}
      <Link
        href="/weather"
        className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center justify-between group"
      >
        <span>View full weather & risk intelligence</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
