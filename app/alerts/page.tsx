'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  CheckCheck,
  ArrowRight,
  ShieldAlert,
  Clock,
  MapPin,
  X,
  Filter,
  Sparkles,
  Eye,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/Badge';
import { getAlerts, markAlertAsRead, markAllAlertsAsRead } from '@/lib/alert-service';
import { AlertItem } from '@/types';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'warning' | 'info' | 'unread'>('all');

  const syncAlerts = () => {
    setAlerts(getAlerts());
  };

  useEffect(() => {
    syncAlerts();
    window.addEventListener('agriai:alerts-updated', syncAlerts);
    return () => window.removeEventListener('agriai:alerts-updated', syncAlerts);
  }, []);

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    markAlertAsRead(id);
    syncAlerts();
    if (selectedAlert?.id === id) {
      setSelectedAlert((prev) => (prev ? { ...prev, read: true } : null));
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAlertsAsRead(alerts.map((a) => a.id));
    syncAlerts();
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'unread') return !a.read;
    if (filter === 'high') return a.level === 'HIGH' || a.priority === 'HIGH';
    if (filter === 'warning') return a.level === 'WARNING' || a.priority === 'WARNING';
    if (filter === 'info') return a.level === 'INFO' || a.priority === 'INFO';
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  const getAlertIcon = (level: AlertItem['level'] | AlertItem['priority']) => {
    switch (level) {
      case 'HIGH':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'INFO':
      default:
        return <Info className="w-5 h-5 text-sky-600" />;
    }
  };

  const getAlertBadge = (level: AlertItem['level'] | AlertItem['priority']) => {
    switch (level) {
      case 'HIGH':
        return <Badge variant="danger">HIGH PRIORITY</Badge>;
      case 'WARNING':
        return <Badge variant="warning">WARNING</Badge>;
      case 'INFO':
      default:
        return <Badge variant="info">INFORMATION</Badge>;
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto text-left">
        {/* 1. Header with Title, Subtitle, and Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-sm shadow-rose-600/20">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                    Alerts & Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500 text-white shadow-xs">
                      {`${unreadCount} Unread Alerts`}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Important updates and actions for your farm.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 rounded-2xl bg-white/80 dark:bg-zinc-800/80 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200/80 dark:border-zinc-700/80 text-xs font-bold text-slate-700 dark:text-zinc-300 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-600 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Mark All as Read</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Filter Tabs (Requirement 4: All, High Priority, Warning, Information, Unread) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs'
                : 'bg-white/80 dark:bg-zinc-850/80 text-slate-600 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-750/80 hover:bg-slate-50 dark:hover:bg-zinc-700'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filter === 'high'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white/80 dark:bg-zinc-850/80 text-slate-600 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-750/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-400'
            }`}
          >
            High Priority ({alerts.filter((a) => a.priority === 'HIGH' || a.level === 'HIGH').length})
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filter === 'warning'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white/80 dark:bg-zinc-850/80 text-slate-600 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-750/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 dark:hover:text-amber-400'
            }`}
          >
            Warning ({alerts.filter((a) => a.priority === 'WARNING' || a.level === 'WARNING').length})
          </button>
          <button
            onClick={() => setFilter('info')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filter === 'info'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white/80 dark:bg-zinc-850/80 text-slate-600 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-750/80 hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-700 dark:hover:text-sky-400'
            }`}
          >
            Information ({alerts.filter((a) => a.priority === 'INFO' || a.level === 'INFO').length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filter === 'unread'
                ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs'
                : 'bg-white/80 dark:bg-zinc-850/80 text-slate-600 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-750/80 hover:bg-slate-50 dark:hover:bg-zinc-700'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* 3. Alert Cards List */}
        <div className="space-y-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
              const isHigh = alert.priority === 'HIGH' || alert.level === 'HIGH';
              const isWarning = alert.priority === 'WARNING' || alert.level === 'WARNING';

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                    !alert.read
                      ? isHigh
                        ? 'glass-card bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 shadow-xs hover:border-rose-300'
                        : isWarning
                        ? 'glass-card bg-amber-50/40 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 shadow-xs hover:border-amber-300'
                        : 'glass-card bg-sky-50/40 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900/50 shadow-xs hover:border-sky-300'
                      : 'glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-slate-200/90 dark:border-zinc-800/90 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isHigh
                          ? 'bg-rose-100/90 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400'
                          : isWarning
                          ? 'bg-amber-100/90 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400'
                          : 'bg-sky-100/90 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400'
                      }`}
                    >
                      {getAlertIcon(alert.priority || alert.level)}
                    </div>

                    {/* Content */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {getAlertBadge(alert.priority || alert.level)}
                        <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                          {alert.farmName || 'Green Valley Farm'}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                          • {alert.timing ? `Timing: ${alert.timing}` : alert.date}
                        </span>
                        {!alert.read && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                            NEW
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                        {alert.title}
                      </h3>

                      {/* Reason */}
                      <div className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300">
                        <strong className="text-slate-700 dark:text-zinc-200 font-bold">Reason: </strong>
                        <span>{alert.reason || alert.message}</span>
                      </div>

                      {/* Action */}
                      <div className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 bg-white/70 dark:bg-zinc-800/60 p-3 rounded-2xl border border-slate-200/70 dark:border-zinc-700/70 inline-block w-full">
                        <strong className="text-emerald-800 dark:text-emerald-400 font-bold">Recommended Action: </strong>
                        <span>{alert.action}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Controls */}
                  <div className="pt-3 border-t border-slate-200/60 dark:border-zinc-800/60 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                      <span>{alert.createdAt || alert.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!alert.read ? (
                        <button
                          onClick={(e) => handleMarkAsRead(alert.id, e)}
                          className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-bold transition-colors cursor-pointer"
                        >
                          Mark as Read
                        </button>
                      ) : (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Read
                        </span>
                      )}

                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <span>Open Alert</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center glass-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-zinc-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">No alerts in this view</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                You are all caught up! No notifications match the selected filter.
              </p>
            </div>
          )}
        </div>

        {/* 4. Alert Detail Modal (Requirement 5) */}
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg glass-card bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden text-left">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-850/70">
                <div className="flex items-center gap-2">
                  {getAlertIcon(selectedAlert.priority || selectedAlert.level)}
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300">
                    {selectedAlert.priority || selectedAlert.level} Alert
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getAlertBadge(selectedAlert.priority || selectedAlert.level)}
                    <span className="text-xs text-slate-500 dark:text-zinc-400">{selectedAlert.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                    {selectedAlert.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                    Target Farm: <strong className="text-slate-800 dark:text-zinc-200">{selectedAlert.farmName}</strong>
                  </p>
                </div>

                {/* Reason Details */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/80 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                  <p className="font-bold text-slate-900 dark:text-zinc-100 mb-1">Reason:</p>
                  <p>{selectedAlert.reason || selectedAlert.message}</p>
                </div>

                {/* Action Details */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed">
                  <p className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">Recommended Action:</p>
                  <p>{selectedAlert.action}</p>
                  {selectedAlert.timing && (
                    <p className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      Timing: <strong>{selectedAlert.timing}</strong>
                    </p>
                  )}
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
                  {!selectedAlert.read ? (
                    <button
                      onClick={() => handleMarkAsRead(selectedAlert.id)}
                      className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl cursor-pointer"
                    >
                      Mark as Read
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Marked as Read
                    </span>
                  )}

                  {selectedAlert.actionUrl && (
                    <Link
                      href={selectedAlert.actionUrl}
                      onClick={() => {
                        handleMarkAsRead(selectedAlert.id);
                        setSelectedAlert(null);
                      }}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>{selectedAlert.actionCta || 'Launch Action'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
