import React from "react";

interface HealthRingProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  sublabel?: string;
  showScore?: boolean;
}

export function HealthRing({
  score,
  size = "md",
  sublabel,
  showScore = true,
}: HealthRingProps) {
  const normalizedScore = Math.min(100, Math.max(0, score));

  // Determine colors
  let strokeColor = "#10b981"; // emerald-500
  let textColor = "text-emerald-600";
  let statusText = "Healthy";

  if (normalizedScore < 60) {
    strokeColor = "#f43f5e"; // rose-500
    textColor = "text-rose-600";
    statusText = "High Risk";
  } else if (normalizedScore < 80) {
    strokeColor = "#f59e0b"; // amber-500
    textColor = "text-amber-600";
    statusText = "Moderate";
  }

  const dimensions = {
    sm: { size: 64, stroke: 6, textSize: "text-base", subSize: "text-[10px]" },
    md: { size: 96, stroke: 8, textSize: "text-2xl", subSize: "text-xs" },
    lg: { size: 130, stroke: 10, textSize: "text-3xl", subSize: "text-sm" },
    xl: { size: 160, stroke: 12, textSize: "text-4xl", subSize: "text-base" },
  };

  const dim = dimensions[size];
  const radius = (dim.size - dim.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg
        width={dim.size}
        height={dim.size}
        className="transform -rotate-90 transition-all duration-1000 ease-out"
      >
        {/* Background track */}
        <circle
          cx={dim.size / 2}
          cy={dim.size / 2}
          r={radius}
          className="text-slate-100 dark:text-zinc-800 stroke-current"
          strokeWidth={dim.stroke}
          fill="transparent"
        />
        {/* Animated Progress circle */}
        <circle
          cx={dim.size / 2}
          cy={dim.size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={dim.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>

      {showScore && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 ${dim.textSize}`}>
            {normalizedScore}%
          </span>
          {sublabel ? (
            <span className={`font-medium text-slate-400 dark:text-zinc-500 ${dim.subSize}`}>{sublabel}</span>
          ) : (
            <span className={`font-semibold ${textColor} ${dim.subSize}`}>
              {statusText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
