'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Droplets,
  Sprout,
  AlertTriangle,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Activity,
  Database,
  HelpCircle,
} from 'lucide-react';
import { AdvisoryItem } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface AdvisoryCardProps {
  advisory: AdvisoryItem;
  isHero?: boolean;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
}

export function AdvisoryCard({
  advisory,
  isHero = false,
  isCompleted = false,
  onToggleComplete,
}: AdvisoryCardProps) {
  const [showExplainability, setShowExplainability] = useState(isHero);

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('irrigation')) {
      return <Droplets className="w-4 h-4 text-sky-600" />;
    }
    if (cat.includes('disease')) {
      return <AlertTriangle className="w-4 h-4 text-rose-600" />;
    }
    if (cat.includes('nutrient')) {
      return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
    return <Sprout className="w-4 h-4 text-emerald-600" />;
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      case 'Low':
      default:
        return 'success';
    }
  };

  const explain = advisory.explainability;
  const suitabilityScore = explain?.suitabilityScore ?? (advisory.priority === 'High' ? 88 : advisory.priority === 'Medium' ? 82 : 90);

  if (isHero) {
    return (
      <div
        className={`rounded-3xl p-6 sm:p-8 border transition-all duration-200 text-left relative overflow-hidden ${
          isCompleted
            ? 'glass-card bg-slate-50/80 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800 opacity-75'
            : 'glass-card bg-gradient-to-br from-white/90 via-amber-50/40 to-emerald-50/40 dark:from-zinc-900/90 dark:via-amber-950/20 dark:to-emerald-950/20 backdrop-blur-md border-amber-300 dark:border-amber-700/60 shadow-md ring-2 ring-amber-400/20 dark:ring-amber-500/10'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              Highest Priority Action
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300">
              {getCategoryIcon(advisory.category)}
              <span>{advisory.category}</span>
            </span>
            <Badge variant={getPriorityBadgeVariant(advisory.priority)} size="sm">
              {advisory.priority} Priority
            </Badge>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              AgriAI suitability score: {suitabilityScore}%
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xs px-3 py-1 rounded-xl border border-slate-200 dark:border-zinc-700 self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Timing: <strong>{advisory.timing}</strong></span>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
                {advisory.title}
              </h3>
              {advisory.description && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
                  {advisory.description}
                </p>
              )}
            </div>

            {onToggleComplete && (
              <button
                type="button"
                onClick={onToggleComplete}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Reason Box */}
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-zinc-850/80 border border-slate-200/90 dark:border-zinc-750/80 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                <span>Scientific Reason</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 font-medium leading-relaxed">
                {advisory.reason}
              </p>
            </div>

            {/* Action Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Recommended Action</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-200 leading-relaxed">
                {advisory.action}
              </p>
            </div>
          </div>

          {/* Explainable AI Breakdown Drawer */}
          {explain && (
            <div className="p-4 rounded-2xl bg-white/95 dark:bg-zinc-850/90 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    AI
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                      Why this recommendation?
                      <span className="text-[10px] lowercase font-normal text-slate-400 dark:text-zinc-500">
                        (Explainable AI Analysis)
                      </span>
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
                  AgriAI suitability score: {explain.suitabilityScore}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Positive factors */}
                <div className="space-y-1.5 bg-emerald-50/50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 text-[11px] block uppercase tracking-wider">
                    Favorable Telemetry Conditions
                  </span>
                  <ul className="space-y-1 text-slate-700 dark:text-zinc-300">
                    {explain.whyFactors.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px] font-medium text-emerald-950 dark:text-emerald-200">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                        <span>{f.replace(/^✓\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk factors */}
                <div className="space-y-1.5 bg-amber-50/50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-100 dark:border-amber-900/50">
                  <span className="font-bold text-amber-900 dark:text-amber-300 text-[11px] block uppercase tracking-wider">
                    Identified Risk Factors
                  </span>
                  <ul className="space-y-1 text-slate-700 dark:text-zinc-300">
                    {explain.riskFactors.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px] font-medium text-amber-950 dark:text-amber-200">
                        <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Data sources */}
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-2 text-[10px] text-slate-500 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                  <span>Telemetry Sources:</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {explain.dataSources.map((s, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 italic">
                  Calculated based on active farm telemetry
                </span>
              </div>
            </div>
          )}

          {/* Action CTA Bar */}
          {advisory.actionUrl && advisory.actionCta && (
            <div className="pt-2 flex items-center justify-end">
              <Link
                href={advisory.actionUrl}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>{advisory.actionCta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Standard Priority Card
  return (
    <div
      className={`rounded-3xl p-6 border transition-all duration-200 text-left flex flex-col justify-between shadow-xs hover:shadow-sm ${
        isCompleted
          ? 'glass-card bg-slate-50/80 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800 opacity-75'
          : advisory.priority === 'High'
          ? 'glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-rose-200 dark:border-rose-900/60 hover:border-rose-300 dark:hover:border-rose-700'
          : 'glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-slate-200/90 dark:border-zinc-800/90 hover:border-emerald-300 dark:hover:border-emerald-700'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800 mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              {getCategoryIcon(advisory.category)}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
                {advisory.category}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                {advisory.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Badge variant={getPriorityBadgeVariant(advisory.priority)} size="sm">
              {advisory.priority}
            </Badge>
          </div>
        </div>

        {/* Reason Box */}
        <div className="space-y-2 mt-3">
          <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-750 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
            <span className="font-bold text-slate-800 dark:text-zinc-200 block text-[11px] mb-0.5">
              Reason:
            </span>
            {advisory.reason}
          </div>

          {/* Action Box */}
          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
            <span className="font-bold text-emerald-800 dark:text-emerald-400 block text-[11px] mb-0.5">
              Action:
            </span>
            {advisory.action}
          </div>
        </div>

        {/* Explainability Toggle Button */}
        {explain && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowExplainability(!showExplainability)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/70 hover:bg-slate-100 dark:hover:bg-zinc-700 text-[11px] font-bold text-slate-700 dark:text-zinc-300 flex items-center justify-between transition-colors cursor-pointer border border-slate-200/60 dark:border-zinc-700/60"
            >
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <HelpCircle className="w-3.5 h-3.5" />
                Why this recommendation?
              </span>
              <span className="flex items-center gap-1 text-slate-500 dark:text-zinc-400 font-normal">
                Score: <strong className="text-emerald-700 dark:text-emerald-400">{explain.suitabilityScore}%</strong>
                {showExplainability ? (
                  <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                )}
              </span>
            </button>

            {/* Expandable Explainable Drawer */}
            {showExplainability && (
              <div className="mt-2 p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 space-y-2 text-[11px] animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-zinc-700/60">
                  <span className="font-bold text-slate-800 dark:text-zinc-200">AgriAI suitability score</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded text-[10px]">
                    {explain.suitabilityScore}%
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-700 dark:text-zinc-300 text-[10px] uppercase tracking-wider block">
                    Telemetry Factors:
                  </span>
                  {explain.whyFactors.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-start gap-1 text-slate-700 dark:text-zinc-300">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{f.replace(/^✓\s*/, '')}</span>
                    </div>
                  ))}
                </div>

                {explain.riskFactors.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-slate-200/60 dark:border-zinc-700/60">
                    <span className="font-bold text-amber-800 dark:text-amber-300 text-[10px] uppercase tracking-wider block">
                      Risk Considerations:
                    </span>
                    {explain.riskFactors.slice(0, 2).map((r, i) => (
                      <div key={i} className="flex items-start gap-1 text-amber-950 dark:text-amber-200">
                        <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">•</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
          <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
          <span>Timing: <strong className="text-slate-800 dark:text-zinc-200">{advisory.timing}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {onToggleComplete && (
            <button
              type="button"
              onClick={onToggleComplete}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
              title="Mark as done"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}

          {advisory.actionUrl && advisory.actionCta && (
            <Link
              href={advisory.actionUrl}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 group"
            >
              <span>{advisory.actionCta}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
