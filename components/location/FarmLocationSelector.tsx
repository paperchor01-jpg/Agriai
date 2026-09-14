'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Globe2,
  CheckCircle2,
  Edit2,
  AlertCircle,
  Loader2,
  Layers,
} from 'lucide-react';
import { FarmLocationDetails } from '@/types';
import {
  getIndianStates,
  getDistrictsByState,
  getDistrictCoordinates,
  formatCoordinates,
  validateCoordinates,
} from '@/lib/location-service';
import { LocationConsentModal } from './LocationConsentModal';
import { InteractiveLocationPickerModal } from './InteractiveLocationPickerModal';

interface FarmLocationSelectorProps {
  value: string;
  latitude?: number;
  longitude?: number;
  state?: string;
  district?: string;
  onChange: (details: {
    location: string;
    latitude?: number;
    longitude?: number;
    state?: string;
    district?: string;
    locationDetails?: FarmLocationDetails;
  }) => void;
  error?: string;
  disabled?: boolean;
}

export function FarmLocationSelector({
  value,
  latitude,
  longitude,
  state: initialPropState,
  district: initialPropDistrict,
  onChange,
  error,
  disabled = false,
}: FarmLocationSelectorProps) {
  const [mode, setMode] = useState<'prompt' | 'manual' | 'confirmed'>(
    value || (latitude && longitude) ? 'confirmed' : 'prompt'
  );

  // Modals state
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Initial Coordinates for Map Modal (Default centroid of India)
  const [targetLat, setTargetLat] = useState<number>(latitude || 20.5937);
  const [targetLon, setTargetLon] = useState<number>(longitude || 78.9629);

  // Manual Dropdowns State
  const statesList = getIndianStates();
  const [selectedState, setSelectedState] = useState<string>(initialPropState || '');
  const [districtsList, setDistrictsList] = useState<string[]>(
    initialPropState ? getDistrictsByState(initialPropState) : []
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialPropDistrict || '');
  const [villageName, setVillageName] = useState<string>('');

  useEffect(() => {
    if (initialPropState) {
      setSelectedState(initialPropState);
      const dList = getDistrictsByState(initialPropState);
      setDistrictsList(dList);
      if (initialPropDistrict && dList.includes(initialPropDistrict)) {
        setSelectedDistrict(initialPropDistrict);
      }
    }
  }, [initialPropState, initialPropDistrict]);

  // Handle State Change in Manual Mode
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    if (!newState) {
      setDistrictsList([]);
      setSelectedDistrict('');
      return;
    }
    const dList = getDistrictsByState(newState);
    setDistrictsList(dList);
    setSelectedDistrict('');
  };

  // Handle District Change in Manual Mode
  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    if (!newDistrict || !selectedState) return;
    const coords = getDistrictCoordinates(selectedState, newDistrict);
    const locString = villageName.trim()
      ? `${villageName.trim()}, ${newDistrict}, ${selectedState}`
      : `${newDistrict}, ${selectedState}`;

    onChange({
      location: locString,
      latitude: coords.lat,
      longitude: coords.lon,
      state: selectedState,
      district: newDistrict,
      locationDetails: {
        country: 'India',
        state: selectedState,
        district: newDistrict,
        village: villageName.trim() || undefined,
        latitude: coords.lat,
        longitude: coords.lon,
        formattedAddress: locString,
      },
    });
  };

  // Handle Village / Landmark Input
  const handleVillageChange = (newVillage: string) => {
    setVillageName(newVillage);
    if (!selectedState || !selectedDistrict) return;
    const coords = getDistrictCoordinates(selectedState, selectedDistrict);
    const locString = newVillage.trim()
      ? `${newVillage.trim()}, ${selectedDistrict}, ${selectedState}`
      : `${selectedDistrict}, ${selectedState}`;

    onChange({
      location: locString,
      latitude: coords.lat,
      longitude: coords.lon,
      state: selectedState,
      district: selectedDistrict,
      locationDetails: {
        country: 'India',
        state: selectedState,
        district: selectedDistrict,
        village: newVillage.trim() || undefined,
        latitude: coords.lat,
        longitude: coords.lon,
        formattedAddress: locString,
      },
    });
  };

  // Step 1: User clicks "Set My Location from Google Maps"
  const handleMapButtonClick = () => {
    setGeoError(null);
    setShowConsentModal(true);
  };

  // Step 2: User explicitly consents in Consent Modal
  const handleConsentAllow = () => {
    setShowConsentModal(false);
    setIsLocating(true);
    setGeoError(null);

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          const detectedLat = position.coords.latitude;
          const detectedLon = position.coords.longitude;
          setTargetLat(detectedLat);
          setTargetLon(detectedLon);
          setShowMapModal(true);
        },
        (err) => {
          console.warn('Browser geolocation denied or failed:', err);
          setIsLocating(false);
          // Gracefully fallback to manual selection without blocking
          setMode('manual');
          setGeoError('Device location access was not granted. Please select your State & District manually.');
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
      setMode('manual');
    }
  };

  // User chooses "Choose Manually" in Consent Modal
  const handleConsentChooseManually = () => {
    setShowConsentModal(false);
    setMode('manual');
  };

  // Step 3: User confirms location in Map Modal
  const handleMapConfirm = (details: FarmLocationDetails) => {
    const locString = details.formattedAddress || `${details.district || 'Ludhiana'}, ${details.state || 'Punjab'}`;
    setSelectedState(details.state);
    setSelectedDistrict(details.district);
    setMode('confirmed');

    onChange({
      location: locString,
      latitude: details.latitude,
      longitude: details.longitude,
      state: details.state,
      district: details.district,
      locationDetails: details,
    });
  };

  return (
    <div className="space-y-3">
      {/* Consent Modal */}
      <LocationConsentModal
        isOpen={showConsentModal}
        onAllow={handleConsentAllow}
        onChooseManually={handleConsentChooseManually}
        onClose={() => setShowConsentModal(false)}
      />

      {/* Interactive Map Picker Modal */}
      <InteractiveLocationPickerModal
        isOpen={showMapModal}
        initialLat={targetLat}
        initialLon={targetLon}
        initialLocationName={value || `${selectedDistrict}, ${selectedState}`}
        onConfirm={handleMapConfirm}
        onClose={() => setShowMapModal(false)}
      />

      {/* Mode 1: Initial Prompt / Dual Selection Buttons */}
      {mode === 'prompt' && (
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200">
                Farm Location <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Choose how you would like to set your farm&apos;s geographical coordinates.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('manual')}
                disabled={disabled}
                className="px-3.5 py-2 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                Select location manually
              </button>

              <button
                type="button"
                onClick={handleMapButtonClick}
                disabled={disabled || isLocating}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Detecting...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>📍 Set My Location from Google Maps</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Manual Dropdowns Hierarchy (Country -> State -> District -> Village) */}
      {mode === 'manual' && (
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-zinc-700/60">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Manual Location Selection</span>
            </div>
            <button
              type="button"
              onClick={handleMapButtonClick}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Use Map Instead</span>
            </button>
          </div>

          {geoError && (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{geoError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Country
              </label>
              <input
                type="text"
                value="India"
                disabled
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900/60 text-xs font-semibold text-slate-500 dark:text-zinc-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
                State <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                disabled={disabled}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-slate-800 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Select State --</option>
                {statesList.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
                District <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={disabled || !selectedState}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-slate-800 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 dark:disabled:bg-zinc-900/40 disabled:text-slate-400 dark:disabled:text-zinc-600"
              >
                <option value="">{selectedState ? '-- Select District --' : '-- Select State first --'}</option>
                {districtsList.map((dst) => (
                  <option key={dst} value={dst}>
                    {dst}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
              Village / Sub-District / Landmark (Optional)
            </label>
            <input
              type="text"
              value={villageName}
              onChange={(e) => handleVillageChange(e.target.value)}
              placeholder="e.g. Raikot, Jagraon, GT Road"
              disabled={disabled}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
            <span className="font-mono">
              Auto-calibrated Coordinates: {formatCoordinates(latitude, longitude)}
            </span>
            <button
              type="button"
              onClick={() => setMode('confirmed')}
              className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
            >
              Done Selecting
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Confirmed / Current Location Badge Card */}
      {mode === 'confirmed' && (
        <div className="glass-card p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
                  Location (District, State) <span className="text-rose-500">*</span>
                </span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-zinc-100">
                  {value || `${selectedDistrict}, ${selectedState}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMode('manual')}
                disabled={disabled}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 text-[11px] font-bold transition-all cursor-pointer"
              >
                Change Manually
              </button>

              <button
                type="button"
                onClick={handleMapButtonClick}
                disabled={disabled || isLocating}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Adjust on Map</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-zinc-700/60 text-[11px] text-slate-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span className="font-mono text-slate-600 dark:text-zinc-300 font-semibold">
                GPS: {formatCoordinates(latitude, longitude)}
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/40">
              Microclimate Enabled
            </span>
          </div>
        </div>
      )}

      {/* Field Level Error */}
      {error && (
        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
