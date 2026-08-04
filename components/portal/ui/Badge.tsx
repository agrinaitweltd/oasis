import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-600",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-600",
  info: "bg-oasis-50 text-oasis-600",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", toneClasses[tone])}>
      {children}
    </span>
  );
}

const STATUS_TONE: Record<string, Tone> = {
  Active: "success",
  Present: "success",
  Paid: "success",
  Approved: "success",
  Sent: "success",
  Published: "success",
  Pending: "warning",
  Partial: "warning",
  Late: "warning",
  Scheduled: "warning",
  "In Progress": "warning",
  "On Leave": "warning",
  Draft: "neutral",
  Inactive: "neutral",
  Graduated: "neutral",
  Transferred: "neutral",
  Absent: "danger",
  Overdue: "danger",
  Rejected: "danger",
  Suspended: "danger",
  Excused: "info",
  Marking: "info",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? "neutral"}>{status}</Badge>;
}
