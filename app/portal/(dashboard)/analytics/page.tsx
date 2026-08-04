"use client";

import { GraduationCap, LogIn, MessageSquareText, Server, UserCog, Users } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { StatCard } from "@/components/portal/ui/StatCard";
import { TrendAreaChart, ComparisonBarChart } from "@/components/portal/charts/Charts";
import { platformAnalytics } from "@/lib/mock/platform";
import { schoolRequests } from "@/lib/mock/school-requests";

export default function AnalyticsPage() {
  const a = platformAnalytics;
  const loginTrend = Array.from({ length: 8 }, (_, i) => ({ label: `Wk ${i + 1}`, value: Math.round((a.loginsThisMonth / 30) * (5 + i)) }));
  const byDistrict = [...new Set(schoolRequests.map((r) => r.district))].map((d) => ({
    label: d,
    schools: schoolRequests.filter((r) => r.district === d).length,
  }));

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Anonymous, platform-wide statistics only - never individual students, parents or teachers."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Analytics" }]}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Students Across All Schools" value={a.totalStudents.toLocaleString()} icon={GraduationCap} accent="oasis" />
        <StatCard label="Teachers Across All Schools" value={a.totalTeachers.toLocaleString()} icon={UserCog} accent="sky" />
        <StatCard label="Parents Across All Schools" value={a.totalParents.toLocaleString()} icon={Users} accent="amber" />
        <StatCard label="Daily Platform Uptime" value={`${a.dailyUptimePct}%`} icon={Server} accent="emerald" />
        <StatCard label="Logins This Month" value={a.loginsThisMonth.toLocaleString()} icon={LogIn} accent="oasis" />
        <StatCard label="SMS Sent This Month" value={a.smsSentThisMonth.toLocaleString()} icon={MessageSquareText} accent="sky" />
        <StatCard label="Avg. Attendance (Platform)" value={`${a.avgAttendancePct}%`} icon={GraduationCap} accent="emerald" />
        <StatCard label="Schools Reporting" value={String(schoolRequests.filter((r) => r.status === "approved").length)} icon={Server} accent="amber" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Platform logins" subtitle="Last 8 weeks, aggregated" />
          <TrendAreaChart data={loginTrend} />
        </Card>
        <Card>
          <CardHeader title="Schools by district" />
          <ComparisonBarChart data={byDistrict} bars={[{ key: "schools", color: "#9498ef" }]} />
        </Card>
      </div>
    </div>
  );
}
