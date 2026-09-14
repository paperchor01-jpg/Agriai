import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "subtle" | "panel" | "accent-emerald" | "accent-amber" | "accent-sky" | "accent-rose";
  hoverEffect?: boolean;
  className?: string;
}

export function GlassCard({
  children,
  variant = "default",
  hoverEffect = false,
  className = "",
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 shadow-xs",
    subtle: "bg-slate-50/70 dark:bg-zinc-800/50 backdrop-blur-xs border border-slate-200/60 dark:border-zinc-800/60",
    panel: "bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-zinc-800/90 shadow-xl",
    "accent-emerald": "bg-emerald-50/70 dark:bg-emerald-950/40 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs",
    "accent-amber": "bg-amber-50/70 dark:bg-amber-950/40 backdrop-blur-md border border-amber-200/80 dark:border-amber-800/60 shadow-xs",
    "accent-sky": "bg-sky-50/70 dark:bg-sky-950/40 backdrop-blur-md border border-sky-200/80 dark:border-sky-800/60 shadow-xs",
    "accent-rose": "bg-rose-50/70 dark:bg-rose-950/40 backdrop-blur-md border border-rose-200/80 dark:border-rose-800/60 shadow-xs",
  };

  const hoverClass = hoverEffect
    ? "hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200"
    : "transition-colors duration-150";

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl ${variantStyles[variant]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
