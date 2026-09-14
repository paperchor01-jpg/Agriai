'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Sprout,
  Filter,
  CheckCircle2,
  RefreshCw,
  Info,
  Calendar,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { AdvisorySummary } from '@/components/advisory/AdvisorySummary';
import { AdvisoryCard } from '@/components/advisory/AdvisoryCard';
import { getAdvisories } from '@/lib/advisory-service';
import {
  DEFAULT_FARMS,
  DEFAULT_WEATHER,
  DEFAULT_DIAGNOSIS,
  getStoredFarms,
  getSelectedFarmId,
  saveSelectedFarmId,
  getStoredDiagnosis,
} from '@/lib/mock-data';
import { getWeather } from '@/lib/weather-service';
import { Farm, WeatherData, AdvisoryItem } from '@/types';

export default function AdvisoryPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);
  const [advisories, setAdvisories] = useState<AdvisoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

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

  // Fetch weather and synthesize advisories whenever target farm changes
  useEffect(() => {
    let isMounted = true;
    if (activeFarm?.location) {
      getWeather(activeFarm.location).then((wData) => {
        if (isMounted) {
          setWeather(wData);
          const generated = getAdvisories(activeFarm, wData, getStoredDiagnosis());
          setAdvisories(generated);
        }
      });
    } else if (activeFarm) {
      const generated = getAdvisories(activeFarm, DEFAULT_WEATHER, getStoredDiagnosis());
      setAdvisories(generated);
    } else {
      setAdvisories([]);
    }

    return () => {
      isMounted = false;
    };
  }, [activeFarm, selectedFarmId]);

  const handleFarmChange = (farmId: string) => {
    setSelectedFarmId(farmId);
    saveSelectedFarmId(farmId);
  };

  const toggleComplete = (id: string) => {
    setCompletedActions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 'all', label: 'All Advisories' },
    { id: 'Crop Care', label: '🌾 Crop Care' },
    { id: 'Irrigation', label: '💧 Irrigation' },
    { id: 'Disease', label: '🛡️ Disease Risk' },
    { id: 'Nutrients', label: '🌱 Nutrients' },
  ];

  const filteredAdvisories = advisories.filter(
    (adv) => selectedCategory === 'all' || adv.category === selectedCategory
  );

  const heroAdvisory = filteredAdvisories.find((a) => a.priority === 'High') || filteredAdvisories[0];
  const standardAdvisories = filteredAdvisories.filter((a) => a.id !== heroAdvisory?.id);

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto text-left">
        {/* 1. Header with Title, Subtitle, and Target Farm Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                  Smart Advisory
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Personalized recommendations for healthier crops and better yields.
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
                    const cStage = typeof f.crop === 'object' && f.crop?.stage ? f.crop.stage : 'Flowering';
                    return (
                      <option key={f.id} value={f.id} className="dark:bg-zinc-900 dark:text-zinc-100">
                        {f.name} — {cName} ({cStage})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ZERO FARMS STATE */}
        {farms.length === 0 ? (
          <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-10 sm:p-14 border border-dashed border-slate-300 dark:border-zinc-700 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Sprout className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100">
                No Farm Plots Registered
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Add your farm holding to receive real-time, explainable AI crop advisories based on your crop growth stage, soil pH, moisture, and local weather forecasts.
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
            {/* 2. Advisory Summary Section */}
            {activeFarm && <AdvisorySummary advisories={advisories} farmName={activeFarm.name} />}

            {/* 3. Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white/80 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200/80 dark:border-zinc-700/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Empty Filter State */}
            {filteredAdvisories.length === 0 && (
              <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-zinc-800/80 text-center space-y-3 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">
                  No urgent actions detected. Continue monitoring your farm.
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
                  Telemetry readings indicate normal soil hydration, stable weather parameters, and zero critical pathogen pressure.
                </p>
              </div>
            )}

            {/* 4. High Priority Visually Prominent Recommendation */}
            {heroAdvisory && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                    Critical Focus Item
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">Tuned to current phenology</span>
                </div>
                <AdvisoryCard
                  advisory={heroAdvisory}
                  isHero={true}
                  isCompleted={!!completedActions[heroAdvisory.id]}
                  onToggleComplete={() => toggleComplete(heroAdvisory.id)}
                />
              </div>
            )}

            {/* 5. Additional Priority Recommendations Grid */}
            {standardAdvisories.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                    Targeted Field Actions ({standardAdvisories.length})
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">Sorted by agronomic impact</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {standardAdvisories.map((advisory) => (
                    <AdvisoryCard
                      key={advisory.id}
                      advisory={advisory}
                      isHero={false}
                      isCompleted={!!completedActions[advisory.id]}
                      onToggleComplete={() => toggleComplete(advisory.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
