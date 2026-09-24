'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Store, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { NormalizedMarketPrice } from '@/lib/data-providers/types';

interface MandiPriceCardProps {
  initialCrop?: string;
  initialState?: string;
  initialDistrict?: string;
}

const SUPPORTED_CROPS = [
  { id: 'Wheat', label: '🌾 Wheat' },
  { id: 'Paddy', label: '🍚 Paddy' },
  { id: 'Cotton', label: '☁️ Cotton' },
  { id: 'Mustard', label: '🌼 Mustard' },
  { id: 'Maize', label: '🌽 Maize' },
  { id: 'Soybean', label: '🌱 Soybean' },
  { id: 'Gram', label: '🫘 Chana (Gram)' },
];

export function MandiPriceCard({
  initialCrop = 'Wheat',
  initialState = 'Punjab',
  initialDistrict = 'Ludhiana',
}: MandiPriceCardProps) {
  const [commodity, setCommodity] = useState(initialCrop);
  const [stateName, setStateName] = useState(initialState);
  const [districtName, setDistrictName] = useState(initialDistrict);
  const [prices, setPrices] = useState<NormalizedMarketPrice[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        commodity,
        state: stateName,
      });
      if (districtName) {
        queryParams.set('district', districtName);
      }
      const res = await fetch(`/api/market?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error(`Market query failed: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.success) {
        const priceList = Array.isArray(data.data)
          ? data.data
          : (data.data ? [data.data] : (data.primaryPrice ? [data.primaryPrice] : []));
        setPrices(priceList);
        if (data.metadata) {
          setMetadata(data.metadata);
        }
      } else {
        setPrices([]);
      }
    } catch (err: any) {
      console.warn('Failed to fetch live mandi rates:', err);
      setError('Live AGMARKNET query unreachable. Showing certified CACP MSP baseline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [commodity, stateName, districtName]);

  const primaryRecord = prices[0];

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between text-left">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Mandi Market Rates</h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Official AGMARKNET & CACP Telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {metadata?.status === 'LIVE' ? (
              <span className="text-[10px] px-2 py-0.5 font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40">
                LIVE
              </span>
            ) : metadata?.status === 'FALLBACK' ? (
              <span className="text-[10px] px-2 py-0.5 font-semibold rounded-md bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40">
                BENCHMARK
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 font-semibold rounded-md bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                MSP BASE
              </span>
            )}
            <button
              onClick={fetchPrices}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              title="Refresh market rates"
              aria-label="Refresh market rates"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Commodity Selector Pill Row */}
        <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {SUPPORTED_CROPS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCommodity(c.id)}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                commodity.toLowerCase().includes(c.id.toLowerCase())
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Price Content */}
        {isLoading ? (
          <div className="py-8 space-y-3 animate-pulse">
            <div className="h-8 bg-slate-100 dark:bg-zinc-800 rounded-lg w-1/2" />
            <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-3/4" />
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="h-12 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
              <div className="h-12 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
              <div className="h-12 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
            </div>
          </div>
        ) : primaryRecord ? (
          <div className="mt-4">
            {/* Main Modal Price */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                  Modal Rate ({primaryRecord.market || primaryRecord.district})
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                    ₹{primaryRecord.modalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">/{primaryRecord.unit}</span>
                </div>
              </div>

              {primaryRecord.trend7d?.changePercent !== undefined && (
                <div
                  className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                    primaryRecord.trend7d.changePercent >= 0
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/60'
                  }`}
                >
                  {primaryRecord.trend7d.changePercent >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{primaryRecord.trend7d.changePercent >= 0 ? `+${primaryRecord.trend7d.changePercent}%` : `${primaryRecord.trend7d.changePercent}%`} (7d)</span>
                </div>
              )}
            </div>

            {/* Min / Modal / Max 3-box Grid */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase block">Min Rate</span>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
                  ₹{primaryRecord.minPrice.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase block">Modal Avg</span>
                <p className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300 mt-0.5">
                  ₹{primaryRecord.modalPrice.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase block">Max Rate</span>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
                  ₹{primaryRecord.maxPrice.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* MSP Comparison Pill */}
            {primaryRecord.msp && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-[11px] flex items-center justify-between text-slate-600 dark:text-zinc-300">
                <span>CACP Minimum Support Price (MSP):</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">
                  ₹{primaryRecord.msp.toLocaleString('en-IN')}/qtl
                  {primaryRecord.modalPrice >= primaryRecord.msp ? (
                    <span className="ml-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      (+₹{(primaryRecord.modalPrice - primaryRecord.msp).toLocaleString('en-IN')})
                    </span>
                  ) : (
                    <span className="ml-1 text-rose-600 dark:text-rose-400 font-semibold">
                      (-₹{(primaryRecord.msp - primaryRecord.modalPrice).toLocaleString('en-IN')})
                    </span>
                  )}
                </span>
              </div>
            )}

            {/* Transparent Disclaimer / Guidance */}
            {primaryRecord.disclaimer && (
              <p className="mt-2.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-zinc-400 italic">
                ℹ️ {primaryRecord.disclaimer}
              </p>
            )}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500 dark:text-zinc-400 space-y-2">
            <AlertCircle className="w-6 h-6 mx-auto text-amber-500" />
            <p>No active mandi trades recorded today for {commodity}.</p>
          </div>
        )}
      </div>

      {/* Source & Transparency Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Source: AGMARKNET / CACP Benchmark ({primaryRecord?.state || stateName})</span>
        </div>
        <span>{primaryRecord ? `Dated ${primaryRecord.priceDate}` : 'Real data'}</span>
      </div>
    </div>
  );
}
