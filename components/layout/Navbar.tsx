'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sprout, Menu, X, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-xs border-b border-slate-200/80 dark:border-zinc-800/80'
          : 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-zinc-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                AgriAI
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-800/60 tracking-wide">
                SIH25010
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium hidden sm:block leading-none mt-0.5">
              Smart Crop Advisory System
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-zinc-300">
          <a
            href="#features"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1 hover:border-b-2 hover:border-emerald-600 dark:hover:border-emerald-400"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1 hover:border-b-2 hover:border-emerald-600 dark:hover:border-emerald-400"
          >
            How It Works
          </a>
          <a
            href="#about"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1 hover:border-b-2 hover:border-emerald-600 dark:hover:border-emerald-400"
          >
            About
          </a>
          <Link
            href="/impact"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1"
          >
            Impact
          </Link>
          <Link
            href="/authority"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1"
          >
            Authority
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-400 px-4 py-2 rounded-xl transition-colors hover:bg-slate-100/80 dark:hover:bg-zinc-800/80"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 px-4.5 py-2.5 rounded-xl shadow-xs transition-all duration-150"
          >
            <span>Start Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg shadow-xs"
          >
            Start Free
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-18 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800 shadow-xl px-4 pt-4 pb-6 transition-all duration-200">
          <nav className="flex flex-col space-y-1">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-zinc-200 hover:bg-emerald-50 dark:hover:bg-zinc-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center justify-between"
            >
              <span>Features</span>
              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-zinc-200 hover:bg-emerald-50 dark:hover:bg-zinc-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center justify-between"
            >
              <span>How It Works</span>
              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-zinc-200 hover:bg-emerald-50 dark:hover:bg-zinc-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center justify-between"
            >
              <span>About</span>
              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
            </a>
          </nav>

          <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-zinc-800 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 text-sm font-semibold text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 text-center rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
