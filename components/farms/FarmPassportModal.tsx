'use client';

import React from 'react';
import { FarmPassportData } from '@/types';

interface FarmPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  passport: FarmPassportData;
}

export function FarmPassportModal({ isOpen, onClose, passport }: FarmPassportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-2xl">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Farm Digital Passport
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                  Verified Plot
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Official Digital Holding Record • AgriAI Smart Agronomy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-2 rounded-xl text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Passport Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Farm Holding</div>
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">{passport.farmName}</div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Registered Owner</div>
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">{passport.ownerName}</div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Holding Size</div>
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">{passport.totalAcres} Acres</div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Location</div>
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">
              {passport.location.district || passport.location.state || "India"}
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Soil Texture & pH</div>
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">
              {passport.soilType} (pH {passport.soilPh})
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Active Crop</div>
            <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
              {passport.currentCrop.name} ({passport.currentCrop.stage})
            </div>
          </div>
        </div>

        {/* GPS Coordinates Badge */}
        {passport.location.latitude && passport.location.longitude && (
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-3 mb-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300">
              <span>📍</span>
              <span className="font-mono">Lat: {passport.location.latitude.toFixed(4)}, Lon: {passport.location.longitude.toFixed(4)}</span>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Verified GPS Centroid</span>
          </div>
        )}

        {/* Crop Rotation History */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Rotational History & Yield Records
          </h3>
          <div className="space-y-2">
            {passport.history.map((h, i) => (
              <div
                key={i}
                className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    {h.year} • {h.season} — {h.crop}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {h.keyIssues.join(' • ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {h.yieldQuintalsPerAcre} Q/acre
                  </div>
                  <div className="text-[10px] text-zinc-400">Recorded Yield</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl text-xs transition-colors"
          >
            🖨 Print Passport
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
