'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sprout,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { FarmDetailCard } from '@/components/farms/FarmDetailCard';
import { FarmFormModal } from '@/components/farms/FarmFormModal';
import { DeleteFarmDialog } from '@/components/farms/DeleteFarmDialog';
import {
  DEFAULT_FARMS,
  getStoredFarms,
  saveStoredFarms,
  getSelectedFarmId,
  saveSelectedFarmId,
} from '@/lib/mock-data';
import {
  getFarms,
  createFarm,
  updateFarm,
  deleteFarm,
} from '@/lib/farm-service';
import { Farm } from '@/types';

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  // Delete State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState<Farm | null>(null);

  // Load from Supabase (with localStorage fallback) on mount and register update listener
  useEffect(() => {
    let isMounted = true;

    const loadInitialFarms = async () => {
      setIsLoading(true);
      try {
        const data = await getFarms();
        if (isMounted && data) {
          setFarms(data);
          if (data.length > 0) {
            const currentSelected = getSelectedFarmId();
            if (data.some((f) => f.id === currentSelected)) {
              setSelectedFarmId(currentSelected);
            } else {
              setSelectedFarmId(data[0].id);
              saveSelectedFarmId(data[0].id);
            }
          } else {
            setSelectedFarmId('');
          }
        }
      } catch (err) {
        console.warn('Farms load error:', err);
        if (isMounted) {
          const stored = getStoredFarms();
          setFarms(stored);
          setSelectedFarmId(getSelectedFarmId());
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadInitialFarms();

    const syncFarms = () => {
      const stored = getStoredFarms();
      setFarms(stored);
      setSelectedFarmId(getSelectedFarmId());
    };

    window.addEventListener('agriai:farms-updated', syncFarms);
    return () => {
      isMounted = false;
      window.removeEventListener('agriai:farms-updated', syncFarms);
    };
  }, []);

  const handleOpenAddModal = () => {
    setEditingFarm(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (farm: Farm) => {
    setEditingFarm(farm);
    setIsModalOpen(true);
  };

  const handleSaveFarm = async (farmToSave: Farm) => {
    const exists = farms.some((f) => f.id === farmToSave.id);

    try {
      if (exists) {
        // Edit existing farm via Supabase service
        const updated = await updateFarm(farmToSave.id, farmToSave);
        setFarms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      } else {
        // Create new farm via Supabase service
        const created = await createFarm(farmToSave);
        setFarms((prev) => [created, ...prev.filter((f) => f.id !== created.id)]);
        setSelectedFarmId(created.id);
        saveSelectedFarmId(created.id);
      }

      // Re-sync freshest list
      const refreshed = await getFarms();
      setFarms(refreshed);
    } catch (err) {
      console.error('Error saving farm:', err);
      // Fallback local update
      const fallbackList = exists
        ? farms.map((f) => (f.id === farmToSave.id ? farmToSave : f))
        : [farmToSave, ...farms];
      setFarms(fallbackList);
      saveStoredFarms(fallbackList);
    }
  };

  const handleOpenDeleteDialog = (farm: Farm) => {
    setFarmToDelete(farm);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!farmToDelete) return;
    const idToDelete = farmToDelete.id;

    try {
      await deleteFarm(idToDelete);
      const refreshed = await getFarms();
      setFarms(refreshed);

      if (selectedFarmId === idToDelete && refreshed.length > 0) {
        setSelectedFarmId(refreshed[0].id);
        saveSelectedFarmId(refreshed[0].id);
      }
    } catch (err) {
      console.error('Error deleting farm:', err);
      const fallbackList = farms.filter((f) => f.id !== idToDelete);
      setFarms(fallbackList);
      saveStoredFarms(fallbackList);

      if (selectedFarmId === idToDelete && fallbackList.length > 0) {
        setSelectedFarmId(fallbackList[0].id);
        saveSelectedFarmId(fallbackList[0].id);
      }
    } finally {
      setIsDeleteDialogOpen(false);
      setFarmToDelete(null);
    }
  };

  const handleSelectActiveFarm = (farmId: string) => {
    setSelectedFarmId(farmId);
    saveSelectedFarmId(farmId);
  };

  // Calculate quick metrics
  const totalArea = farms.reduce((acc, f) => acc + (f.areaAcres || 0), 0).toFixed(1);
  const avgHealth = farms.length > 0
    ? `${Math.round(farms.reduce((acc, f) => acc + (f.healthScore || 80), 0) / farms.length)}%`
    : 'Data unavailable';

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto text-left">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                  My Farms
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Manage your farms, crops and growing conditions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Farm</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="glass-card p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Registered Plots
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-zinc-100 mt-1">
              {farms.length}
            </p>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">Active holdings</span>
          </div>

          <div className="glass-card p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Total Cultivated
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-zinc-100 mt-1">
              {totalArea} acres
            </p>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">Across all plots</span>
          </div>

          <div className="glass-card p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Mean Crop Health
            </span>
            <p className={`text-xl sm:text-2xl font-extrabold mt-1 ${farms.length > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`}>
              {avgHealth}
            </p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {farms.length > 0 ? 'Optimal Vigor' : 'Awaiting plots'}
            </span>
          </div>

          <div className="glass-card p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Active Dashboard
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-1.5 truncate">
              {farms.find((f) => f.id === selectedFarmId)?.name || (farms.length > 0 ? farms[0]?.name : 'None')}
            </p>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">Primary telemetry feed</span>
          </div>
        </div>

        {/* Farm Cards List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              Farm Plots & Soil Profiles ({farms.length})
            </h2>
            <span className="text-xs text-slate-500 dark:text-zinc-400">Click any card to inspect full soil & crop breakdown</span>
          </div>

          {farms.length === 0 ? (
            <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-12 border border-dashed border-slate-300 dark:border-zinc-700 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Sprout className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">No Farm Plots Registered</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Add your agricultural plots to unlock AI Crop Doctor diagnostics and precision smart advisory.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Add Your First Farm
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {farms.map((farm) => (
                <FarmDetailCard
                  key={farm.id}
                  farm={farm}
                  isSelected={farm.id === selectedFarmId}
                  onSelect={() => handleSelectActiveFarm(farm.id)}
                  onEdit={() => handleOpenEditModal(farm)}
                  onDelete={() => handleOpenDeleteDialog(farm)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal for Add / Edit */}
        <FarmFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingFarm(null);
          }}
          onSave={handleSaveFarm}
          initialFarm={editingFarm}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteFarmDialog
          farm={farmToDelete}
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setFarmToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AppShell>
  );
}
