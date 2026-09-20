'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sprout,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { signIn, signUp } from '@/lib/auth-service';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Synchronous submission lock to block rapid double-clicks and Enter-key races
    if (isSubmittingRef.current || loading || demoLoading) {
      return;
    }
    isSubmittingRef.current = true;

    setError('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Please provide both email address and password.');
      isSubmittingRef.current = false;
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please provide your full name for your farmer profile.');
          setLoading(false);
          isSubmittingRef.current = false;
          return;
        }

        const result = await signUp(name.trim(), cleanEmail, password);
        if (!result.success) {
          setError(result.error || 'Failed to create account. Please try again.');
          setLoading(false);
          isSubmittingRef.current = false;
          return;
        }

        if (result.session) {
          setSuccessMessage('Account created successfully! Launching Farm Onboarding...');
          // Keep lock active while navigating to dashboard
          setTimeout(() => {
            router.push('/dashboard');
          }, 500);
        } else {
          setLoading(false);
          isSubmittingRef.current = false;
          setSuccessMessage(
            'Account created! Please check your email inbox to verify your account before signing in.'
          );
          setMode('signin');
        }
      } else {
        const result = await signIn(cleanEmail, password);
        if (!result.success) {
          setError(result.error || 'Invalid email or password. If you are a new farmer, please create an account first.');
          setLoading(false);
          isSubmittingRef.current = false;
          return;
        }

        setSuccessMessage('Signed in successfully! Launching Dashboard...');
        // Keep lock active while navigating to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 400);
      }
    } catch {
      setError('An unexpected network error occurred. Please try again.');
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleDemoLogin = async () => {
    if (isSubmittingRef.current || demoLoading || loading) {
      return;
    }
    isSubmittingRef.current = true;

    setEmail('farmer@agriai.demo');
    setPassword('demo123');
    setError('');
    setDemoLoading(true);

    try {
      const result = await signIn('farmer@agriai.demo', 'demo123');
      if (result.success) {
        setTimeout(() => {
          router.push('/dashboard');
        }, 400);
      } else {
        setError(result.error || 'Demo login failed.');
        setDemoLoading(false);
        isSubmittingRef.current = false;
      }
    } catch {
      setError('Demo login failed. Please try again.');
      setDemoLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white transition-colors">
      {/* Top action row */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-1 px-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-zinc-800/80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-zinc-100">
            AgriAI
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-800/60">
            SIH25010
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
          {mode === 'signup' ? 'Create Farmer Account' : 'Farmer Portal Login'}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Smart Crop Advisory System for Small and Marginal Farmers
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-xl border border-slate-200/90 dark:border-zinc-800 rounded-2xl sm:rounded-3xl">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-slate-100/90 dark:bg-zinc-800/80 text-xs font-bold text-slate-600 dark:text-zinc-400">
            <button
              type="button"
              disabled={loading || demoLoading}
              onClick={() => {
                if (loading || demoLoading) return;
                setMode('signin');
                setError('');
                setSuccessMessage('');
              }}
              className={`py-2 rounded-lg transition-all ${
                loading || demoLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              } ${
                mode === 'signin'
                  ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              disabled={loading || demoLoading}
              onClick={() => {
                if (loading || demoLoading) return;
                setMode('signup');
                setError('');
                setSuccessMessage('');
              }}
              className={`py-2 rounded-lg transition-all ${
                loading || demoLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              } ${
                mode === 'signup'
                  ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Success Message Box */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/25 dark:border-emerald-800/60 flex items-start gap-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message Box */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 dark:bg-rose-950/60 border border-rose-500/25 dark:border-rose-800/60 flex items-start gap-2.5 text-xs font-semibold text-rose-800 dark:text-rose-300 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Box (Only in sign in mode) */}
          {mode === 'signin' && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Instant Demo Access
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-700/60">
                  1-Click
                </span>
              </div>
              <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 mt-1 leading-relaxed">
                Explore the live portal configured for demo farmer <strong>Arjun Singh</strong> (Green Valley Farm, Ludhiana).
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="mt-3.5 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {demoLoading ? (
                  <span>Launching Farmer Dashboard...</span>
                ) : (
                  <>
                    <span>Demo Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}

          {mode === 'signin' && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/85 dark:bg-zinc-900/85 px-2.5 text-slate-400 dark:text-zinc-500 font-semibold tracking-wider">
                  Or Sign In with Credentials
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Farmer Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arjun Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-slate-50/70 dark:bg-zinc-800/60 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="farmer@agriai.demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-slate-50/70 dark:bg-zinc-800/60 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-slate-50/70 dark:bg-zinc-800/60 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>
              {mode === 'signup' && (
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
                  Must be at least 6 characters.
                </p>
              )}
            </div>

            {mode === 'signin' && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/70 border border-slate-100 dark:border-zinc-800 text-[11px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                <span>Demo Credentials:</span>
                <code className="font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                  farmer@agriai.demo / demo123
                </code>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || demoLoading}
              className={`w-full py-3 px-4 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 active:scale-98 text-white text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mt-2 ${
                loading || demoLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {loading
                ? mode === 'signup'
                  ? 'Creating Account...'
                  : 'Authenticating...'
                : mode === 'signup'
                ? 'Create Account'
                : 'Sign In'}
            </button>
          </form>

          {/* Toggle link below form */}
          <div className="mt-5 text-center">
            {mode === 'signin' ? (
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  disabled={loading || demoLoading}
                  onClick={() => {
                    if (loading || demoLoading) return;
                    setMode('signup');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className={`font-bold text-emerald-700 dark:text-emerald-400 hover:underline ${
                    loading || demoLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Already have an account?{' '}
                <button
                  type="button"
                  disabled={loading || demoLoading}
                  onClick={() => {
                    if (loading || demoLoading) return;
                    setMode('signin');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className={`font-bold text-emerald-700 dark:text-emerald-400 hover:underline ${
                    loading || demoLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800 text-center text-xs text-slate-500 dark:text-zinc-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Supabase Auth &bull; End-to-End Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
