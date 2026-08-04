"use client";

import { useMemo, useState } from "react";
import { BarChart3, CalendarCheck, ClipboardList, Clock, UserX } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Select } from "@/components/portal/ui/Input";
import { Table, type Column } from "@/components/portal/ui/Table";
import { StatusBadge } from "@/components/portal/ui/Badge";
import { Avatar } from "@/components/portal/ui/Avatar";
import { StatCard } from "@/components/portal/ui/StatCard";
import { TrendAreaChart, ComparisonBarChart } from "@/components/portal/charts/Charts";
import { attendanceDays, attendanceForDate } from "@/lib/mock/attendance";
import { classes } from "@/lib/mock/classes";
import { getStudentById } from "@/lib/mock/students";
import type { AttendanceRecord } from "@/types/portal";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { key: "register", label: "Daily Register", icon: ClipboardList },
  { key: "late", label: "Late Arrivals", icon: Clock },
  { key: "absentees", label: "Absentees", icon: UserX },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
] as const;

export default function AttendancePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("register");
  const [date, setDate] = useState(attendanceDays[attendanceDays.length - 1]);
  const [classFilter, setClassFilter] = useState("all");

  const records = useMemo(() => {
    const dayRecords = attendanceForDate(date);
    return classFilter === "all" ? dayRecords : dayRecords.filter((r) => r.classId === classFilter);
  }, [date, classFilter]);

  const present = records.filter((r) => r.status === "Present").length;
  const late = records.filter((r) => r.status === "Late").length;
  const absent = records.filter((r) => r.status === "Absent").length;
  const excused = records.filter((r) => r.status === "Excused").length;

  const baseColumns: Column<AttendanceRecord>[] = [
    {
      key: "student",
      header: "Student",
      render: (r) => {
        const s = getStudentById(r.studentId);
        return (
          <div className="flex items-center gap-3">
            <Avatar name={s ? `${s.firstName} ${s.lastName}` : "?"} size={30} />
            <span className="font-medium text-slate-800">{s ? `${s.firstName} ${s.lastName}` : "Unknown"}</span>
          </div>
        );
      },
    },
    { key: "class", header: "Class", render: (r) => getStudentById(r.studentId)?.className ?? "—" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "time", header: "Arrival", render: (r) => r.arrivalTime ?? "—" },
  ];

  const trend = attendanceDays.map((d) => {
    const recs = attendanceForDate(d);
    const p = recs.filter((r) => r.status === "Present" || r.status === "Late").length;
    return { label: d.slice(5), value: recs.length ? Math.round((p / recs.length) * 100) : 0 };
  });

  const byClass = classes.slice(0, 8).map((c) => {
    const recs = attendanceForDate(date).filter((r) => r.classId === c.id);
    return { label: c.name, present: recs.filter((r) => r.status === "Present" || r.status === "Late").length };
  });

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Track daily attendance, late arrivals and absentee trends"
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Attendance" }]}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Present" value={String(present)} icon={CalendarCheck} accent="emerald" />
        <StatCard label="Late" value={String(late)} icon={Clock} accent="amber" />
        <StatCard label="Absent" value={String(absent)} icon={UserX} accent="oasis" />
        <StatCard label="Excused" value={String(excused)} icon={ClipboardList} accent="sky" />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white p-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-medium transition",
                tab === t.key ? "bg-oasis-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
        {tab !== "analytics" && (
          <div className="ml-auto flex gap-2">
            <Select value={date} onChange={(e) => setDate(e.target.value)} className="w-40">
              {attendanceDays.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="w-44">
              <option value="all">All classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.stream}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>

      {tab === "register" && (
        <Card className="p-0">
          <Table columns={baseColumns} rows={records} emptyTitle="No attendance recorded" />
        </Card>
      )}
      {tab === "late" && (
        <Card className="p-0">
          <Table columns={baseColumns} rows={records.filter((r) => r.status === "Late")} emptyTitle="No late arrivals for this day" />
        </Card>
      )}
      {tab === "absentees" && (
        <Card className="p-0">
          <Table columns={baseColumns} rows={records.filter((r) => r.status === "Absent" || r.status === "Excused")} emptyTitle="No absentees for this day" />
        </Card>
      )}
      {tab === "analytics" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Card>
            <CardHeader title="Attendance trend" subtitle="Last 14 school days" />
            <TrendAreaChart data={trend} />
          </Card>
          <Card>
            <CardHeader title="Present students by class" subtitle={date} />
            <ComparisonBarChart data={byClass} bars={[{ key: "present", color: "#34d399" }]} />
          </Card>
        </div>
      )}
    </div>
  );
}
