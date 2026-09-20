'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sprout,
  MapPin,
  Layers,
  Droplets,
  Calendar,
  CheckCircle2,
  TestTube2,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import { Farm, SoilCondition, CropInfo, FarmPractices, FarmLocationDetails } from '@/types';
import { FarmLocationSelector } from '@/components/location/FarmLocationSelector';

interface FarmFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (farm: Farm) => void;
  initialFarm?: Farm | null;
}

export function FarmFormModal({
  isOpen,
  onClose,
  onSave,
  initialFarm,
}: FarmFormModalProps) {
  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [stateName, setStateName] = useState<string>('');
  const [districtName, setDistrictName] = useState<string>('');
  const [locationDetails, setLocationDetails] = useState<FarmLocationDetails | undefined>(undefined);
  const [areaAcres, setAreaAcres] = useState('');
  const [irrigationAvailability, setIrrigationAvailability] = useState('Available');

  // Soil
  const [soilType, setSoilType] = useState('Loamy');
  const [soilPh, setSoilPh] = useState('6.8');
  const [nitrogen, setNitrogen] = useState('Medium');
  const [phosphorus, setPhosphorus] = useState('High');
  const [potassium, setPotassium] = useState('Medium');
  const [soilMoisture, setSoilMoisture] = useState('62');

  // Crop
  const [cropName, setCropName] = useState('Wheat');
  const [cropVariety, setCropVariety] = useState('');
  const [cropStage, setCropStage] = useState('Flowering');
  const [plantingDate, setPlantingDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Practices
  const [irrigationMethod, setIrrigationMethod] = useState('Drip');
  const [fertilizerPractice, setFertilizerPractice] = useState('Integrated / Mixed');
  const [pestPractice, setPestPractice] = useState('Integrated Pest Management (IPM)');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'general' | 'soil' | 'crop' | 'practices'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialFarm) {
      setName(initialFarm.name);
      setLocation(initialFarm.location);
      setLatitude(initialFarm.latitude);
      setLongitude(initialFarm.longitude);
      setStateName(initialFarm.state || '');
      setDistrictName(initialFarm.district || '');
      setLocationDetails(initialFarm.locationDetails);
      setAreaAcres(String(initialFarm.areaAcres));
      setIrrigationAvailability(initialFarm.irrigationAvailability || 'Available');

      const soil = initialFarm.soil || {
        soilType: initialFarm.soilType || 'Loamy',
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'High',
        potassium: 'Medium',
        moisture: 62,
      };
      setSoilType(soil.soilType || 'Loamy');
      setSoilPh(String(soil.ph || 6.8));
      setNitrogen(soil.nitrogen || 'Medium');
      setPhosphorus(soil.phosphorus || 'High');
      setPotassium(soil.potassium || 'Medium');
      setSoilMoisture(String(soil.moisture || 62));

      const crop = typeof initialFarm.crop === 'object' ? initialFarm.crop : {
        name: initialFarm.crop || 'Wheat',
        variety: initialFarm.cropVariety || '',
        stage: 'Flowering',
        plantingDate: initialFarm.plantingDate || new Date().toISOString().split('T')[0],
      };
      setCropName(crop.name || 'Wheat');
      setCropVariety(crop.variety || '');
      setCropStage(crop.stage || 'Flowering');
      setPlantingDate(crop.plantingDate || new Date().toISOString().split('T')[0]);

      const practices = initialFarm.practices || {
        irrigationMethod: initialFarm.irrigationType || 'Drip',
        fertilizerPractice: 'Integrated / Mixed',
        pestPractice: 'Integrated Pest Management (IPM)',
      };
      setIrrigationMethod(practices.irrigationMethod || 'Drip');
      setFertilizerPractice(practices.fertilizerPractice || 'Integrated / Mixed');
      setPestPractice(practices.pestPractice || 'Integrated Pest Management (IPM)');
    } else {
      // Default new farm
      setName('');
      setLocation('');
      setLatitude(undefined);
      setLongitude(undefined);
      setStateName('Punjab');
      setDistrictName('Ludhiana');
      setLocationDetails(undefined);
      setAreaAcres('');
      setIrrigationAvailability('Available');
      setSoilType('Loamy');
      setSoilPh('6.8');
      setNitrogen('Medium');
      setPhosphorus('High');
      setPotassium('Medium');
      setSoilMoisture('62');
      setCropName('Wheat');
      setCropVariety('');
      setCropStage('Flowering');
      setPlantingDate(new Date().toISOString().split('T')[0]);
      setIrrigationMethod('Drip');
      setFertilizerPractice('Integrated / Mixed');
      setPestPractice('Integrated Pest Management (IPM)');
    }
    setErrors({});
    setActiveTab('general');
    setIsSubmitting(false);
  }, [initialFarm, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Farm name is required.';
    }
    if (!location.trim()) {
      errs.location = 'Location is required.';
    }
    const areaNum = Number(areaAcres);
    if (!areaAcres || isNaN(areaNum) || areaNum <= 0 || areaNum > 50000) {
      errs.areaAcres = 'Enter a valid farm area between 0.1 and 50,000 acres.';
    }
    if (!cropName.trim()) {
      errs.cropName = 'Select a crop.';
    }
    const phVal = Number(soilPh);
    if (isNaN(phVal) || phVal < 3.0 || phVal > 11.0) {
      errs.soilPh = 'Soil pH must be between 3.0 and 11.0.';
    }
    const moistureVal = Number(soilMoisture);
    if (isNaN(moistureVal) || moistureVal < 0 || moistureVal > 100) {
      errs.soilMoisture = 'Soil moisture must be between 0% and 100%.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Switch to general tab if error is there
      if (errors.name || errors.location || errors.areaAcres) {
        setActiveTab('general');
      } else if (errors.cropName) {
        setActiveTab('crop');
      }
      return;
    }

    setIsSubmitting(true);

    const area = parseFloat(areaAcres);
    const phNum = parseFloat(soilPh) || 6.8;
    const moistureNum = parseInt(soilMoisture) || 60;

    const soil: SoilCondition = {
      soilType,
      ph: phNum,
      nitrogen,
      phosphorus,
      potassium,
      moisture: moistureNum,
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

    const updatedFarm: Farm = {
      id: initialFarm?.id || `farm-${Date.now()}`,
      name: name.trim(),
      location: location.trim(),
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
      healthScore: initialFarm?.healthScore || 86,
      status: initialFarm?.status || 'Healthy',
      riskLevel: initialFarm?.riskLevel || 'Low',
      expectedYieldTons: initialFarm?.expectedYieldTons || Number((area * 0.67).toFixed(1)),
      soilType,
      cropVariety: cropVariety.trim() || undefined,
      plantingDate,
      irrigationType: irrigationMethod,
    };

    onSave(updatedFarm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-card bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 dark:border-zinc-800/80 overflow-hidden text-left my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 dark:bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-zinc-100">
                {initialFarm ? 'Edit Farm Plot' : 'Add New Farm'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Configure farm, soil telemetry, crop stage and agronomic practices
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200 p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Errors Banner */}
        {Object.keys(errors).length > 0 && (
          <div className="mx-6 sm:mx-8 mt-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Please correct the following fields:</p>
              <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-rose-700 dark:text-rose-300">
                {Object.values(errors).map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tabs for Clean Organization */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 px-6 sm:px-8 pt-3 gap-2 overflow-x-auto">
          {[
            { id: 'general', label: '1. Farm Info', icon: MapPin },
            { id: 'soil', label: '2. Soil Telemetry', icon: TestTube2 },
            { id: 'crop', label: '3. Crop Stage', icon: Sprout },
            { id: 'practices', label: '4. Farm Practices', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as 'general' | 'soil' | 'crop' | 'practices')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-8 space-y-5 max-h-[60vh] overflow-y-auto">
            {/* 1. GENERAL FARM INFO */}
            {activeTab === 'general' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    Farm Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="e.g. Green Valley Farm"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                      errors.name
                        ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100'
                        : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
                      {errors.name}
                    </p>
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
                      if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
                    }}
                    error={errors.location}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                      Farm Area (Acres) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={areaAcres}
                      onChange={(e) => {
                        setAreaAcres(e.target.value);
                        if (errors.areaAcres) setErrors((prev) => ({ ...prev, areaAcres: '' }));
                      }}
                      placeholder="e.g. 4.2"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.areaAcres
                          ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100'
                          : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500'
                      }`}
                    />
                    {errors.areaAcres && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
                        {errors.areaAcres}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                      Irrigation Availability
                    </label>
                    <select
                      value={irrigationAvailability}
                      onChange={(e) => setIrrigationAvailability(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Available">Available (Canal / Tube well)</option>
                      <option value="Limited">Limited / Seasonal</option>
                      <option value="Rainfed">Rainfed Only</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SOIL TELEMETRY */}
            {activeTab === 'soil' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                      Soil Type
                    </label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Loamy">Loamy Soil</option>
                      <option value="Clay">Clay Soil</option>
                      <option value="Clay Loam">Clay Loam</option>
                      <option value="Sandy Loam">Sandy Loam</option>
                      <option value="Black / Regur">Black / Regur Soil</option>
                      <option value="Alluvial">Alluvial Soil</option>
                      <option value="Red">Red Soil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                      Soil pH
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="4.0"
                      max="9.5"
                      value={soilPh}
                      onChange={(e) => setSoilPh(e.target.value)}
                      placeholder="e.g. 6.8"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">Neutral range: 6.0 – 7.5</span>
                  </div>
                </div>

                {/* NPK Values */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 block">
                    Soil N-P-K Levels
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                        Nitrogen (N)
                      </label>
                      <select
                        value={nitrogen}
                        onChange={(e) => setNitrogen(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                        Phosphorus (P)
                      </label>
                      <select
                        value={phosphorus}
                        onChange={(e) => setPhosphorus(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                        Potassium (K)
                      </label>
                      <select
                        value={potassium}
                        onChange={(e) => setPotassium(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                      Soil Moisture Level: <span className="text-emerald-700 dark:text-emerald-400">{soilMoisture}%</span>
                    </label>
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
              </div>
            )}

            {/* 3. CROP INFORMATION */}
            {activeTab === 'crop' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                      Crop Name <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={cropName}
                      onChange={(e) => {
                        setCropName(e.target.value);
                        if (errors.cropName) setErrors((prev) => ({ ...prev, cropName: '' }));
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
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
                      placeholder="e.g. HD-2967, PBW-343"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                      Current Crop Stage
                    </label>
                    <select
                      value={cropStage}
                      onChange={(e) => setCropStage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Seedling">Seedling</option>
                      <option value="Vegetative">Vegetative</option>
                      <option value="Tillering">Tillering</option>
                      <option value="Flowering">Flowering</option>
                      <option value="Grain Filling">Grain Filling</option>
                      <option value="Maturity / Harvest">Maturity / Harvest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                      Planting Date
                    </label>
                    <input
                      type="date"
                      value={plantingDate}
                      onChange={(e) => setPlantingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. FARM PRACTICES */}
            {activeTab === 'practices' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    Irrigation Method
                  </label>
                  <select
                    value={irrigationMethod}
                    onChange={(e) => setIrrigationMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler System</option>
                    <option value="Canal / Flood">Canal / Surface Flood</option>
                    <option value="Furrow">Furrow Irrigation</option>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Integrated / Mixed">Integrated / Mixed (Chemical + Organic)</option>
                    <option value="Chemical / Synthetic">Chemical / Synthetic (Urea, DAP, NPK)</option>
                    <option value="Organic / Bio-fertilizer">Organic / Bio-fertilizer (FYM, Vermicompost)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    Pest Management Practice
                  </label>
                  <select
                    value={pestPractice}
                    onChange={(e) => setPestPractice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Integrated Pest Management (IPM)">
                      Integrated Pest Management (IPM)
                    </option>
                    <option value="Preventive Scouting">
                      Preventive Scouting & Threshold Spray
                    </option>
                    <option value="Biological / Organic">
                      Biological / Organic (Neem, Trichoderma)
                    </option>
                    <option value="Chemical Spray">
                      Chemical Spray Protocol
                    </option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving Farm...' : 'Save Farm'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
