'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Award, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { MiniDashboard } from '@/components/landing/MiniDashboard';

export function HeroSection() {
  return (
    <section className="relative pt-10 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      {/* Background Dot Grid for Tech Aesthetic */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 -z-10 pointer-events-none" />

      {/* Hackathon Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/25 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-6 shadow-2xs backdrop-blur-xs">
        <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Smart India Hackathon Prototype • Problem Statement SIH25010</span>
      </div>

      {/* Main Hero Headline (Exact text requested) */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight max-w-4xl mx-auto leading-[1.12]">
        AI-Powered Farming. <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
          Smarter Decisions.
        </span>{' '}
        <br className="hidden sm:inline" />
        Better Yields.
      </h1>

      {/* Subtitle (Exact text requested) */}
      <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
        Get personalized crop health insights, disease detection, irrigation recommendations and farm intelligence — all in one simple platform.
      </p>

      {/* Two Buttons (Exact buttons requested) */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-base font-semibold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition-all duration-150 flex items-center justify-center gap-2.5"
        >
          <span>Start Free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-7 py-3.5 bg-white/80 dark:bg-zinc-800/80 hover:bg-slate-50 dark:hover:bg-zinc-700/80 active:scale-98 text-slate-800 dark:text-zinc-200 border border-slate-200/80 dark:border-zinc-700 text-base font-semibold rounded-xl shadow-2xs backdrop-blur-xs transition-all duration-150 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
          <span>Explore Demo</span>
        </Link>
      </div>

      {/* Trust & Usability Badges */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 dark:text-zinc-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Zero Sensor Hardware Required
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Engineered for Small & Marginal Farmers
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Operates on Mobile & 2G/3G
        </span>
      </div>


      {/* Miniature AgriAI Dashboard Visual */}
      <div className="mt-12 sm:mt-16">
        <MiniDashboard />
      </div>
    </section>
  );
}
