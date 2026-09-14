'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LineChart as LineChartIcon,
  Sprout,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { CropHealthChart } from '@/components/analytics/CropHealthChart';
import { WaterUsageChart } from '@/components/analytics/WaterUsageChart';
import { DiseaseRiskTrend } from '@/components/analytics/DiseaseRiskTrend';
import { ExpectedYieldCard } from '@/components/analytics/ExpectedYieldCard';
import { FarmInsightsSection } from '@/components/analytics/FarmInsightsSection';
import { getFarmAnalytics } from '@/lib/analytics-service';
import {
  DEFAULT_FARMS,
  DEFAULT_WEATHER,
  getStoredFarms,
  getSelectedFarmId,
  saveSelectedFarmId,
} from '@/lib/mock-data';
import { getWeather } from '@/lib/weather-service';
import { getYieldPrediction } from '@/lib/yield-service';
import { Farm, WeatherData, YieldPredictionResult } from '@/types';

export default function AnalyticsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);
  const [analytics, setAnalytics] = useState<any>(null);

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

  // Recalculate analytics when active farm or weather updates
  useEffect(() => {
    let isMounted = true;
    if (activeFarm?.location) {
      getWeather(activeFarm.location).then((wData) => {
        if (isMounted) {
          setWeather(wData);
          const yData = getYieldPrediction(activeFarm, wData, wData.risks);
          const aData = getFarmAnalytics(activeFarm, wData, yData);
          setAnalytics(aData);
        }
      });
    } else if (activeFarm) {
      const yData = getYieldPrediction(activeFarm, weather, weather.risks);
      const aData = getFarmAnalytics(activeFarm, weather, yData);
      setAnalytics(aData);
    } else {
      setAnalytics(null);
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
                <LineChartIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                  Farm Analytics
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Track crop health, water usage, disease risk and expected yield.
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
                        {f.name} — {cName} ({f.location})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ZERO FARMS STATE */}
        {farms.length === 0 || !analytics ? (
          <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-10 sm:p-14 border border-dashed border-slate-300 dark:border-zinc-700 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <LineChartIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100">
                No Farm Telemetry Available
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Register your farm holding in My Farms to begin logging longitudinal crop health trends, soil moisture tracking, water efficiency calculations, and expected harvest yield.
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
            {/* 2. Analytics Overview Summary Cards */}
            <AnalyticsOverview analytics={analytics} />

            {/* 3. Charts 2-Column Grid: Crop Health Over Time & Water Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CropHealthChart data={analytics.healthTrend} />
              <WaterUsageChart data={analytics.waterUsage} />
            </div>

            {/* 4. Disease Risk & Expected Yield 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DiseaseRiskTrend data={analytics.diseaseRiskTrend} />
              <ExpectedYieldCard
                current={analytics.expectedYield.current}
                range={analytics.expectedYield.range}
                min={analytics.expectedYield.min}
                max={analytics.expectedYield.max}
                unit={analytics.expectedYield.unit}
              />
            </div>

            {/* 5. Farm Insights */}
            <FarmInsightsSection
              insights={analytics.insights}
              disclaimer={analytics.disclaimer}
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
