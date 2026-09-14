'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-slate-200/80 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand Info (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-zinc-100">
                AgriAI
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-800/60">
                SIH25010
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-sm leading-relaxed">
              Smart Crop Advisory System engineered to empower small and marginal farmers with vision-based diagnostics, weather intelligence, and precision irrigation.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-300">
              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Smart India Hackathon Prototype</span>
            </div>
          </div>

          {/* Column 2: Core Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-200">
              Solutions
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/crop-doctor" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  AI Crop Doctor
                </Link>
              </li>
              <li>
                <Link href="/advisory" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Smart Advisory
                </Link>
              </li>
              <li>
                <Link href="/weather" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Weather Intelligence
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Crop Health Monitoring
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Yield Prediction
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-200">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Features Overview
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Agronomic Mission
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Farmer Portal Demo
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: SIH & Initiative */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-200">
              Initiative
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-slate-500 dark:text-zinc-400">Problem: SIH25010</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-zinc-400">Focus: Marginal Farmers</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-zinc-400">Approach: Zero Hardware AI</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-zinc-400">Ministry of Agriculture</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-zinc-400">Open Ag Prototype</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-400">
          <p>
            © 2026 AgriAI — Smart Crop Advisory System (SIH25010). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with Next.js & Tailwind CSS for Indian Agriculture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

