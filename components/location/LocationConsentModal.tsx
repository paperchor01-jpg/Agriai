'use client';

import React from 'react';
import { MapPin, ShieldCheck, X, Navigation, CheckCircle2, Lock } from 'lucide-react';

interface LocationConsentModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onChooseManually: () => void;
  onClose: () => void;
}

export function LocationConsentModal({
  isOpen,
  onAllow,
  onChooseManually,
  onClose,
}: LocationConsentModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-consent-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md glass-card bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 dark:border-zinc-800/80 overflow-hidden text-left p-6 sm:p-7 space-y-5">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close location consent dialog"
          className="absolute top-5 right-5 text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs border border-emerald-200/50 dark:border-emerald-800/40">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-800/50">
              User Consent Required
            </span>
            <h3 id="location-consent-title" className="text-lg font-extrabold text-slate-900 dark:text-zinc-100 mt-1">
              Use your current location?
            </h3>
          </div>
        </div>

        {/* Body explanation */}
        <div className="space-y-3 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed bg-slate-50/80 dark:bg-zinc-800/50 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
          <p className="font-semibold text-slate-800 dark:text-zinc-200">
            AgriAI can use your device location to identify your farm&apos;s approximate location and provide location-specific weather, crop recommendations, and soil insights.
          </p>
          <p className="text-slate-500 dark:text-zinc-400">
            Your exact coordinates will only be used for agricultural analysis and will be securely linked to your farm profile.
          </p>
          <div className="pt-2 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center gap-2 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Privacy Guard: Never accessed automatically in background.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onAllow}
            className="w-full sm:w-auto flex-1 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>Allow Location</span>
          </button>

          <button
            type="button"
            onClick={onChooseManually}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer text-center"
          >
            <span>Choose Manually</span>
          </button>
        </div>
      </div>
    </div>
  );
}
