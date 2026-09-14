import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    text: string;
    positive?: boolean;
  };
  accentColor?: "emerald" | "amber" | "sky" | "indigo" | "rose" | "slate";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = "emerald",
}: StatCardProps) {
  const iconBgStyles = {
    emerald: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/60",
    amber: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/60",
    sky: "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-800/60",
    indigo: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/60",
    rose: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/60",
    slate: "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
  };

  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-200 text-left">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">{title}</span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border backdrop-blur-xs ${iconBgStyles[accentColor]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
        <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
          {value}
        </span>
        {trend && (
          <span
            className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${
              trend.positive
                ? "bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-500/20 dark:border-emerald-800/60"
                : "bg-amber-500/10 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-500/20 dark:border-amber-800/60"
            }`}
          >
            {trend.text}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 font-medium">{subtitle}</p>
      )}
    </div>
  );
}
