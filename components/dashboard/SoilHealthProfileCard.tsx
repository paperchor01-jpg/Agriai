'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FlaskConical, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { NormalizedSoilProfile } from '@/lib/data-providers/types';

interface SoilHealthProfileCardProps {
  soilProfile?: NormalizedSoilProfile | null;
  farmName?: string;
}

export function SoilHealthProfileCard({ soilProfile, farmName }: SoilHealthProfileCardProps) {
  const [showMicronutrients, setShowMicronutrients] = useState(false);

  // If no laboratory soil profile is present or marked insufficient
  if (!soilProfile || !soilProfile.availableNitrogenKgHa || soilProfile.status === 'Insufficient') {
    return (
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between text-left">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Soil Health Card Profile</h3>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">{farmName || 'Primary Plot'}</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Lab Record Required
            </span>
          </div>

          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200/60 dark:border-amber-800/40">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Insufficient soil data</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                No official 12-parameter Soil Health Card (SHC) laboratory test has been linked to this plot. Precision fertilizer dosages require verified test values.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <Link
            href="/farms"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 group"
          >
            <span>Enter Soil Health Card test values</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500">ICAR 12-Parameter Protocol</span>
        </div>
      </div>
    );
  }

  const getRatingBadge = (rating?: 'Low' | 'Medium' | 'High' | 'Optimal') => {
    switch (rating) {
      case 'Low':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">Low</span>;
      case 'High':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">High</span>;
      case 'Optimal':
      case 'Medium':
      default:
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">Optimal</span>;
    }
  };

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between text-left">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Laboratory Soil Health Profile</h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">{farmName || 'Verified Plot'} • Sampled {soilProfile.sampleDate}</p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{soilProfile.isLabVerified ? 'SHC Verified' : 'Self-Reported'}</span>
          </span>
        </div>

        {/* Primary N-P-K & pH Grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase block">Available N</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 mt-0.5">
              {soilProfile.availableNitrogenKgHa} <span className="text-[10px] font-normal text-slate-500">kg/ha</span>
            </p>
            <div className="mt-1">{getRatingBadge(soilProfile.nitrogenRating)}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase block">Available P</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 mt-0.5">
              {soilProfile.availablePhosphorusKgHa} <span className="text-[10px] font-normal text-slate-500">kg/ha</span>
            </p>
            <div className="mt-1">{getRatingBadge(soilProfile.phosphorusRating)}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase block">Available K</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 mt-0.5">
              {soilProfile.availablePotassiumKgHa} <span className="text-[10px] font-normal text-slate-500">kg/ha</span>
            </p>
            <div className="mt-1">{getRatingBadge(soilProfile.potassiumRating)}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase block">Reaction (pH)</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 mt-0.5">
              {soilProfile.ph}
            </p>
            <div className="mt-1">{getRatingBadge(soilProfile.ph >= 6.0 && soilProfile.ph <= 7.5 ? 'Optimal' : soilProfile.ph < 6.0 ? 'Low' : 'High')}</div>
          </div>
        </div>

        {/* Physical & Micronutrient Collapsible Section */}
        <div className="mt-3.5">
          <button
            onClick={() => setShowMicronutrients(!showMicronutrients)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-zinc-300 hover:text-emerald-600 transition-colors p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800"
          >
            <span>Secondary & Micronutrients (S, Zn, Fe, Cu, Mn, B, OC, EC)</span>
            {showMicronutrients ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMicronutrients && (
            <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/40">
                <span className="text-[10px] text-slate-400 block">Sulphur</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">{soilProfile.sulphurPpm ?? 'N/A'} ppm</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/40">
                <span className="text-[10px] text-slate-400 block">Zinc</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">{soilProfile.zincPpm ?? 'N/A'} ppm</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/40">
                <span className="text-[10px] text-slate-400 block">Iron</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">{soilProfile.ironPpm ?? 'N/A'} ppm</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/40">
                <span className="text-[10px] text-slate-400 block">Boron</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">{soilProfile.boronPpm ?? 'N/A'} ppm</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/40">
                <span className="text-[10px] text-slate-400 block">Org Carbon</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">{soilProfile.organicCarbonPercent ?? 'N/A'}%</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/40">
                <span className="text-[10px] text-slate-400 block">EC (Salinity)</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">{soilProfile.electricalConductivityDsm ?? 'N/A'} dS/m</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/40">
                <span className="text-[10px] text-slate-400 block">Copper</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">{soilProfile.copperPpm ?? 'N/A'} ppm</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/40">
                <span className="text-[10px] text-slate-400 block">Manganese</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">{soilProfile.manganesePpm ?? 'N/A'} ppm</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Source: {soilProfile.isLabVerified ? 'Soil Health Card (SHC) Lab Analysis' : 'Self-Reported Lab Report'}</span>
        </div>
        <span>Lab: {soilProfile.labName || 'Govt Soil Testing Lab'}</span>
      </div>
    </div>
  );
}
