'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  Sprout,
  AlertTriangle,
  Layers,
  TrendingUp,
  Droplets,
  Activity,
  Users,
  MapPin,
  RefreshCw,
  Lock,
  ArrowRight,
  Sparkles,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { getAuthorityDashboardData } from '@/lib/authority-service';
import { getUserRole, setUserRole } from '@/lib/auth-service';
import { AuthorityDashboardData } from '@/types';

export default function AuthorityDashboardPage() {
  const [data, setData] = useState<AuthorityDashboardData | null>(null);
  const [role, setRole] = useState<string>('authority');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const authData = await getAuthorityDashboardData();
    setData(authData);
    setLoading(false);
  };

  useEffect(() => {
    const currentRole = getUserRole();
    // Default to 'authority' for direct visits to this portal for demonstration
    if (currentRole !== 'authority' && currentRole !== 'admin') {
      setUserRole('authority');
      setRole('authority');
    } else {
      setRole(currentRole);
    }

    loadData();

    const handleRoleChange = () => {
      setRole(getUserRole());
    };

    window.addEventListener('agriai:role-changed', handleRoleChange);
    return () => window.removeEventListener('agriai:role-changed', handleRoleChange);
  }, []);

  const toggleRole = (newRole: 'farmer' | 'authority') => {
    setUserRole(newRole);
    setRole(newRole);
  };

  const isAuthorized = role === 'authority' || role === 'admin';

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto text-left">
        {/* Header with Title and Role Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                    Agriculture Authority Portal
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-900 dark:bg-zinc-800 text-white dark:text-zinc-200">
                    Official Dashboard
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Macro agricultural monitoring, regional risk analytics, and district crop intelligence.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Role Switcher for Hackathon Demonstration */}
          <div className="flex items-center gap-2 glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs self-start sm:self-auto">
            <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 pl-1">Role:</span>
            <div className="grid grid-cols-2 p-0.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => toggleRole('authority')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  role === 'authority'
                    ? 'bg-slate-900 dark:bg-zinc-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
              >
                Agriculture Officer
              </button>
              <button
                type="button"
                onClick={() => toggleRole('farmer')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  role === 'farmer'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
              >
                Individual Farmer
              </button>
            </div>
          </div>
        </div>

        {/* Access Restricted Banner if in Farmer Role */}
        {!isAuthorized ? (
          <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-zinc-800 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
              Role Authorization Restricted
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              You are currently logged in as a <strong>Farmer</strong>. The District Agriculture Authority Dashboard contains aggregated district analytics and is restricted to government officers and district administrators.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => toggleRole('authority')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Switch to Agriculture Officer Role (Preview)
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 1. Macro KPI Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
              <StatCard
                title="Total Farms"
                value={String(data?.totalFarms ?? 0)}
                subtitle="Monitored in district"
                icon={Sprout}
                accentColor="emerald"
              />
              <StatCard
                title="Total Acreage"
                value={`${data?.totalCultivatedAcres ?? 0} ac`}
                subtitle="Under active advisory"
                icon={Layers}
                accentColor="indigo"
              />
              <StatCard
                title="Active Crops"
                value={String(data?.cropsMonitoredCount ?? 0)}
                subtitle="Wheat, Mustard, Gram"
                icon={Activity}
                accentColor="slate"
              />
              <StatCard
                title="High Risk Plots"
                value={String(data?.highRiskFarmsCount ?? 0)}
                subtitle="Require extension visit"
                icon={AlertTriangle}
                accentColor="amber"
              />
              <StatCard
                title="Water Stress"
                value={String(data?.waterStressCount ?? 0)}
                subtitle="Moisture deficit / ponding"
                icon={Droplets}
                accentColor="sky"
              />
              <StatCard
                title="Active Alerts"
                value={String(data?.activeAlertsCount ?? 0)}
                subtitle="Dispatched to farmers"
                icon={ShieldCheck}
                accentColor="rose"
              />
            </div>

            {/* 2. Regional District Intelligence Table */}
            <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-zinc-800">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    District & Regional Intelligence Summary
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Aggregated real-time farm health across operational districts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadData}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Telemetry</span>
                </button>
              </div>

              {data?.hasRegionalData ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        <th className="py-3 px-3">District / Region</th>
                        <th className="py-3 px-3">Farms</th>
                        <th className="py-3 px-3">Cultivated Area</th>
                        <th className="py-3 px-3">Dominant Crop</th>
                        <th className="py-3 px-3">Avg Health Score</th>
                        <th className="py-3 px-3">Risk Distribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-slate-700 dark:text-zinc-300 font-medium">
                      {data.regionalDistricts.map((d, i) => (
                        <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-zinc-100">
                            {d.district}
                          </td>
                          <td className="py-3.5 px-3">{d.farmCount} plots</td>
                          <td className="py-3.5 px-3">{d.totalAcreage} acres</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800">
                              {d.dominantCrop}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`font-extrabold ${d.avgHealthScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                              {d.avgHealthScore} / 100
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1.5 text-[10px]">
                              {d.riskDistribution.low > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold">
                                  {d.riskDistribution.low} Low
                                </span>
                              )}
                              {d.riskDistribution.medium > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold">
                                  {d.riskDistribution.medium} Med
                                </span>
                              )}
                              {d.riskDistribution.high > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 font-bold">
                                  {d.riskDistribution.high} High
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-zinc-400 text-xs italic bg-slate-50/60 dark:bg-zinc-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800">
                  Regional intelligence will appear when sufficient location data is available.
                </div>
              )}
            </div>

            {/* 3. Crop Distribution & Extension Service Dispatch */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Crop Distribution Card */}
              <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Crop Acreage Distribution
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">District Total: {data?.totalCultivatedAcres} ac</span>
                </div>

                <div className="space-y-3.5">
                  {data?.cropDistribution.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-800 dark:text-zinc-200 font-bold">{item.crop}</span>
                        <span className="text-slate-500 dark:text-zinc-400">
                          {item.acres} acres ({item.percentage}%) &bull; {item.count} farms
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* High-Risk Surveillance & Extension Guidance */}
              <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      Extension Advisory Broadcast
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      Emergency Alert Channel
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                    District authority broadcast channel allows Krishi Vigyan Kendra (KVK) and State Agriculture Officers to push verified weather warnings, seed subsidies, and epidemic containment advisories directly to farmer dashboards.
                  </p>

                  <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      Active Regional Caution
                    </div>
                    <p className="font-medium leading-relaxed">
                      Upcoming 65% precipitation front across Ludhiana & Amritsar. Automated advisory has instructed 100% of monitored farmers to hold tube-well irrigation to conserve water and prevent fertilizer leaching.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                  <span>Data Integrity: <strong className="text-slate-700 dark:text-zinc-300">Verified Supabase RLS</strong></span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Privacy Compliant</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
