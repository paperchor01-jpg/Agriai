'use client';

import React from 'react';
import { Trash2, Stethoscope, ArrowRight, FileCheck, CheckCircle2 } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
  fileName: string;
  fileSize: string;
  onRemove: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function ImagePreview({
  imageUrl,
  fileName,
  fileSize,
  onRemove,
  onAnalyze,
  isAnalyzing,
}: ImagePreviewProps) {
  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800/80 shadow-sm text-left animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
        {/* Image Preview Container */}
        <div className="relative w-full lg:w-72 h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shrink-0 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={fileName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-slate-900/80 dark:bg-zinc-900/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/10">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready for Analysis</span>
          </div>
        </div>

        {/* File Metadata and Actions */}
        <div className="flex-1 w-full space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              Selected Image
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100 mt-2 truncate">
              {fileName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-2">
              <span>Size: <strong>{fileSize}</strong></span>
              <span className="text-slate-300 dark:text-zinc-600">•</span>
              <span>Valid format (JPG/PNG)</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/80 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">
              AI Vision Pipeline Ready
            </p>
            The image will be analyzed across cellular leaf coloration, fungal spore patterns, and chlorophyll degradation indexes.
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Analyze Crop</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onRemove}
              disabled={isAnalyzing}
              className="w-full sm:w-auto py-3.5 px-5 bg-slate-100 dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-800/60 active:scale-98 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
