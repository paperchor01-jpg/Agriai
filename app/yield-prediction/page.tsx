'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sprout,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { YieldRangeVisualizer } from '@/components/yield/YieldRangeVisualizer';
import { ContributingFactorsCard } from '@/components/yield/ContributingFactorsCard';
import { YieldInsightsCard } from '@/components/yield/YieldInsightsCard';
import { getYieldPrediction } from '@/lib/yield-service';
import {
  DEFAULT_FARMS,
  DEFAULT_WEATHER,
  getStoredFarms,
  getSelectedFarmId,
  saveSelectedFarmId,
} from '@/lib/mock-data';
import { getWeather } from '@/lib/weather-service';
import { Farm, WeatherData, YieldPredictionResult } from '@/types';

import Link from 'next/link';

export default function YieldPredictionPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);
  const [prediction, setPrediction] = useState<YieldPredictionResult | null>(null);

  // Sync stored farms & selection
  useEffect(() => {
    const sync = () => {
      const storedFarms = getStoredFarms();
      setFarms(storedFarms);
      const selId = getSelectedFarmId();
      setSelectedFarmId(selId);
    };

    sync();
    window.addEventListener('agriai:farms-updated', sync);
    return () => window.removeEventListener('agriai:farms-updated', sync);
  }, []);

  const activeFarm =
    farms.find((f) => f.id === selectedFarmId) || (farms.length > 0 ? farms[0] : null);

  // Recalculate yield prediction when active farm or weather updates
  useEffect(() => {
    let isMounted = true;
    if (activeFarm?.location) {
      getWeather(activeFarm.location).then((wData) => {
        if (isMounted) {
          setWeather(wData);
          const res = getYieldPrediction(activeFarm, wData, wData.risks);
          setPrediction(res);
        }
      });
    } else if (activeFarm) {
      const res = getYieldPrediction(activeFarm, weather, weather.risks);
      setPrediction(res);
    } else {
      setPrediction(null);
    }

    return () => {
      isMounted = false;
    };
  }, [activeFarm, selectedFarmId]);

  const handleFarmChange = (farmId: string) => {
    setSelectedFarmId(farmId);
    saveSelectedFarmId(farmId);
  };

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto text-left">
        {/* 1. Header with Title, Subtitle, and Target Farm Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                  Yield Prediction
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Estimate your expected crop yield using farm health, soil, weather and irrigation insights.
                </p>
              </div>
            </div>
          </div>

          {/* Farm Switcher */}
          {farms.length > 0 && activeFarm && (
            <div className="flex items-center gap-2.5 self-start sm:self-auto bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 dark:border-zinc-700/80 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
                  Target Farm Plot
                </span>
                <select
                  value={selectedFarmId}
                  onChange={(e) => handleFarmChange(e.target.value)}
                  className="text-xs font-bold bg-transparent text-slate-900 dark:text-zinc-100 focus:outline-hidden cursor-pointer"
                >
                  {farms.map((f) => {
                    const cName = typeof f.crop === 'object' && f.crop ? f.crop.name : f.crop;
                    return (
                      <option key={f.id} value={f.id} className="dark:bg-zinc-900 dark:text-zinc-100">
                        {f.name} — {cName} ({f.areaAcres} acres)
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ZERO FARMS STATE */}
        {farms.length === 0 || !prediction || !activeFarm ? (
          <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-10 sm:p-14 border border-dashed border-slate-300 dark:border-zinc-700 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100">
                No Farm Plot Registered
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Add your agricultural plots with soil and crop parameters to estimate expected harvest yield, calculate risk factors, and view target harvest projections.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/farms"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all"
              >
                <Sprout className="w-4 h-4" />
                <span>Add Your Farm Plot</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* 2. Main Prediction Hero Display */}
            <div className="glass-card bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 dark:border-emerald-900/40 relative overflow-hidden">
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    {prediction.label}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-300">
                    {prediction.farmName} ({prediction.cropName})
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md self-start sm:self-auto text-xs font-bold text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Prediction Confidence: <strong>{`${prediction.confidence}%`}</strong></span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Primary Expected Yield */}
                <div className="md:col-span-7">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Expected Harvest Projection
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                      {`${prediction.predictedYield} tons`}
                    </span>
                    <span className="text-sm font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-800">
                      Target Projection
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                    <span>
                      Expected Range: <strong className="text-white font-bold">{`${prediction.minimumYield} – ${prediction.maximumYield} tons`}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Total Plot Yield: <strong className="text-emerald-300 font-bold">{`${prediction.totalTons} tons`}</strong> ({prediction.areaAcres} acres)
                    </span>
                  </div>
                </div>

                {/* Micro Highlights */}
                <div className="md:col-span-5 grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Crop Health
                    </span>
                    <p className="text-lg font-black text-white mt-0.5">
                      {activeFarm?.healthScore ?? 85}%
                    </p>
                    <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">Optimal canopy</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Soil Moisture
                    </span>
                    <p className="text-lg font-black text-white mt-0.5">
                      {activeFarm?.soil?.moisture ?? 62}%
                    </p>
                    <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">Root hydration balanced</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Range Visualization */}
            <YieldRangeVisualizer prediction={prediction} />

            {/* 4. Contributing Factors */}
            <ContributingFactorsCard factors={prediction.factors} />

            {/* 5. Yield Insights & Actions */}
            <YieldInsightsCard
              insights={prediction.insights}
              actions={prediction.actions}
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
