import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "emerald";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    success: "bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-500/25 dark:border-emerald-800/60 backdrop-blur-xs",
    emerald: "bg-emerald-500/15 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 dark:border-emerald-800/70 backdrop-blur-xs",
    warning: "bg-amber-500/10 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-500/25 dark:border-amber-800/60 backdrop-blur-xs",
    danger: "bg-rose-500/10 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-500/25 dark:border-rose-800/60 backdrop-blur-xs",
    info: "bg-sky-500/10 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-500/25 dark:border-sky-800/60 backdrop-blur-xs",
    neutral: "bg-slate-500/10 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border-slate-500/20 dark:border-zinc-700/80 backdrop-blur-xs",
  };

  const sizeStyles = {
    sm: "text-xs px-2.5 py-0.5 font-semibold rounded-full",
    md: "text-sm px-3 py-1 font-semibold rounded-full",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

