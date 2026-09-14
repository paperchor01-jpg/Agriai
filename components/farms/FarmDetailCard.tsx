'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Sprout,
  Droplets,
  TestTube2,
  Calendar,
  Layers,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { HealthRing } from '@/components/ui/HealthRing';
import { Badge } from '@/components/ui/Badge';
import { Farm } from '@/types';

interface FarmDetailCardProps {
  farm: Farm;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function FarmDetailCard({
  farm,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: FarmDetailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cropName =
    typeof farm.crop === 'object' && farm.crop ? farm.crop.name : farm.crop || 'Wheat';
  const cropVariety =
    typeof farm.crop === 'object' && farm.crop ? farm.crop.variety : farm.cropVariety;
  const cropStage =
    typeof farm.crop === 'object' && farm.crop ? farm.crop.stage : 'Flowering';
  const plantingDate =
    typeof farm.crop === 'object' && farm.crop
      ? farm.crop.plantingDate
      : farm.plantingDate || '2025-11-15';

  const soil = farm.soil || {
    soilType: farm.soilType || 'Loamy',
    ph: 6.8,
    nitrogen: 'Medium',
    phosphorus: 'High',
    potassium: 'Medium',
    moisture: 62,
  };

  const practices = farm.practices || {
    irrigationMethod: farm.irrigationType || 'Drip',
    fertilizerPractice: 'Integrated / Mixed',
    pestPractice: 'Integrated Pest Management (IPM)',
  };

  return (
    <div
      className={`glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md text-left ${
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
          : 'border-slate-200/80 dark:border-zinc-800/80'
      }`}
    >
      {/* Top Banner & Status */}
      <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                {farm.name}
              </h3>
              {isSelected ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Active Dashboard Farm</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onSelect}
                  className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 underline cursor-pointer"
                >
                  Set as active
                </button>
              )}
              <Badge variant="success" size="sm">
                {farm.status}
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
              <span>{farm.location}</span>
              <span className="text-slate-300 dark:text-zinc-600">•</span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300">{farm.areaAcres} acres</span>
              <span className="text-slate-300 dark:text-zinc-600">•</span>
              <span>Irrigation: <strong>{farm.irrigationAvailability || 'Available'}</strong></span>
            </p>
          </div>

          {/* Action Buttons: Edit, Delete, Toggle Details */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={onEdit}
              title="Edit Farm"
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              type="button"
              onClick={onDelete}
              title="Delete Farm"
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 text-slate-500 dark:text-zinc-400 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>

            <Link
              href="/crop-doctor"
              className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Diagnose</span>
            </Link>
          </div>
        </div>

        {/* Primary Parameters Row */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Crop & Stage
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-1">
              {cropName}
            </p>
            <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              {cropStage}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Soil Type & pH
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-1">
              {soil.soilType}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">pH {soil.ph}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Soil Moisture
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-1">
              {soil.moisture}%
            </p>
            <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${soil.moisture}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                Crop Health
              </span>
              <p className="text-lg font-extrabold text-emerald-900 dark:text-emerald-200 mt-0.5">
                {farm.healthScore}%
              </p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Optimal Index</span>
            </div>
            <HealthRing score={farm.healthScore} size="sm" />
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Detailed Telemetry' : 'View Full Farm & Soil Details'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <span className="text-[11px] text-slate-400 dark:text-zinc-500">
            Yield Est: <strong className="text-slate-700 dark:text-zinc-300">{farm.expectedYieldTons} tons</strong>
          </span>
        </div>
      </div>

      {/* Expandable 4-Section Detailed View */}
      {isExpanded && (
        <div className="p-6 sm:p-7 bg-slate-50/70 dark:bg-zinc-850/50 border-t border-slate-100 dark:border-zinc-800 space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Farm Information */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                  Farm Information
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Farm Name</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{farm.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Location</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{farm.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Cultivated Area</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{farm.areaAcres} Acres</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Irrigation Supply</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {farm.irrigationAvailability || 'Available'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Soil Condition */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
                <TestTube2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                  Soil Condition & Nutrients
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Soil Type</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{soil.soilType}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Soil pH</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{soil.ph} (Neutral)</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Moisture</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{soil.moisture}%</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Nitrogen (N)</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">{soil.nitrogen}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Phosphorus (P)</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">{soil.phosphorus}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Potassium (K)</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">{soil.potassium}</span>
                </div>
              </div>
            </div>

            {/* 3. Crop Information */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
                <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                  Crop Information
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Primary Crop</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{cropName}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Crop Variety</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{cropVariety || 'Standard Seed'}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Crop Stage</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">{cropStage}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Planting Date</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">{plantingDate}</span>
                </div>
              </div>
            </div>

            {/* 4. Farm Practices */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
                <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                  Farm Practices
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-2.5 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Irrigation Method</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{practices.irrigationMethod}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Fertilizer Application</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">{practices.fertilizerPractice}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Pest Management</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">{practices.pestPractice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
