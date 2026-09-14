'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CloudSun,
  CloudRain,
  Sun,
  MapPin,
  RefreshCw,
  Compass,
  Eye,
  Sprout,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ForecastCard } from '@/components/weather/ForecastCard';
import { WeatherAdvice } from '@/components/weather/WeatherAdvice';
import { RiskCard } from '@/components/dashboard/RiskCard';
import { Badge } from '@/components/ui/Badge';
import {
  DEFAULT_FARMS,
  DEFAULT_WEATHER,
  getStoredFarms,
  getSelectedFarmId,
  saveSelectedFarmId,
} from '@/lib/mock-data';
import { getWeather } from '@/lib/weather-service';
import { WeatherData, Farm } from '@/types';

export default function WeatherPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const storedFarms = getStoredFarms();
      setFarms(storedFarms);
      const sel = getSelectedFarmId();
      if (sel) {
        setSelectedFarmId(sel);
      } else if (storedFarms.length > 0) {
        setSelectedFarmId(storedFarms[0].id);
      } else {
        setSelectedFarmId('');
      }
    };

    sync();
    window.addEventListener('agriai:farms-updated', sync);
    return () => window.removeEventListener('agriai:farms-updated', sync);
  }, []);

  const activeFarm = farms.find((f) => f.id === selectedFarmId) || (farms.length > 0 ? farms[0] : null);
  const targetLocation = activeFarm?.location || '';
  const targetLat = activeFarm?.latitude;
  const targetLon = activeFarm?.longitude;

  const fetchWeatherData = async (loc: string, lat?: number, lon?: number) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await getWeather(loc, lat, lon);
      setWeather(data);
      if (data.isFallback) {
        setFetchError('Live meteorological service returned demo fallback data.');
      }
    } catch {
      setFetchError('Unable to reach live weather provider. Using regional fallback.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (targetLocation || (targetLat !== undefined && targetLon !== undefined)) {
      fetchWeatherData(targetLocation, targetLat, targetLon);
    }
  }, [targetLocation, targetLat, targetLon]);

  const handleFarmChange = (newFarmId: string) => {
    setSelectedFarmId(newFarmId);
    saveSelectedFarmId(newFarmId);
  };

  const current = weather.current || weather;

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto text-left">
        {/* 1. Page Header with Title, Subtitle, and Farm Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/20">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                  Weather Intelligence
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Microclimate forecasts, spraying windows and severe weather warnings.
                </p>
              </div>
            </div>
          </div>

          {/* Farm Switcher */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 dark:border-zinc-700/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
                Target Farm Plot
              </span>
              {farms.length > 0 ? (
                <select
                  value={selectedFarmId}
                  onChange={(e) => handleFarmChange(e.target.value)}
                  className="text-xs font-bold bg-transparent text-slate-900 dark:text-zinc-100 focus:outline-hidden cursor-pointer"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id} className="dark:bg-zinc-900 dark:text-zinc-100">
                      {f.name} ({f.location})
                    </option>
                  ))}
                </select>
              ) : (
                <Link
                  href="/farms"
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline block"
                >
                  + Add Farm Plot
                </Link>
              )}
            </div>
          </div>
        </div>

        {farms.length === 0 && (
          <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>You have not set a farm location yet. Register your farm plot in My Farms to enable plot-level microclimate radar and spray advisories.</span>
            </span>
            <Link
              href="/farms"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs shrink-0"
            >
              Add Farm
            </Link>
          </div>
        )}

        {/* Current Weather Hero Banner & Key Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.2fr)_minmax(320px,0.9fr)] gap-6 items-stretch">
          {/* Main Weather Card (Large Hero) */}
          <div className="min-w-0 w-full bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 dark:border-emerald-900/40 flex flex-col justify-between relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white tracking-tight">
                    {weather.location}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-emerald-300 font-semibold">
                    {activeFarm ? activeFarm.name : 'Regional Radar'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Fetching Live Radar...
                    </span>
                  ) : weather.isFallback ? (
                    <Badge variant="warning" size="sm">
                      Demo Fallback
                    </Badge>
                  ) : (
                    <Badge variant="emerald" size="sm">
                      Live Weather Radar
                    </Badge>
                  )}
                  <button
                    type="button"
                    onClick={() => fetchWeatherData(targetLocation)}
                    disabled={isLoading}
                    title="Refresh Weather Data"
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-6">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                      {current.temperature}°C
                    </span>
                    <span className="text-sm font-semibold text-slate-300">
                      Feels like {current.feelsLike || current.temperature + 1}°C
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-emerald-300 mt-2">
                    {current.condition}
                  </h2>
                </div>

                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center text-amber-400 shadow-inner">
                  <CloudSun className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>
              </div>
            </div>

            {/* Quick Microclimate Sub-stats */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Humidity
                </span>
                <p className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                  {`${current.humidity}%`}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Rain Chance
                </span>
                <p className="text-base sm:text-lg font-extrabold text-sky-400 mt-0.5">
                  {`${current.rainChance}%`}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Wind Speed
                </span>
                <p className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                  {`${current.windSpeedKmH} km/h`}
                </p>
              </div>
            </div>
          </div>

          {/* Side Telemetry Details */}
          <div className="w-full lg:min-w-[320px] xl:min-w-[340px] glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                  Atmospheric Telemetry
                </h3>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  Micro-Sensors
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {/* Wind Telemetry (Direction & Speed) */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-semibold mb-1.5">
                      <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">Wind Direction</span>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                      {current.windDirection || 'NW'}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-zinc-400 font-medium">Wind Speed</span>
                    <span className="font-bold text-slate-800 dark:text-zinc-200">{current.windSpeedKmH} km/h</span>
                  </div>
                </div>

                {/* UV & Exposure Index */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-semibold mb-1.5">
                      <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="truncate">UV Index</span>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                      {current.uvIndex || 6} <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500">/ 10</span>
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Moderate exposure</span>
                  </div>
                </div>

                {/* Air Quality Index (AQI) Card */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 col-span-2 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <Eye className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span>Air Quality Index (AQI)</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                      {current.airQuality ? `AQI • ${current.airQuality}` : 'AQI • Moderate (68)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                    Acceptable for outdoor agricultural machinery and manual field tillage operations.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Precipitation Window Alert Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100/80 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <CloudRain className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="font-extrabold text-amber-900 dark:text-amber-300 block">
                  Next Precipitation Window
                </span>
                <p className="text-[11px] text-amber-800 dark:text-amber-200/90 leading-relaxed">
                  Light rain expected in 36 hours. Avoid heavy pre-irrigation to prevent nutrient leaching.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 5-Day Forecast Grid (Requirement 2) */}
        <ForecastCard forecast={weather.forecast} />

        {/* 3. Farming Weather Advice (Requirement 3 & 4) */}
        <WeatherAdvice adviceList={weather.farmingAdvice} />

        {/* 5. Farm Risk Monitor Section (Requirement 5, 6) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                Farm Risk Monitor
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                Rule-based risk indices calculated for {activeFarm ? activeFarm.name : targetLocation}
              </p>
            </div>
            <Link
              href="/advisory"
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
            >
              View Full Advisory →
            </Link>
          </div>

          <RiskCard risks={weather.risks} />
        </div>
      </div>
    </AppShell>
  );
}
