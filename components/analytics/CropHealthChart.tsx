'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Sparkles } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { HealthTrendPoint } from '@/lib/analytics-service';
import { Badge } from '@/components/ui/Badge';

interface CropHealthChartProps {
  data: HealthTrendPoint[];
}

export function CropHealthChart({ data }: CropHealthChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs text-left min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              7-Day Progression
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 mt-1">
            Crop Health Over Time
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Daily vegetative vigor trajectory showing steady canopy recovery
          </p>
        </div>

        <Badge variant="success" size="sm">
          Current: 87% (+9% Net)
        </Badge>
      </div>

      <div className="h-64 sm:h-72 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.4} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 95]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
              <Tooltip
                formatter={(value: unknown) => [`${value}%`, 'Health Score']}
                contentStyle={{
                  backgroundColor: 'var(--card-bg, #ffffff)',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                name="Crop Health"
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 7, fill: '#10b981', stroke: '#ffffff', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-zinc-500">
            Loading telemetry chart...
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
        <span>Day 1 (78%) $\rightarrow$ Day 7 (87%)</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">Consistently Above Regional Benchmark</span>
      </div>
    </div>
  );
}
