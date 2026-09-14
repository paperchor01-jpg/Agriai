'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, AlertTriangle, CloudRain, Info, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { getAlerts } from '@/lib/alert-service';
import { AlertItem } from '@/types';

export function AlertCard() {
  const [alerts, setAlerts] = React.useState<AlertItem[]>([]);

  React.useEffect(() => {
    const sync = () => setAlerts(getAlerts());
    sync();
    window.addEventListener('agriai:alerts-updated', sync);
    return () => window.removeEventListener('agriai:alerts-updated', sync);
  }, []);
  const getBadgeVariant = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'danger';
      case 'WARNING':
        return 'warning';
      case 'INFO':
      default:
        return 'info';
    }
  };

  const getIcon = (level: string) => {
    switch (level) {
      case 'HIGH':
        return AlertTriangle;
      case 'WARNING':
        return CloudRain;
      case 'INFO':
      default:
        return Info;
    }
  };

  const getLabel = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'High Priority';
      case 'WARNING':
        return 'Warning';
      case 'INFO':
      default:
        return 'Information';
    }
  };

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between text-left">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Recent Alerts</h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Critical notifications for your farm</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            {alerts.length} Alerts
          </span>
        </div>

        {/* List of 3 Alerts */}
        <div className="mt-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-dashed border-slate-200 dark:border-zinc-700 text-center">
              <p className="text-xs text-slate-500 dark:text-zinc-400">No active alerts for your farm.</p>
            </div>
          ) : (
            alerts.slice(0, 3).map((alert) => {
            const Icon = getIcon(alert.level);
            const badgeVariant = getBadgeVariant(alert.level);
            const priorityLabel = getLabel(alert.level);

            return (
              <Link
                key={alert.id}
                href={alert.actionUrl || '/alerts'}
                className="block p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 hover:bg-white dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xs transition-all text-left group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                    <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                    <span>{priorityLabel}</span>
                  </span>
                  <Badge variant={badgeVariant} size="sm">
                    {alert.level}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {alert.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-1">
                  {alert.message}
                </p>
              </Link>
            );
          }))}
        </div>
      </div>

      {/* Footer Link */}
      <Link
        href="/alerts"
        className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center justify-between group"
      >
        <span>View All Alerts</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
