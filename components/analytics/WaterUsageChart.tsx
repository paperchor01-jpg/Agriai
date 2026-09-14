'use client';

import React, { useState, useEffect } from 'react';
import { Droplets } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { WaterUsagePoint } from '@/lib/analytics-service';
import { Badge } from '@/components/ui/Badge';

interface WaterUsageChartProps {
  data: WaterUsagePoint[];
}

export function WaterUsageChart({ data }: WaterUsageChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = data.reduce((acc, curr) => acc + curr.usage, 0);

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs text-left min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800/60">
              Irrigation Volume
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 mt-1">
            Water Usage
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Daily water delivery across farm drip lines (Weekly Total: {total.toLocaleString()} L)
          </p>
        </div>

        <Badge variant="info" size="sm">
          7-Day Sum: {total.toLocaleString()} L
        </Badge>
      </div>

      <div className="h-64 sm:h-72 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.4} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}L`} />
              <Tooltip
                formatter={(value: unknown) => [`${value} Liters`, 'Applied Volume']}
                contentStyle={{
                  backgroundColor: 'var(--card-bg, #ffffff)',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              />
              <Bar
                dataKey="usage"
                name="Water Usage"
                fill="#0284c7"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-zinc-500">
            Loading water chart...
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
        <span>Peak Usage: Wednesday (210 L)</span>
        <span className="text-sky-700 dark:text-sky-400 font-bold">Optimal Drip Efficiency</span>
      </div>
    </div>
  );
}
