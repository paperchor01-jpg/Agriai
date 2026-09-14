'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Farm } from '@/types';

interface DeleteFarmDialogProps {
  farm: Farm | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteFarmDialog({
  farm,
  isOpen,
  onClose,
  onConfirm,
}: DeleteFarmDialogProps) {
  if (!isOpen || !farm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-card bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 dark:border-zinc-800/80 overflow-hidden text-left p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-zinc-100">
            Delete Farm Plot?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            Are you sure you want to delete <strong className="text-slate-900 dark:text-zinc-100">{farm.name}</strong> ({farm.location})? This will permanently remove its soil profile, crop growth stage, and agronomic telemetry.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 font-medium">
          ⚠️ This action cannot be undone.
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Farm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
