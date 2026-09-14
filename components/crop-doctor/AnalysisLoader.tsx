'use client';

import React from 'react';
import { Loader2, CheckCircle2, Stethoscope, Sparkles } from 'lucide-react';
import { ANALYSIS_STEPS } from '@/lib/ai-service';

interface AnalysisLoaderProps {
  currentStep: string;
  progressPercent: number;
}

export function AnalysisLoader({ currentStep, progressPercent }: AnalysisLoaderProps) {
  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-zinc-800/80 shadow-sm text-center max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Animated Spinner Icon */}
      <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-emerald-100/70 dark:bg-emerald-950/50 animate-ping opacity-25" />
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
          <Loader2 className="w-9 h-9 animate-spin" />
        </div>
      </div>

      {/* Headline & Active Step */}
      <div className="space-y-1.5">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
          AI Vision Diagnostics in Progress
        </h3>
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 h-6">
          {currentStep || 'Initializing model...'}
        </p>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="space-y-2">
        <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-zinc-500 font-medium">
          <span>Inference pipeline active</span>
          <span className="font-bold text-slate-700 dark:text-zinc-300">{progressPercent}%</span>
        </div>
      </div>

      {/* 5 Stages Status Checklist */}
      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-2.5 text-left">
        {ANALYSIS_STEPS.map((step, idx) => {
          const stepPercent = ((idx + 1) / ANALYSIS_STEPS.length) * 100;
          const isDone = progressPercent >= stepPercent;
          const isCurrent = currentStep === step;

          return (
            <div
              key={step}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                isDone
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-semibold border border-emerald-200/50 dark:border-emerald-800/40'
                  : isCurrent
                  ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold border border-slate-200 dark:border-zinc-700'
                  : 'text-slate-400 dark:text-zinc-500'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-zinc-600 shrink-0" />
                )}
                <span>{step}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">Step 0{idx + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
