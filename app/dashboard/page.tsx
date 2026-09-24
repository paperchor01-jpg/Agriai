'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  Sprout,
  Layers,
  ShieldCheck,
  TrendingUp,
  Bell,
  User,
  Sparkles,
  Plus,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Wheat,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { TodayActionsSection } from '@/components/dashboard/TodayActionsSection';
import { FarmOverview } from '@/components/dashboard/FarmOverview';
import { FarmHealthScoreCard } from '@/components/dashboard/FarmHealthScoreCard';
import { QuickAction } from '@/components/dashboard/QuickAction';
import { AdvisorySnippet } from '@/components/dashboard/AdvisorySnippet';
import { YieldSnippetCard } from '@/components/dashboard/YieldSnippetCard';
import { AnalyticsSnippetCard } from '@/components/dashboard/AnalyticsSnippetCard';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { MandiPriceCard } from '@/components/dashboard/MandiPriceCard';
import { SoilHealthProfileCard } from '@/components/dashboard/SoilHealthProfileCard';
import { RiskCard } from '@/components/dashboard/RiskCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { ActivityCard } from '@/components/dashboard/ActivityCard';
import { Badge } from '@/components/ui/Badge';
import { FarmOnboardingWizard } from '@/components/onboarding/FarmOnboardingWizard';
import { soilService } from '@/lib/soil-service';
import { NormalizedSoilProfile } from '@/lib/data-providers/types';
import {
  DEFAULT_FARMER,
  DEFAULT_FARMS,
  DEFAULT_WEATHER,
  getStoredFarms,
  getSelectedFarm,
  saveSelectedFarmId,
  getStoredFarmer,
  getStoredDiagnosis,
} from '@/lib/mock-data';
import { getFarms } from '@/lib/farm-service';
import { getWeather } from '@/lib/weather-service';
import { getAdvisories } from '@/lib/advisory-service';
import { getFarmHealthScore } from '@/lib/farm-health-service';
import { getYieldPrediction } from '@/lib/yield-service';
import { getFarmAnalytics } from '@/lib/analytics-service';
import { todayActionsService } from '@/lib/today-actions-service';
import { Farm, WeatherData, FarmerProfile } from '@/types';

export default function DashboardPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [farmWeather, setFarmWeather] = useState<WeatherData>(DEFAULT_WEATHER);
  const [farmer, setFarmer] = useState<FarmerProfile>(DEFAULT_FARMER);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [soilProfile, setSoilProfile] = useState<NormalizedSoilProfile | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const loadedFarms = await getFarms();
        if (isMounted) {
          setFarms(loadedFarms);
          const sel = getSelectedFarm();
          setSelectedFarm(sel);
          setFarmer(getStoredFarmer());
        }
      } catch (err) {
        console.warn('Dashboard initial load error:', err);
        if (isMounted) {
          const stored = getStoredFarms();
          setFarms(stored);
          setSelectedFarm(getSelectedFarm());
          setFarmer(getStoredFarmer());
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadInitialData();

    const syncFarms = () => {
      const stored = getStoredFarms();
      setFarms(stored);
      setSelectedFarm(getSelectedFarm());
    };

    const syncFarmer = () => {
      setFarmer(getStoredFarmer());
    };

    window.addEventListener('agriai:farms-updated', syncFarms);
    window.addEventListener('agriai:profile-updated', syncFarmer);
    window.addEventListener('agriai:auth-changed', syncFarmer);
    return () => {
      isMounted = false;
      window.removeEventListener('agriai:farms-updated', syncFarms);
      window.removeEventListener('agriai:profile-updated', syncFarmer);
      window.removeEventListener('agriai:auth-changed', syncFarmer);
    };
  }, []);

  // Primary active farm
  const primaryFarm = selectedFarm || (farms.length > 0 ? farms[0] : null);

  useEffect(() => {
    const loc = primaryFarm?.location || farmer.location || '';
    const lat = primaryFarm?.latitude ?? farmer.latitude;
    const lon = primaryFarm?.longitude ?? farmer.longitude;
    if (loc || (lat !== undefined && lon !== undefined)) {
      getWeather(loc, lat, lon).then((w) => setFarmWeather(w));
    }
  }, [primaryFarm?.location, primaryFarm?.latitude, primaryFarm?.longitude, farmer.location, farmer.latitude, farmer.longitude]);

  useEffect(() => {
    if (primaryFarm?.id) {
      soilService.getSoilProfile(primaryFarm.id).then((sp: NormalizedSoilProfile | null) => setSoilProfile(sp));
    } else {
      setSoilProfile(null);
    }
  }, [primaryFarm?.id]);

  const topAdvisory = useMemo(() => {
    if (!primaryFarm) return null;
    const list = getAdvisories(primaryFarm, farmWeather, getStoredDiagnosis());
    return list[0];
  }, [primaryFarm, farmWeather]);

  const todayActions = useMemo(() => {
    if (!primaryFarm) return [];
    return todayActionsService.getTodayActions(primaryFarm, farmWeather);
  }, [primaryFarm, farmWeather]);

  const farmHealthScore = useMemo(() => {
    if (!primaryFarm) return null;
    return getFarmHealthScore(primaryFarm, farmWeather, getStoredDiagnosis());
  }, [primaryFarm, farmWeather]);

  const yieldPrediction = useMemo(() => {
    if (!primaryFarm) return null;
    return getYieldPrediction(primaryFarm, farmWeather, farmWeather.risks);
  }, [primaryFarm, farmWeather]);

  const farmAnalytics = useMemo(() => {
    if (!primaryFarm || !yieldPrediction) return null;
    return getFarmAnalytics(primaryFarm, farmWeather, yieldPrediction);
  }, [primaryFarm, farmWeather, yieldPrediction]);

  const handleOnboardingComplete = (newFarm: Farm) => {
    const updated = [newFarm, ...farms.filter((f) => f.id !== newFarm.id)];
    setFarms(updated);
    setSelectedFarm(newFarm);
    saveSelectedFarmId(newFarm.id);
  };

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8">
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-zinc-800 text-left">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                {farms.length > 0
                  ? `Good morning, ${(farmer.name || 'Farmer').split(' ')[0]} 👋`
                  : farmer.name && farmer.name !== 'Farmer'
                  ? `Welcome to AgriAI, ${farmer.name.split(' ')[0]} 👋`
                  : 'Welcome to AgriAI 👋'}
              </h1>
              {farms.length > 0 ? (
                <Badge variant="emerald" size="sm">
                  Live Farm Telemetry
                </Badge>
              ) : (
                <Badge variant="warning" size="sm">
                  First-Time Onboarding
                </Badge>
              )}
            </div>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-zinc-400">
              {primaryFarm ? (
                <>
                  Your farm is <span className="font-bold text-emerald-600 dark:text-emerald-400">{`${primaryFarm.healthScore}% healthy today`}</span>.
                </>
              ) : (
                <span>Let&apos;s set up your first farm to get personalized recommendations.</span>
              )}
            </p>

            {farms.length > 1 && primaryFarm && (
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Selected Plot:</span>
                <select
                  value={primaryFarm.id}
                  onChange={(e) => {
                    saveSelectedFarmId(e.target.value);
                    const f = farms.find((farm) => farm.id === e.target.value);
                    if (f) setSelectedFarm(f);
                  }}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 shadow-2xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.location})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Quick Header Actions: Crop Hub link, Notifications & Avatar */}
          <div className="flex items-center gap-3">
            <Link
              href="/crop"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <Wheat className="w-4 h-4" />
              <span>Crop Hub</span>
            </Link>

            <Link
              href="/alerts"
              className="relative p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-300 shadow-2xs transition-all flex items-center justify-center"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-zinc-900" />
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-emerald-300 shadow-2xs transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {(farmer?.name || 'Farmer')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 leading-tight">
                  {farmer?.name || 'Farmer'}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                  {farmer.location || 'Location not set'}
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* 5 REUSABLE STATISTIC CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <StatCard
            title="Crop Health"
            value={primaryFarm ? `${primaryFarm.healthScore}%` : 'Data unavailable'}
            subtitle={primaryFarm ? 'Optimal growth stage' : 'Awaiting farm plot'}
            icon={Activity}
            accentColor="emerald"
            trend={primaryFarm ? { text: '+4% this wk', positive: true } : undefined}
          />
          <StatCard
            title="Farm Area"
            value={primaryFarm ? `${primaryFarm.areaAcres} acres` : '0 acres'}
            subtitle={primaryFarm ? 'Total under cultivation' : 'No plots registered'}
            icon={Sprout}
            accentColor="indigo"
          />
          <StatCard
            title="Active Crops"
            value={String(farms.length)}
            subtitle={
              farms.length > 0
                ? farms
                    .map((f) => (typeof f.crop === 'object' && f.crop ? f.crop.name : f.crop))
                    .slice(0, 3)
                    .join(', ')
                : 'None registered'
            }
            icon={Layers}
            accentColor="slate"
          />
          <StatCard
            title="Risk Level"
            value={primaryFarm ? primaryFarm.riskLevel : 'Data unavailable'}
            subtitle={primaryFarm ? 'Disease & weather' : 'Awaiting crop telemetry'}
            icon={ShieldCheck}
            accentColor="sky"
          />
          <StatCard
            title="Expected Yield"
            value={primaryFarm ? `${primaryFarm.expectedYieldTons} tons` : 'Data unavailable'}
            subtitle={primaryFarm ? 'Estimated harvest' : 'Awaiting farm parameters'}
            icon={TrendingUp}
            accentColor="amber"
            trend={
              primaryFarm
                ? {
                    text: `Range: ${(primaryFarm.expectedYieldTons * 0.9).toFixed(1)}–${(primaryFarm.expectedYieldTons * 1.1).toFixed(1)}t`,
                    positive: true,
                  }
                : undefined
            }
          />
        </div>

        {/* MAIN BODY: ONBOARDING WIZARD OR LIVE TELEMETRY */}
        {farms.length === 0 ? (
          /* FIRST TIME ONBOARDING WIZARD */
          <div className="space-y-6">
            <FarmOnboardingWizard
              onComplete={handleOnboardingComplete}
              farmerName={farmer.name}
            />

            {/* Quick Informational Empty State Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Regional Weather Overview */}
              <WeatherCard weather={farmWeather} />

              {/* Advisory Setup Guidance */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-zinc-800 shadow-xs flex flex-col justify-between text-left space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                        Smart Advisory Engine Ready
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Awaiting your farm and crop parameters
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                    Once you save your farm holding above, AgriAI will synthesize your soil pH, N-P-K nutrient status, irrigation setup, and live weather forecast into prioritized daily crop advisories.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Your farm data is kept strictly isolated to your account.</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE FARM DASHBOARD */
          <>
            {/* 1. WHAT SHOULD I DO TODAY? (Top Priority Action Center) */}
            {primaryFarm && <TodayActionsSection actions={todayActions} farmName={primaryFarm.name} />}

            {/* LARGE PREMIUM FARM OVERVIEW CARD */}
            {primaryFarm && <FarmOverview farm={primaryFarm} />}

            {/* AGRIAI FARM HEALTH & RISK SCORE (0-100) */}
            {farmHealthScore && primaryFarm && (
              <FarmHealthScoreCard
                healthResult={farmHealthScore}
                farmName={primaryFarm.name}
              />
            )}

            {/* TODAY'S SMART ADVISORY & YIELD PREDICTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {topAdvisory && <AdvisorySnippet advisory={topAdvisory} />}
              {yieldPrediction && <YieldSnippetCard prediction={yieldPrediction} />}
            </div>

            {/* QUICK ACTIONS */}
            <QuickAction />

            {/* WEATHER SUMMARY & FARM RISK (2-Column Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WeatherCard weather={farmWeather} />
              <RiskCard risks={farmWeather.risks} />
            </div>

            {/* REAL AGRICULTURAL DATA: MANDI PRICES & SOIL HEALTH PROFILE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MandiPriceCard
                initialCrop={typeof primaryFarm?.crop === 'object' && primaryFarm.crop ? primaryFarm.crop.name : (typeof primaryFarm?.crop === 'string' ? primaryFarm.crop : 'Wheat')}
                initialState={farmer.state || 'Punjab'}
                initialDistrict={primaryFarm?.district || farmer.district || 'Ludhiana'}
              />
              <SoilHealthProfileCard
                soilProfile={soilProfile}
                farmName={primaryFarm?.name}
              />
            </div>

            {/* FARM ANALYTICS & RECENT ALERTS (2-Column Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {farmAnalytics && <AnalyticsSnippetCard analytics={farmAnalytics} />}
              <AlertCard />
            </div>

            {/* RECENT ACTIVITY TIMELINE CARD */}
            <ActivityCard />
          </>
        )}
      </div>
    </AppShell>
  );
}
