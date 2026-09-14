'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TodayActionsSection } from '@/components/dashboard/TodayActionsSection';
import { CropCalendarSection } from '@/components/crop/CropCalendarSection';
import { NutrientAdvisorSection } from '@/components/crop/NutrientAdvisorSection';
import { IrrigationAdvisorSection } from '@/components/crop/IrrigationAdvisorSection';
import { CropRecommendationsCard } from '@/components/crop/CropRecommendationsCard';
import { MarketWatchSection } from '@/components/crop/MarketWatchSection';
import { CropEconomicsSection } from '@/components/crop/CropEconomicsSection';
import { GovernmentSchemesSection } from '@/components/crop/GovernmentSchemesSection';
import { FarmPassportModal } from '@/components/farms/FarmPassportModal';

import { getStoredFarms, getStoredFarmer } from '@/lib/mock-data';
import { todayActionsService } from '@/lib/today-actions-service';
import { cropCalendarService } from '@/lib/crop-calendar-service';
import { nutrientService } from '@/lib/nutrient-service';
import { irrigationService } from '@/lib/irrigation-service';
import { cropRecommendationService } from '@/lib/crop-recommendation-service';
import { marketService } from '@/lib/market-service';
import { economicsService } from '@/lib/economics-service';
import { schemeService } from '@/lib/scheme-service';
import { passportService } from '@/lib/passport-service';
import { getWeather } from '@/lib/weather-service';
import { Farm, WeatherData, FarmerProfile } from '@/types';
import Link from 'next/link';
import { Sprout, Plus, FileText, ArrowRight } from 'lucide-react';

export default function CropHubPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [passportOpen, setPassportOpen] = useState(false);

  const loadWeatherData = async (farm: Farm) => {
    try {
      const lat = farm.latitude || farm.locationDetails?.latitude;
      const lon = farm.longitude || farm.locationDetails?.longitude;
      const w = await getWeather(farm.location, lat, lon);
      setWeather(w);
    } catch (e) {
      console.error("Error loading weather for crop hub", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadedFarms = getStoredFarms();
    const loadedFarmer = getStoredFarmer();
    setFarms(loadedFarms);
    setFarmer(loadedFarmer);

    if (loadedFarms.length > 0) {
      const active = loadedFarms[0];
      setSelectedFarm(active);
      loadWeatherData(active);
    } else {
      setLoading(false);
    }
  }, []);

  const handleSelectFarm = (farmId: string) => {
    const f = farms.find(x => x.id === farmId);
    if (f) {
      setSelectedFarm(f);
      loadWeatherData(f);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Loading Crop Hub intelligence...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (farms.length === 0 || !selectedFarm) {
    return (
      <AppShell>
        <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-3xl mx-auto mb-4">
            🌾
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            No Crops Found
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
            You have not registered any farms or crops yet. Add your farm plot and crop details to access personalized daily actions, crop calendar, nutrient advice, and market intelligence.
          </p>
          <Link
            href="/farms"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Farm</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  // Derive domain models
  const todayActions = todayActionsService.getTodayActions(selectedFarm, weather);
  const cropCalendar = cropCalendarService.getCropCalendar(selectedFarm);
  const nutrientAdvice = nutrientService.getNutrientAdvice(selectedFarm);
  const irrigationAdvice = irrigationService.getIrrigationAdvice(selectedFarm, weather);
  const cropRecs = cropRecommendationService.getRecommendationsForFarm(selectedFarm);
  const mandiPrices = marketService.getMandiPrices(
    selectedFarm.crop?.name || "Wheat",
    selectedFarm.state || selectedFarm.locationDetails?.state || "",
    selectedFarm.district || selectedFarm.locationDetails?.district || ""
  );
  const economics = economicsService.calculateEconomics(selectedFarm);
  const schemes = schemeService.getAllSchemes();
  const passport = passportService.getFarmPassport(selectedFarm, farmer?.name || "Verified Farmer");

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header & Farm Switcher */}
        <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">🌱</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Crop Intelligence Hub
              </h1>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              End-to-end crop lifecycle, daily agronomic actions, nutrients, water balance, and economics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Farm Selector */}
            <div className="relative">
              <select
                value={selectedFarm.id}
                onChange={(e) => handleSelectFarm(e.target.value)}
                className="text-xs font-semibold px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.crop?.name || 'Crop'} • {f.areaAcres} Ac)
                  </option>
                ))}
              </select>
            </div>

            {/* Farm Digital Passport Trigger */}
            <button
              onClick={() => setPassportOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors shadow-2xs"
            >
              <FileText className="w-4 h-4" />
              <span>Digital Farm Passport</span>
            </button>
          </div>
        </div>

        {/* 1. 🌾 What Should I Do Today? */}
        <TodayActionsSection actions={todayActions} farmName={selectedFarm.name} />

        {/* 2. 📅 Crop Calendar & Lifecycle */}
        <CropCalendarSection data={cropCalendar} />

        {/* 3. 🧪 Nutrient Advisor & 💧 Irrigation Advisor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NutrientAdvisorSection data={nutrientAdvice} cropName={selectedFarm.crop?.name} />
          <IrrigationAdvisorSection data={irrigationAdvice} farmName={selectedFarm.name} />
        </div>

        {/* 4. 🤖 AI Crop Recommendations */}
        <CropRecommendationsCard data={cropRecs} />

        {/* 5. 📈 Mandi Market Watch */}
        <MarketWatchSection data={mandiPrices} />

        {/* 6. 💰 Crop Economics & Profit Projection */}
        <CropEconomicsSection data={economics} />

        {/* 7. 🏛 Government Schemes */}
        <GovernmentSchemesSection schemes={schemes} />

        {/* Digital Farm Passport Modal */}
        <FarmPassportModal
          isOpen={passportOpen}
          onClose={() => setPassportOpen(false)}
          passport={passport}
        />
      </div>
    </AppShell>
  );
}
