'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { SAMPLE_CROP_IMAGES } from '@/lib/ai-service';

interface CropUploadProps {
  onFileSelect: (file: File) => void;
  onSampleSelect: (url: string, name: string, size: string) => void;
}

export function CropUpload({ onFileSelect, onSampleSelect }: CropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = (file: File) => {
    setError(null);

    // Validate type: JPG, JPEG, PNG
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isValidExt = extension === 'jpg' || extension === 'jpeg' || extension === 'png';

    if (!validTypes.includes(file.type) && !isValidExt) {
      setError('Invalid file format. Please upload an image in JPG, JPEG, or PNG format.');
      return;
    }

    // Validate size: max 10MB
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size too large. Please upload an image smaller than 10 MB.');
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-3 text-xs font-semibold text-rose-800 animate-in fade-in duration-200 text-left">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Upload Error</p>
            <p className="font-normal mt-0.5 text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Main Drag and Drop Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative glass-card rounded-3xl border-2 border-dashed transition-all duration-200 p-8 sm:p-14 text-center cursor-pointer group select-none backdrop-blur-md ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 scale-[0.99]'
            : 'border-slate-300/80 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 hover:border-emerald-500/70 hover:bg-slate-50/60 dark:hover:bg-zinc-800/60 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              validateAndProcess(e.target.files[0]);
            }
          }}
        />

        <div className="max-w-md mx-auto flex flex-col items-center space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-200">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
              Upload Crop Image
            </h3>
            <p className="text-sm font-medium text-slate-600 dark:text-zinc-300">
              Drag & drop your image here, or{' '}
              <span className="text-emerald-700 dark:text-emerald-400 font-bold underline underline-offset-2">
                browse from device
              </span>
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300">
            <span>Supported formats:</span>
            <span className="text-slate-900 dark:text-zinc-100 font-bold">JPG, JPEG or PNG</span>
            <span className="text-slate-400 dark:text-zinc-500">•</span>
            <span>Max 10MB</span>
          </div>
        </div>
      </div>

      {/* Preset Sample Crop Images for Quick 1-Click Demo */}
      <div className="glass-card bg-slate-50/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-zinc-800 text-left">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
            Instant Test with Sample Images (No File Needed)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_CROP_IMAGES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSampleSelect(sample.url, sample.name, '1.4 MB')}
              className="p-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-xs transition-all text-left group flex items-center gap-3 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-zinc-700 overflow-hidden shrink-0 border border-slate-200 dark:border-zinc-600">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {sample.name}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-400 font-medium">
                  {sample.status}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
