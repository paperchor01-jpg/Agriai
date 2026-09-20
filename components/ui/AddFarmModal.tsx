"use client";

import React, { useState } from "react";
import { X, Sprout, Calendar, CheckCircle2 } from "lucide-react";
import { Farm, FarmLocationDetails } from "@/types";
import { FarmLocationSelector } from "@/components/location/FarmLocationSelector";

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFarm: (farm: Farm) => void;
}

export function AddFarmModal({ isOpen, onClose, onAddFarm }: AddFarmModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    location: string;
    latitude?: number;
    longitude?: number;
    state?: string;
    district?: string;
    locationDetails?: FarmLocationDetails;
    areaAcres: string;
    soilType: string;
    crop: string;
    cropVariety: string;
    plantingDate: string;
    irrigationType: Farm["irrigationType"];
  }>({
    name: "",
    location: "",
    latitude: undefined,
    longitude: undefined,
    state: "",
    district: "",
    locationDetails: undefined,
    areaAcres: "",
    soilType: "Loamy",
    crop: "Wheat",
    cropVariety: "",
    plantingDate: new Date().toISOString().split("T")[0],
    irrigationType: "Drip",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Farm name is required";
    if (!formData.location.trim()) errs.location = "Location is required";
    if (!formData.areaAcres || Number(formData.areaAcres) <= 0) {
      errs.areaAcres = "Valid area in acres is required";
    }
    if (!formData.crop.trim()) errs.crop = "Crop is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const area = parseFloat(formData.areaAcres);
      const newFarm: Farm = {
        id: `farm-${Date.now()}`,
        name: formData.name.trim(),
        location: formData.location.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
        state: formData.state,
        district: formData.district,
        locationDetails: formData.locationDetails,
        areaAcres: area,
        irrigationAvailability: "Available",
        soil: {
          soilType: formData.soilType,
          ph: 6.8,
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
          moisture: 62,
        },
        crop: {
          name: formData.crop.trim(),
          variety: formData.cropVariety.trim() || undefined,
          stage: "Flowering",
          plantingDate: formData.plantingDate,
        },
        practices: {
          irrigationMethod: formData.irrigationType || "Drip",
          fertilizerPractice: "Integrated / Mixed",
          pestPractice: "Integrated Pest Management (IPM)",
        },
        soilType: formData.soilType,
        cropVariety: formData.cropVariety.trim() || undefined,
        plantingDate: formData.plantingDate,
        healthScore: 85,
        status: "Healthy",
        riskLevel: "Low",
        irrigationType: formData.irrigationType,
        expectedYieldTons: Number((area * 0.65).toFixed(1)),
      };

      onAddFarm(newFarm);
      setIsSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 900);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Add New Farm Plot</h3>
              <p className="text-xs text-slate-500">Register crop details for AI intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Farm Registered Successfully!</h4>
            <p className="text-sm text-slate-500 mt-1">Farm intelligence baseline has been established.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Farm Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Farm / Plot Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. North Field Ridge"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all ${
                    errors.name ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* Location with Consent & Map Picker */}
              <div className="sm:col-span-2">
                <FarmLocationSelector
                  value={formData.location}
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  state={formData.state}
                  district={formData.district}
                  onChange={(details) => {
                    setFormData({
                      ...formData,
                      location: details.location,
                      latitude: details.latitude,
                      longitude: details.longitude,
                      state: details.state,
                      district: details.district,
                      locationDetails: details.locationDetails,
                    });
                    if (errors.location) setErrors({ ...errors, location: "" });
                  }}
                  error={errors.location}
                />
              </div>

              {/* Area in Acres */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Area (Acres) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 4.2"
                  value={formData.areaAcres}
                  onChange={(e) => setFormData({ ...formData, areaAcres: e.target.value })}
                  className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all ${
                    errors.areaAcres ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.areaAcres && <p className="text-xs text-rose-500 mt-1">{errors.areaAcres}</p>}
              </div>

              {/* Crop */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Primary Crop *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wheat"
                  value={formData.crop}
                  onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                  className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all ${
                    errors.crop ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.crop && <p className="text-xs text-rose-500 mt-1">{errors.crop}</p>}
              </div>

              {/* Variety */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Crop Variety (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. HD-2967"
                  value={formData.cropVariety}
                  onChange={(e) => setFormData({ ...formData, cropVariety: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
              </div>

              {/* Soil Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Soil Type
                </label>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                >
                  <option value="Loamy">Loamy (Optimal)</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Alluvial">Alluvial</option>
                  <option value="Black Soil">Black / Regur</option>
                </select>
              </div>

              {/* Irrigation Availability */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Irrigation Source
                </label>
                <select
                  value={formData.irrigationType}
                  onChange={(e) =>
                    setFormData({ ...formData, irrigationType: e.target.value as Farm["irrigationType"] })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                >
                  <option value="Drip">Drip Irrigation</option>
                  <option value="Sprinkler">Sprinkler System</option>
                  <option value="Canal / Flood">Canal / Borewell Flood</option>
                  <option value="Rainfed">Rainfed (No Permanent Supply)</option>
                </select>
              </div>

              {/* Sowing Date */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Planting / Sowing Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={formData.plantingDate}
                    onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? "Saving..." : "Save Farm Plot"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
