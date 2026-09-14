'use client';

import React, { useState, useEffect } from 'react';
import { Stethoscope, Sparkles, ShieldCheck, Sprout } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { CropUpload } from '@/components/crop-doctor/CropUpload';
import { ImagePreview } from '@/components/crop-doctor/ImagePreview';
import { AnalysisLoader } from '@/components/crop-doctor/AnalysisLoader';
import { AnalysisResult } from '@/components/crop-doctor/AnalysisResult';
import { analyzeCropImage } from '@/lib/ai-service';
import {
  DEFAULT_FARMS,
  getStoredFarms,
  getSelectedFarmId,
  saveSelectedFarmId,
} from '@/lib/mock-data';
import { CropDoctorResult, Farm } from '@/types';

export default function CropDoctorPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [result, setResult] = useState<CropDoctorResult | null>(null);

  useEffect(() => {
    const syncFarms = () => {
      const stored = getStoredFarms();
      setFarms(stored);
      const sel = getSelectedFarmId();
      if (sel) {
        setSelectedFarmId(sel);
      } else if (stored.length > 0) {
        setSelectedFarmId(stored[0].id);
      } else {
        setSelectedFarmId('');
      }
    };
    syncFarms();
    window.addEventListener('agriai:farms-updated', syncFarms);
    return () => window.removeEventListener('agriai:farms-updated', syncFarms);
  }, []);

  const activeFarm = farms.find((f) => f.id === selectedFarmId) || farms[0] || null;
  const currentCrop: string = activeFarm
    ? typeof activeFarm.crop === 'object' && activeFarm.crop
      ? (activeFarm.crop as any).name
      : typeof activeFarm.crop === 'string'
      ? activeFarm.crop
      : 'Wheat'
    : 'Universal Crop';
  const currentStage: string = activeFarm
    ? typeof activeFarm.crop === 'object' && activeFarm.crop
      ? (activeFarm.crop as any).stage || 'Active Growth'
      : 'Active Growth'
    : 'Active Growth';

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setFileName(file.name);
      setFileSize(formatFileSize(file.size));
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleSelect = (url: string, name: string, size: string) => {
    setSelectedImage(url);
    setFileName(name);
    setFileSize(size);
    setResult(null);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFileName('');
    setFileSize('');
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setAnalysisStep('Uploading image...');

    try {
      const diagResult = await analyzeCropImage(
        selectedImage,
        (step, pct) => {
          setAnalysisStep(step);
          setAnalysisProgress(pct);
        },
        currentCrop
      );

      if (!diagResult.crop || diagResult.crop === 'Crop') {
        diagResult.crop = currentCrop;
      }
      setResult(diagResult);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setFileName('');
    setFileSize('');
    setResult(null);
    setAnalysisStep('');
    setAnalysisProgress(0);
  };

  const handleAskAgriAI = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('agriai:open-chat', {
          detail: {
            query: result
              ? `How do I treat ${result.disease} on my ${result.crop} crop?`
              : 'How do I diagnose crop diseases?',
          },
        })
      );
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        {/* Page Title & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-zinc-800 text-left">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 dark:bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                  AI Crop Doctor
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Upload a crop image and let AI analyze its health.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Vision Model v2.4 Active</span>
            </span>
          </div>
        </div>

        {/* Current Farm & Crop Context Bar */}
        <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-200/50 dark:border-emerald-800/40">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  Target Farm Plot
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                  {currentCrop} • {currentStage} Stage
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
                {activeFarm
                  ? `${activeFarm.name} (${activeFarm.location})`
                  : 'Universal Diagnostic Mode (No farm plot linked)'}
              </p>
            </div>
          </div>

          {farms.length > 1 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label className="text-xs text-slate-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                Switch plot:
              </label>
              <select
                value={selectedFarmId}
                onChange={(e) => {
                  setSelectedFarmId(e.target.value);
                  saveSelectedFarmId(e.target.value);
                }}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {farms.map((f) => {
                  const cName =
                    typeof f.crop === 'object' && f.crop ? f.crop.name : f.crop;
                  const cStage =
                    typeof f.crop === 'object' && f.crop?.stage
                      ? f.crop.stage
                      : 'Flowering';
                  return (
                    <option key={f.id} value={f.id}>
                      {f.name} — {cName} ({cStage})
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        {/* Dynamic State Machine Display */}
        {result ? (
          <AnalysisResult
            result={result}
            onReset={handleReset}
            onAskAgriAI={handleAskAgriAI}
          />
        ) : isAnalyzing ? (
          <AnalysisLoader
            currentStep={analysisStep}
            progressPercent={analysisProgress}
          />
        ) : selectedImage ? (
          <ImagePreview
            imageUrl={selectedImage}
            fileName={fileName}
            fileSize={fileSize}
            onRemove={handleRemoveImage}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <CropUpload
            onFileSelect={handleFileSelect}
            onSampleSelect={handleSampleSelect}
          />
        )}
      </div>
    </AppShell>
  );
}
