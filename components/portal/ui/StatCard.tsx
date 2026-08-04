import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  accent = "oasis",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  accent?: "oasis" | "emerald" | "amber" | "sky";
}) {
  const accentClasses: Record<string, string> = {
    oasis: "bg-oasis-50 text-oasis-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    sky: "bg-sky-50 text-sky-600",
  };
  const isUp = (trend ?? 0) >= 0;

  return (
    <div className="animate-fade-up rounded-card border border-slate-200/70 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", accentClasses[accent])}>
          <Icon className="h-5 w-5" />
        </span>
        {trend !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
              isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}
          >
            {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
      {trendLabel && <p className="mt-2 text-[11px] text-slate-400">{trendLabel}</p>}
    </div>
  );
}
