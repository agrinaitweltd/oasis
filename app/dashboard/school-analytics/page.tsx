"use client";

import { PageHeader } from "@/components/portal/PageHeader";
import { StatCard } from "@/components/portal/ui/StatCard";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { useRealtimeRows } from "@/lib/supabase/useRealtimeRows";
import type { Tables } from "@/types/database.types";
import { LineChart, CalendarCheck, Siren, GraduationCap } from "lucide-react";

export default function SchoolAnalyticsPage() {
  const { rows: attendance } = useRealtimeRows<Tables<"attendance_records">>("attendance_records");
  const { rows: behaviour } = useRealtimeRows<Tables<"behaviour_incidents">>("behaviour_incidents");
  const { rows: assessments } = useRealtimeRows<Tables<"assessments">>("assessments");

  const presentCount = attendance.filter((a) => a.status === "present").length;
  const attendanceRate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : null;

  const positivePoints = behaviour.filter((b) => b.type === "positive").length;
  const negativePoints = behaviour.filter((b) => b.type === "negative").length;

  const scored = assessments.filter((a) => a.score != null);
  const avgPct = scored.length
    ? Math.round((scored.reduce((sum, a) => sum + (a.score! / a.max_score) * 100, 0) / scored.length))
    : null;

  return (
    <div>
      <PageHeader
        title="School Analytics"
        description="Attendance, behaviour and academic trends, computed live from real records."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "School Analytics" }]}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Attendance Rate" value={attendanceRate != null ? `${attendanceRate}%` : "—"} icon={CalendarCheck} accent="emerald" trendLabel={attendance.length ? `${attendance.length} records` : "No records yet"} />
        <StatCard label="Behaviour Points" value={`+${positivePoints} / -${negativePoints}`} icon={Siren} accent="amber" />
        <StatCard label="Average Assessment Score" value={avgPct != null ? `${avgPct}%` : "—"} icon={GraduationCap} accent="sky" trendLabel={scored.length ? `${scored.length} scored` : "No scores yet"} />
      </div>

      <Card className="mt-5 border-dashed bg-slate-50/60">
        <EmptyState icon={LineChart} title="Charts coming later" description="These numbers are real and live - visual graphs and year/class/house comparisons aren't built yet." />
      </Card>
    </div>
  );
}
