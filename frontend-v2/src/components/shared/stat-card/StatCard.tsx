"use client";

import { FC, ReactNode } from "react";

export type StatCardVariant =
  | "blue"
  | "emerald"
  | "rose"
  | "amber"
  | "violet"
  | "slate";

export interface StatCardProps {
  /** Uppercase label / title of the metric */
  title: string;
  /** Formatted value to display */
  value: ReactNode;
  /** Optional subtitle / description below the value */
  subtitle?: string;
  /** Icon rendered inside the colored badge */
  icon: ReactNode;
  /** Color theme for the icon badge */
  variant?: StatCardVariant;
  /** Whether the metric value is currently loading */
  isLoading?: boolean;
  /** Optional custom class for the value text */
  valueClassName?: string;
  /** Optional custom class for the card container */
  className?: string;
}

const iconVariantStyles: Record<StatCardVariant, string> = {
  blue: "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-600/20",
  emerald:
    "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-600/20",
  rose: "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-600/20",
  amber: "bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-600/20",
  violet:
    "bg-gradient-to-br from-violet-600 to-purple-600 shadow-violet-600/20",
  slate: "bg-gradient-to-br from-slate-700 to-slate-900 shadow-slate-800/20",
};

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = "blue",
  isLoading = false,
  valueClassName = "text-slate-900",
  className = "",
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
            {title}
          </p>

          {isLoading ? (
            <div className="h-8 w-24 rounded-lg bg-slate-200/80 animate-pulse mt-1" />
          ) : (
            <p
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight truncate ${valueClassName}`}
            >
              {value}
            </p>
          )}

          {subtitle && (
            <p className="text-xs text-slate-500 truncate">{subtitle}</p>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 ${iconVariantStyles[variant]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;

