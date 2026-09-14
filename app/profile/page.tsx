'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  MapPin,
  Sprout,
  Languages,
  CheckCircle2,
  Edit3,
  Save,
  Layers,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  Globe,
  Palette,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/Badge';
import { ThemeSelector } from '@/components/theme/ThemeToggle';
import {
  getStoredFarmer,
  saveStoredFarmer,
  getStoredFarms,
  DEFAULT_FARMER,
} from '@/lib/mock-data';
import { getCurrentUser } from '@/lib/auth-service';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { FarmerProfile, Farm } from '@/types';
import { FarmLocationSelector } from '@/components/location/FarmLocationSelector';

export default function ProfilePage() {
  const [profile, setProfile] = useState<FarmerProfile>(DEFAULT_FARMER);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FarmerProfile>(DEFAULT_FARMER);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      const loadedFarmer = getStoredFarmer();
      if (isMounted) {
        setProfile(loadedFarmer);
        setFormData(loadedFarmer);
        setFarms(getStoredFarms());
      }

      if (isSupabaseConfigured()) {
        const client = getSupabaseClient();
        const user = await getCurrentUser();
        if (client && user?.id) {
          try {
            const { data: dbFarmer } = await client
              .from('farmers')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();

            if (isMounted && dbFarmer) {
              const merged: FarmerProfile = {
                ...loadedFarmer,
                name: dbFarmer.name || loadedFarmer.name,
                location: dbFarmer.location || loadedFarmer.location,
                farmSizeAcres: Number(dbFarmer.farm_size) || loadedFarmer.farmSizeAcres,
                preferredLanguage: (dbFarmer.preferred_language as any) || loadedFarmer.preferredLanguage,
                email: user.email || loadedFarmer.email,
              };
              setProfile(merged);
              setFormData(merged);
              saveStoredFarmer(merged);
            }
          } catch (err) {
            console.warn('Could not query farmer profile from Supabase:', err);
          }
        }
      }
    };

    loadProfileData();

    const handleProfileUpdate = () => {
      const updated = getStoredFarmer();
      setProfile(updated);
    };

    window.addEventListener('agriai:profile-updated', handleProfileUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('agriai:profile-updated', handleProfileUpdate);
    };
  }, []);

  const handleEditToggle = () => {
    if (!isEditing) {
      setFormData(profile);
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredFarmer(formData);
    setProfile(formData);

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      const user = await getCurrentUser();
      if (client && user?.id) {
        try {
          await client.from('farmers').upsert({
            id: user.id,
            name: formData.name,
            location: formData.location,
            farm_size: formData.farmSizeAcres,
            preferred_language: formData.preferredLanguage,
          });
        } catch (err) {
          console.warn('Could not persist profile changes to Supabase:', err);
        }
      }
    }

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const totalFarmAcres = farms.length > 0
    ? farms.reduce((sum, f) => sum + (f.areaAcres || 0), 0)
    : profile.farmSizeAcres;

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto text-left">
        {/* 1. Header with Title and Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                  My Profile
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Manage your farmer information, regional settings, and display appearance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <div className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Profile updated successfully.</span>
              </div>
            )}

            <button
              onClick={handleEditToggle}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isEditing
                  ? 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs shadow-emerald-600/20'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* 2. Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Farmer Avatar & Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800 shadow-xs flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-3xl flex items-center justify-center shadow-md mb-4 ring-4 ring-emerald-50 dark:ring-emerald-950/50">
                {profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">{profile.name}</h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{profile.location || 'Location not set'}</span>
              </p>

              <div className="mt-3 flex items-center gap-2">
                <Badge variant="emerald" size="sm">
                  Verified Farmer
                </Badge>
                <Badge variant="neutral" size="sm">
                  {profile.state ? `Kisan ID: ${profile.state.slice(0, 2).toUpperCase()}-4921` : 'Kisan ID: Verified'}
                </Badge>
              </div>

              <div className="mt-6 w-full pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-2.5 text-left text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> Phone
                  </span>
                  <span className="font-bold text-slate-900 dark:text-zinc-100">{profile.phone || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> Email
                  </span>
                  <span className="font-bold text-slate-900 dark:text-zinc-100">{profile.email || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Sprout className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> Total Land
                  </span>
                  <span className="font-bold text-slate-900 dark:text-zinc-100">{`${totalFarmAcres} acres`}</span>
                </div>
              </div>

              <div className="mt-6 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-800 text-[11px] text-slate-500 dark:text-zinc-400 w-full text-left">
                <span className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1 mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> AgriAI SIH25010 Prototype
                </span>
                Profile data is stored locally in your browser session.
              </div>
            </div>

            {/* Farm Connection Summary */}
            <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  Registered Farm Plots
                </h3>
                <Link
                  href="/farms"
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>My Farms</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {farms.map((f) => {
                  const cName = typeof f.crop === 'object' && f.crop ? f.crop.name : f.crop;
                  const sType = f.soil?.soilType || f.soilType || 'Loamy';
                  return (
                    <div
                      key={f.id}
                      className="p-3 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-zinc-100">{f.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                          {cName} • {sType}
                        </p>
                      </div>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-100 dark:border-emerald-800">
                        {f.areaAcres} acres
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Profile Sections */}
          <div className="lg:col-span-8 space-y-6">
            {isEditing ? (
              /* EDIT MODE FORM */
              <form onSubmit={handleSave} className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
                      Edit Profile Information
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Update your personal, farm, and regional language preferences
                    </p>
                  </div>
                  <Badge variant="emerald">Editing</Badge>
                </div>

                {/* Section 1: Personal Information */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-3">
                    Personal Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                        Farmer Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200/80 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-slate-50/70 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-medium"
                        required
                      />
                    </div>

                    <div>
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
                            state: details.state || formData.state,
                            district: details.district || formData.district,
                            locationDetails: details.locationDetails,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Farm Information */}
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-3">
                    Farm Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                        Farm Size (Acres)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.farmSizeAcres}
                        onChange={(e) =>
                          setFormData({ ...formData, farmSizeAcres: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200/80 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-slate-50/70 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                        Crops
                      </label>
                      <input
                        type="text"
                        value={formData.primaryCrop}
                        onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200/80 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-slate-50/70 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                        Soil Type
                      </label>
                      <input
                        type="text"
                        value={formData.soilType}
                        onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200/80 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-slate-50/70 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Language Preferences */}
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                    <Languages className="w-4 h-4" />
                    <span>Preferences — Preferred Language</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                    Choose your preferred communication language across AgriAI features.
                  </p>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {['English', 'Hindi', 'Punjabi'].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredLanguage: lang })}
                        className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          formData.preferredLanguage.toLowerCase() === lang.toLowerCase() ||
                          (lang === 'English' && formData.preferredLanguage === 'en') ||
                          (lang === 'Hindi' && formData.preferredLanguage === 'hi') ||
                          (lang === 'Punjabi' && formData.preferredLanguage === 'pa')
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-2xs'
                            : 'border-slate-200/80 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-750'
                        }`}
                      >
                        <span className="block font-bold text-sm">{lang}</span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5 block">
                          {lang === 'English' ? 'English' : lang === 'Hindi' ? 'हिन्दी' : 'ਪੰਜਾਬੀ'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 4: Display & Appearance Theme */}
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                    <Palette className="w-4 h-4" />
                    <span>Display Theme (Light / Dark / System)</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                    Select your preferred visual mode. Light mode is optimized for daytime reading.
                  </p>
                  <ThemeSelector />
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              /* VIEW MODE DISPLAY */
              <div className="space-y-6">
                {/* 1. Personal Information Card */}
                <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                        Personal Information
                      </h3>
                    </div>
                    <Badge variant="neutral" size="sm">Primary Contact</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-0.5">
                        Farmer Name
                      </span>
                      <p className="text-base font-extrabold text-slate-900 dark:text-zinc-100">
                        {profile.name}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-0.5">
                        Location
                      </span>
                      <p className="text-base font-extrabold text-slate-900 dark:text-zinc-100">
                        {profile.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Farm Information Card */}
                <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                        Farm Information
                      </h3>
                    </div>
                    <Badge variant="emerald" size="sm">Active Sowing</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-0.5">
                        Farm Size
                      </span>
                      <p className="text-base font-extrabold text-slate-900 dark:text-zinc-100">
                        {`${profile.farmSizeAcres} acres`}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">Across all plots</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-0.5">
                        Crops
                      </span>
                      <p className="text-base font-extrabold text-emerald-900 dark:text-emerald-300">
                        {profile.primaryCrop}
                      </p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Flowering phase</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-0.5">
                        Soil Type
                      </span>
                      <p className="text-base font-extrabold text-slate-900 dark:text-zinc-100">
                        {profile.soilType}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">pH 6.8 Optimal</span>
                    </div>
                  </div>
                </div>

                {/* 3. Language Preferences Card */}
                <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                        <Languages className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                        Language Preferences
                      </h3>
                    </div>
                    <Badge variant="info" size="sm">Localized</Badge>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-0.5">
                        Preferred Language
                      </span>
                      <p className="text-base font-extrabold text-slate-900 dark:text-zinc-100">
                        {profile.preferredLanguage === 'en'
                          ? 'English'
                          : profile.preferredLanguage === 'hi'
                          ? 'Hindi'
                          : profile.preferredLanguage === 'pa'
                          ? 'Punjabi'
                          : profile.preferredLanguage}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-white/80 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 shadow-2xs">
                        English
                      </span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-white/80 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 shadow-2xs">
                        Hindi
                      </span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-white/80 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 shadow-2xs">
                        Punjabi
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Display Appearance & Theme System (☀️ Light / 🌙 Dark / ⚙️ System) */}
                <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                          Display & Theme Appearance
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                          Choose how AgriAI looks on your screen. Light mode is the clean, default SaaS appearance.
                        </p>
                      </div>
                    </div>
                    <Badge variant="emerald" size="sm">Global System</Badge>
                  </div>

                  <ThemeSelector />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
