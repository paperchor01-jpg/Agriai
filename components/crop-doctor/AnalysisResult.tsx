'use client';

import React from 'react';
import {
  RotateCcw,
  MessageSquare,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  ArrowRight,
  Stethoscope,
  Activity,
  Droplets,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { HealthRing } from '@/components/ui/HealthRing';
import { Badge } from '@/components/ui/Badge';
import { CropDoctorResult } from '@/types';

interface AnalysisResultProps {
  result: CropDoctorResult;
  onReset: () => void;
  onAskAgriAI: () => void;
}

export function AnalysisResult({ result, onReset, onAskAgriAI }: AnalysisResultProps) {
  const breakdown = result.healthBreakdown || {
    leafHealth: 72,
    soilCondition: 80,
    waterStress: 65,
    diseaseRisk: 58,
    weatherRisk: 30,
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-200 text-left">
      {/* Top Banner: Diagnosis Overview Header */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                {result.isFallback ? 'Reference Diagnosis' : 'AI Vision Diagnosis'}
              </span>
              {result.source && (
                <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                  {result.source === 'gemini-vision'
                    ? 'Google Gemini Vision'
                    : result.source === 'openai-vision'
                    ? 'OpenAI Vision'
                    : 'Prototype Benchmark'}
                </span>
              )}
              <span className="text-xs text-slate-400 dark:text-zinc-500">ID: {result.id}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight mt-1.5">
              Crop Diagnostic Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
              Analyzed for <strong>{result.crop}</strong> • {result.timestamp}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 active:scale-98 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Analyze Another Image</span>
            </button>
          </div>
        </div>

        {/* 4 Core Summary Columns */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* 1. Large Health Score Indicator */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50/80 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-800 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              Health Score
            </span>
            <HealthRing score={result.healthScore} size="lg" sublabel="/ 100" />
            <div className="mt-3">
              <p className="text-lg font-extrabold text-slate-900 dark:text-zinc-100">
                {result.healthScore} / 100
              </p>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60 mt-1 inline-block">
                Attention Required
              </span>
            </div>
          </div>

          {/* 2. Detected Issue, Severity & Confidence */}
          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Crop */}
              <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  Crop
                </span>
                <p className="text-lg font-bold text-slate-900 dark:text-zinc-100 mt-1">
                  {result.crop}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">Wheat (HD-2967)</p>
              </div>

              {/* Detected Issue */}
              <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Detected Issue
                </span>
                <p className="text-lg font-bold text-slate-900 dark:text-zinc-100 mt-1">
                  {result.disease}
                </p>
                <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300">
                  Fungal Pathogen
                </span>
              </div>

              {/* Severity & Confidence */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Severity
                  </span>
                  <Badge variant="warning" size="sm">
                    {result.severity}
                  </Badge>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xs text-slate-600 dark:text-zinc-400">Confidence</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-zinc-100">
                    {result.confidence}%
                  </span>
                </div>
                <div className="w-full bg-slate-200/80 dark:bg-zinc-700 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Symptoms Tags */}
            {result.symptoms && result.symptoms.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-1.5">
                  Observed Symptoms
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.symptoms.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 shadow-2xs"
                    >
                      • {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation Box */}
            <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-zinc-200">
                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>AI Agronomic Assessment</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                {result.explanation}
              </p>

              {/* Mandatory Medical Disclaimer */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-start gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {result.disclaimer ||
                    'Prototype AI result. This is not a professional agricultural diagnosis. Follow local agricultural guidance before treatment.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Actions Section */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              Recommended Action Plan
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Step-by-step guidance for containment and recovery</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            5 Actions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/80 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
                    {index + 1}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 mt-2 leading-relaxed">
                  {rec}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-3 block">
                Standard Protocol • Stage {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Breakdown Section */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              Crop Health Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Multi-parameter agro-telemetry indicators</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
            Telemetry Index
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Leaf Health', val: breakdown.leafHealth, icon: Activity, good: breakdown.leafHealth >= 70 },
            { label: 'Soil Condition', val: breakdown.soilCondition, icon: ShieldCheck, good: breakdown.soilCondition >= 70 },
            { label: 'Water Stress', val: breakdown.waterStress, icon: Droplets, good: breakdown.waterStress >= 60 },
            { label: 'Disease Risk', val: breakdown.diseaseRisk, icon: ShieldAlert, good: breakdown.diseaseRisk <= 40 },
            { label: 'Weather Risk', val: breakdown.weatherRisk, icon: Sun, good: breakdown.weatherRisk <= 40 },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{item.label}</span>
                <item.icon className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100">{item.val}%</p>
              <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.good ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ask AgriAI Callout Section */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 sm:p-8 shadow-md border border-slate-800 dark:border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-900/40 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Agronomic Copilot</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Ask AgriAI about this problem
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Have questions about fungicide dosage, irrigation adjustments, or organic home remedies? Chat directly with the AgriAI intelligence model.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={onAskAgriAI}
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask AgriAI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
