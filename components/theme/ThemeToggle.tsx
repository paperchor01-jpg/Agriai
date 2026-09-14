'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, Theme } from './ThemeProvider';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, resolvedTheme, setTheme, mounted } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 animate-pulse ${className}`} />
    );
  }

  const options: { id: Theme; label: string; icon: React.ElementType }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  const CurrentIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors border border-slate-200/80 dark:border-zinc-700 flex items-center justify-center cursor-pointer ${className}`}
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)} (Click to change)`}
        aria-label="Toggle theme menu"
        aria-expanded={open}
      >
        <CurrentIcon className="w-4 h-4 transition-transform duration-200" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 px-2.5 py-1">
            Theme
          </div>
          <div className="space-y-0.5">
            {options.map(({ id, label, icon: Icon }) => {
              const isSelected = theme === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTheme(id);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                    <span>{label}</span>
                  </div>
                  {isSelected && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function ThemeSelector() {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="grid grid-cols-3 gap-3 animate-pulse">
        <div className="h-24 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700" />
        <div className="h-24 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700" />
        <div className="h-24 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700" />
      </div>
    );
  }

  const themes: {
    id: Theme;
    name: string;
    description: string;
    icon: React.ElementType;
    previewBg: string;
  }[] = [
    {
      id: 'light',
      name: '☀️ Light',
      description: 'Clean white background, high contrast, default for agriculture SaaS',
      icon: Sun,
      previewBg: 'bg-slate-50 border-slate-200 text-slate-900',
    },
    {
      id: 'dark',
      name: '🌙 Dark',
      description: 'Deep zinc background, dark cards, easy on the eyes for night monitoring',
      icon: Moon,
      previewBg: 'bg-zinc-950 border-zinc-800 text-zinc-100',
    },
    {
      id: 'system',
      name: '⚙️ System',
      description: 'Automatically synchronizes with your device / OS appearance',
      icon: Monitor,
      previewBg: 'bg-gradient-to-r from-slate-50 to-zinc-950 border-slate-300 text-slate-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {themes.map(({ id, name, description, icon: Icon }) => {
        const isSelected = theme === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setTheme(id)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              isSelected
                ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 shadow-xs'
                : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`font-bold text-sm ${
                      isSelected
                        ? 'text-emerald-900 dark:text-emerald-200'
                        : 'text-slate-900 dark:text-zinc-100'
                    }`}
                  >
                    {name}
                  </span>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-2xs">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-zinc-500">
              <span>{id === 'system' ? 'Auto-sync' : `${id.toUpperCase()} MODE`}</span>
              <span className={isSelected ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                {isSelected ? '✓ Selected' : 'Select'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
