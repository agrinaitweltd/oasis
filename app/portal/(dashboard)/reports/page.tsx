"use client";

import { Download, GraduationCap, CalendarCheck, Wallet, FileSpreadsheet, UserCog } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Button } from "@/components/portal/ui/Button";
import { TrendAreaChart, ComparisonBarChart } from "@/components/portal/charts/Charts";
import { attendanceDays, attendanceForDate } from "@/lib/mock/attendance";
import { classes } from "@/lib/mock/classes";
import { useToast } from "@/hooks/useToast";

const REPORT_TYPES = [
  { key: "students", label: "Student Reports", description: "Enrolment, demographics and status breakdowns", icon: GraduationCap },
  { key: "attendance", label: "Attendance Reports", description: "Daily, weekly and termly attendance summaries", icon: CalendarCheck },
  { key: "finance", label: "Finance Reports", description: "Collections, outstanding balances and expenses", icon: Wallet },
  { key: "exams", label: "Exam Reports", description: "Subject performance and grade distributions", icon: FileSpreadsheet },
  { key: "teachers", label: "Teacher Reports", description: "Workload, attendance and leave summaries", icon: UserCog },
];

export default function ReportsPage() {
  const { toast } = useToast();

  const trend = attendanceDays.map((d) => {
    const recs = attendanceForDate(d);
    const present = recs.filter((r) => r.status === "Present" || r.status === "Late").length;
    return { label: d.slice(5), value: recs.length ? Math.round((present / recs.length) * 100) : 0 };
  });
  const byClass = classes.slice(0, 8).map((c) => ({ label: c.name, students: c.studentCount }));

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate and export reports across every area of the school"
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Reports" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORT_TYPES.map((r) => (
          <Card key={r.key} className="flex flex-col">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-oasis-50 text-oasis-600">
              <r.icon className="h-5 w-5" />
            </span>
            <p className="text-sm font-semibold text-slate-800">{r.label}</p>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-500">{r.description}</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 w-fit"
              onClick={() => toast("success", "Export started", `${r.label} will download shortly.`)}
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="School-wide attendance" subtitle="Last 14 school days" />
          <TrendAreaChart data={trend} />
        </Card>
        <Card>
          <CardHeader title="Enrolment by class" />
          <ComparisonBarChart data={byClass} bars={[{ key: "students", color: "#38bdf8" }]} />
        </Card>
      </div>
    </div>
  );
}
