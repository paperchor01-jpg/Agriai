'use client';

import React, { useState } from 'react';
import {
  Sprout,
  MapPin,
  TestTube2,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Droplets,
  Layers,
} from 'lucide-react';
import { Farm, SoilCondition, CropInfo, FarmPractices, FarmLocationDetails } from '@/types';
import { createFarm } from '@/lib/farm-service';
import { Badge } from '@/components/ui/Badge';
import { FarmLocationSelector } from '@/components/location/FarmLocationSelector';

interface FarmOnboardingWizardProps {
  onComplete?: (newFarm: Farm) => void;
  farmerName?: string;
}

export function FarmOnboardingWizard({
  onComplete,
  farmerName = 'Farmer',
}: FarmOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 1: Farm Details
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [stateName, setStateName] = useState<string>('');
  const [districtName, setDistrictName] = useState<string>('');
  const [locationDetails, setLocationDetails] = useState<FarmLocationDetails | undefined>(undefined);
  const [areaAcres, setAreaAcres] = useState('');
  const [irrigationAvailability, setIrrigationAvailability] = useState<'Available' | 'Limited' | 'Rainfed'>('Available');

  // Step 2: Soil Telemetry
  const [soilType, setSoilType] = useState('Loamy');
  const [soilPh, setSoilPh] = useState('6.8');
  const [nitrogen, setNitrogen] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [phosphorus, setPhosphorus] = useState<'Low' | 'Medium' | 'High'>('High');
  const [potassium, setPotassium] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [soilMoisture, setSoilMoisture] = useState('60');

  // Step 3: Crop Details & Practice
  const [cropName, setCropName] = useState('Wheat');
  const [cropVariety, setCropVariety] = useState('');
  const [cropStage, setCropStage] = useState('Flowering');
  const [plantingDate, setPlantingDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [irrigationMethod, setIrrigationMethod] = useState('Drip');
  const [fertilizerPractice, setFertilizerPractice] = useState('Integrated / Mixed');
  const [pestPractice, setPestPractice] = useState('Integrated Pest Management (IPM)');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!name.trim()) errors.name = 'Please enter a name for your farm.';
      if (!location.trim()) errors.location = 'Please specify your farm district or location.';
      const area = parseFloat(areaAcres);
      if (!areaAcres || isNaN(area) || area <= 0 || area > 50000) {
        errors.areaAcres = 'Enter a valid land area in acres (e.g. 2.5).';
      }
    } else if (step === 2) {
      const ph = parseFloat(soilPh);
      if (isNaN(ph) || ph < 3.0 || ph > 11.0) {
        errors.soilPh = 'Soil pH must be between 3.0 and 11.0.';
      }
      const moisture = parseInt(soilMoisture);
      if (isNaN(moisture) || moisture < 0 || moisture > 100) {
        errors.soilMoisture = 'Soil moisture must be between 0% and 100%.';
      }
    } else if (step === 3) {
      if (!cropName.trim()) errors.cropName = 'Please select or specify a crop.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrorMsg(null);
      setCurrentStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setErrorMsg('Please check all previous steps for valid entries.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const area = parseFloat(areaAcres) || 4.2;
    const ph = parseFloat(soilPh) || 6.8;
    const moisture = parseInt(soilMoisture) || 60;

    const soil: SoilCondition = {
      soilType,
      ph,
      nitrogen,
      phosphorus,
      potassium,
      moisture,
    };

    const crop: CropInfo = {
      name: cropName.trim(),
      variety: cropVariety.trim() || undefined,
      stage: cropStage,
      plantingDate,
    };

    const practices: FarmPractices = {
      irrigationMethod,
      fertilizerPractice,
      pestPractice,
    };

    const farmPayload: Partial<Farm> = {
      name: name.trim(),
      location: location.trim() || 'Ludhiana, Punjab',
      latitude,
      longitude,
      state: stateName,
      district: districtName,
      locationDetails,
      areaAcres: area,
      irrigationAvailability,
      soil,
      crop,
      practices,
      healthScore: 85,
      status: 'Healthy',
      riskLevel: 'Low',
      expectedYieldTons: Number((area * 0.67).toFixed(1)),
      soilType,
      cropVariety: cropVariety.trim() || undefined,
      plantingDate,
      irrigationType: irrigationMethod,
    };

    try {
      const created = await createFarm(farmPayload);
      if (onComplete) {
        onComplete(created);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('agriai:farms-updated'));
      }
    } catch (err: any) {
      console.error('Error saving onboarded farm:', err);
      setErrorMsg('Failed to save farm details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Farm Info', icon: MapPin },
    { num: 2, title: 'Soil Telemetry', icon: TestTube2 },
    { num: 3, title: 'Crop Details', icon: Sprout },
    { num: 4, title: 'Review & Launch', icon: Sparkles },
  ];

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800/80 shadow-sm text-left max-w-3xl mx-auto">
      {/* Onboarding Header Banner */}
      <div className="pb-6 border-b border-slate-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
              First-Time Farm Setup
            </span>
            <span className="text-xs text-slate-400 dark:text-zinc-500">•</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400">Step {currentStep} of 4</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-1">
            Welcome to AgriAI, {farmerName.split(' ')[0]} 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
            Add your actual farm plot to activate personalized crop diagnostics, live microclimate risks, and smart advisories.
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-emerald-600 dark:bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20 shrink-0">
          <Sprout className="w-6 h-6" />
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="grid grid-cols-4 gap-2 my-6">
        {steps.map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          const Icon = step.icon;

          return (
            <div
              key={step.num}
              className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all ${
                isCurrent
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500/80 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-200 font-bold'
                  : isDone
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'bg-slate-50/80 dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                )}
                <span className="text-xs hidden sm:inline">{step.title}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-700 h-1 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isDone || isCurrent ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-transparent'
                  }`}
                  style={{ width: isDone ? '100%' : isCurrent ? '50%' : '0%' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Farm Information */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Step 1: Your Farm Location & Size</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Enter basic details about your primary agricultural land holding.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
              Farm Plot Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. Sunrise Organic Farm, Plot No. 4"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                fieldErrors.name
                  ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/30 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                  : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500'
              }`}
            />
            {fieldErrors.name && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Farm Location with Consent & Map Picker */}
          <div>
            <FarmLocationSelector
              value={location}
              latitude={latitude}
              longitude={longitude}
              state={stateName}
              district={districtName}
              onChange={(details) => {
                setLocation(details.location);
                setLatitude(details.latitude);
                setLongitude(details.longitude);
                if (details.state) setStateName(details.state);
                if (details.district) setDistrictName(details.district);
                if (details.locationDetails) setLocationDetails(details.locationDetails);
                if (fieldErrors.location) setFieldErrors((prev) => ({ ...prev, location: '' }));
              }}
              error={fieldErrors.location}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                Land Area (Acres) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={areaAcres}
                onChange={(e) => {
                  setAreaAcres(e.target.value);
                  if (fieldErrors.areaAcres) setFieldErrors((prev) => ({ ...prev, areaAcres: '' }));
                }}
                placeholder="e.g. 3.5"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                  fieldErrors.areaAcres
                    ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/30 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                    : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500'
                }`}
              />
              {fieldErrors.areaAcres && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">{fieldErrors.areaAcres}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                Irrigation Availability
              </label>
              <select
                value={irrigationAvailability}
                onChange={(e) => setIrrigationAvailability(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Available">Available (Canal / Tube well / Borewell)</option>
                <option value="Limited">Limited / Seasonal Access</option>
                <option value="Rainfed">Rainfed Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Soil Telemetry */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <TestTube2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Step 2: Soil Profile & Chemistry</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              These values calibrate nutrient recommendations and irrigation schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                Soil Type
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Loamy">Loamy (Optimal aeration)</option>
                <option value="Clay">Clay (High water retention)</option>
                <option value="Clay Loam">Clay Loam (Balanced)</option>
                <option value="Sandy Loam">Sandy Loam (Fast drainage)</option>
                <option value="Black / Regur">Black / Regur (Cotton & Pulses)</option>
                <option value="Alluvial">Alluvial (Indo-Gangetic plains)</option>
                <option value="Red">Red Soil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                Soil pH Level
              </label>
              <input
                type="number"
                step="0.1"
                min="3.0"
                max="11.0"
                value={soilPh}
                onChange={(e) => setSoilPh(e.target.value)}
                placeholder="e.g. 6.8"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 dark:text-zinc-500">Typical healthy range: 6.2 – 7.5</span>
            </div>
          </div>

          {/* Soil Moisture Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                Topsoil Moisture: <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{soilMoisture}%</span>
              </label>
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                {parseInt(soilMoisture) >= 55 && parseInt(soilMoisture) <= 70
                  ? 'Optimal Hydration'
                  : parseInt(soilMoisture) < 45
                  ? 'Dry / Needs Water'
                  : 'High Moisture'}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(e.target.value)}
              className="w-full h-2 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-zinc-500 mt-1">
              <span>10% (Dry)</span>
              <span>60% (Optimal)</span>
              <span>100% (Saturated)</span>
            </div>
          </div>

          {/* NPK Macro-nutrients */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 block">
              Soil N-P-K Macro-Nutrient Availability
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">Nitrogen (N)</label>
                <select
                  value={nitrogen}
                  onChange={(e) => setNitrogen(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">Phosphorus (P)</label>
                <select
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">Potassium (K)</label>
                <select
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Crop Details & Practice */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Step 3: Active Crop & Cultivation Practices</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Select what crop you are currently growing and its phenological stage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                Crop Name <span className="text-rose-500">*</span>
              </label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Wheat">Wheat</option>
                <option value="Rice / Paddy">Rice / Paddy</option>
                <option value="Mustard">Mustard</option>
                <option value="Cotton">Cotton</option>
                <option value="Maize">Maize</option>
                <option value="Chickpea / Gram">Chickpea / Gram</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Potato">Potato</option>
                <option value="Tomato">Tomato</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                Crop Variety (Optional)
              </label>
              <input
                type="text"
                value={cropVariety}
                onChange={(e) => setCropVariety(e.target.value)}
                placeholder="e.g. HD-2967, PBW-343, Pusa Bold"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                Phenological Growth Stage
              </label>
              <select
                value={cropStage}
                onChange={(e) => setCropStage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Seedling">Seedling (0–20 days)</option>
                <option value="Vegetative">Vegetative (20–45 days)</option>
                <option value="Tillering">Tillering / Branching</option>
                <option value="Flowering">Flowering (Critical water stage)</option>
                <option value="Grain Filling">Grain Filling / Pod Formation</option>
                <option value="Maturity / Harvest">Maturity / Pre-harvest</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                Sowing / Planting Date
              </label>
              <input
                type="date"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                Irrigation System
              </label>
              <select
                value={irrigationMethod}
                onChange={(e) => setIrrigationMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Drip">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler System</option>
                <option value="Canal / Flood">Canal / Surface Flood</option>
                <option value="Rainfed">Rainfed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                Fertilizer Practice
              </label>
              <select
                value={fertilizerPractice}
                onChange={(e) => setFertilizerPractice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Integrated / Mixed">Integrated (Chemical + Organic)</option>
                <option value="Chemical / Synthetic">Chemical / Synthetic (Urea, DAP)</option>
                <option value="Organic / Bio-fertilizer">Organic / Bio-fertilizer</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Launch */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 mb-4">
            <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Step 4: Review & Launch Your Real Dashboard</span>
            </h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
              Confirm your farm parameters. AgriAI will immediately synthesize live weather, risk calculations, and smart advisories tailored to this plot.
            </p>
          </div>

          {/* Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                Farm Holding
              </span>
              <p className="text-base font-extrabold text-slate-900 dark:text-zinc-100">{name || 'My Farm'}</p>
              <p className="text-xs text-slate-600 dark:text-zinc-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                <span>{location || 'Punjab'}</span> • <strong>{areaAcres || '4.2'} acres</strong>
              </p>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Irrigation: <strong>{irrigationAvailability}</strong> ({irrigationMethod})
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                Crop & Soil
              </span>
              <p className="text-base font-extrabold text-emerald-900 dark:text-emerald-300">
                {cropName} {cropVariety ? `(${cropVariety})` : ''}
              </p>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Growth Stage: <strong>{cropStage}</strong>
              </p>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Soil: <strong>{soilType}</strong> (pH {soilPh}, Moisture {soilMoisture}%)
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-zinc-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Strict Data Isolation Active</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              This farm will be registered under your unique authenticated account ID. You can manage or add more plots anytime in My Farms.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Next: {steps[currentStep].title}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Registering Farm...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Farm & Launch Dashboard</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
