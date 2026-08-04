"use client";

import Link from "next/link";
import {
  GraduationCap,
  UserCog,
  Users,
  CalendarCheck,
  Wallet,
  AlertTriangle,
  BookOpenCheck,
  MessageSquareText,
  UserPlus,
  FileSpreadsheet,
  Send,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { StatCard } from "@/components/portal/ui/StatCard";
import { MiniCalendar } from "@/components/portal/dashboard/MiniCalendar";
import { TrendAreaChart, ComparisonBarChart, DonutChart } from "@/components/portal/charts/Charts";
import { students, teachers, parents, classes, attendanceDays, attendanceForDate, announcements, activity } from "@/lib/mock";
import { totalCollected, totalOutstanding } from "@/lib/mock/finance";

function formatUgx(n: number) {
  return "UGX " + n.toLocaleString("en-UG");
}

export default function DashboardPage() {
  const today = attendanceDays[attendanceDays.length - 1];
  const todayRecords = attendanceForDate(today);
  const presentToday = todayRecords.filter((r) => r.status === "Present" || r.status === "Late").length;
  const attendancePct = todayRecords.length ? Math.round((presentToday / todayRecords.length) * 100) : 0;
  const smsSent = announcements.filter((a) => a.channel === "SMS" && a.status === "Sent").reduce((s, a) => s + a.recipients, 0);

  const attendanceTrend = attendanceDays.map((d) => {
    const recs = attendanceForDate(d);
    const present = recs.filter((r) => r.status === "Present" || r.status === "Late").length;
    return { label: d.slice(5), value: recs.length ? Math.round((present / recs.length) * 100) : 0 };
  });

  const feesByClass = classes.slice(0, 6).map((c) => ({ label: c.name, collected: Math.round((c.studentCount * 850000) / 1000000) }));

  const genderSplit = [
    { name: "Male", value: students.filter((s) => s.gender === "Male").length },
    { name: "Female", value: students.filter((s) => s.gender === "Female").length },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Here's what's happening across your school today."
        action={
          <Link
            href="/portal/reports"
            className="inline-flex items-center gap-1.5 rounded-xl bg-oasis-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-oasis-600"
          >
            View reports <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Students" value={students.length.toLocaleString()} icon={GraduationCap} trend={4} trendLabel="vs last term" accent="oasis" />
        <StatCard label="Teachers" value={teachers.length.toLocaleString()} icon={UserCog} trend={2} trendLabel="vs last term" accent="sky" />
        <StatCard label="Parents" value={parents.length.toLocaleString()} icon={Users} trend={3} trendLabel="vs last term" accent="amber" />
        <StatCard label="Attendance Today" value={`${attendancePct}%`} icon={CalendarCheck} trend={attendancePct >= 85 ? 2 : -3} accent="emerald" />
        <StatCard label="Fees Collected" value={formatUgx(totalCollected())} icon={Wallet} trend={11} trendLabel="this term" accent="emerald" />
        <StatCard label="Outstanding Fees" value={formatUgx(totalOutstanding())} icon={AlertTriangle} trend={-6} trendLabel="this term" accent="amber" />
        <StatCard label="Active Classes" value={classes.length.toLocaleString()} icon={BookOpenCheck} accent="sky" />
        <StatCard label="SMS Sent" value={smsSent.toLocaleString()} icon={MessageSquareText} trend={8} trendLabel="this month" accent="oasis" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Attendance trend" subtitle="Last 14 school days, all classes" />
          <TrendAreaChart data={attendanceTrend} />
        </Card>
        <Card>
          <CardHeader title="Student gender split" />
          <DonutChart data={genderSplit} />
          <div className="mt-2 flex justify-center gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-oasis-500" /> Male</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Female</span>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Fees collected by class" subtitle="UGX millions, current term" />
          <ComparisonBarChart data={feesByClass} bars={[{ key: "collected", color: "#9498ef" }]} />
        </Card>

        <Card>
          <CardHeader title="Calendar" />
          <MiniCalendar />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Recent activity" subtitle="Latest events across the school" />
          <ul className="divide-y divide-slate-50">
            {activity.slice(0, 7).map((item) => (
              <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-oasis-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-700">{item.message}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {item.actor} &middot; {item.timestamp}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Quick actions" />
          <div className="grid grid-cols-2 gap-3">
            <QuickAction href="/portal/students" icon={UserPlus} label="Add Student" />
            <QuickAction href="/portal/attendance" icon={ClipboardList} label="Take Attendance" />
            <QuickAction href="/portal/finance" icon={FileSpreadsheet} label="New Invoice" />
            <QuickAction href="/portal/communication" icon={Send} label="Send SMS" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label }: { href: string; icon: typeof UserPlus; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:-translate-y-0.5 hover:border-oasis-200 hover:bg-oasis-50"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-oasis-600 shadow-sm">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <span className="text-[13px] font-semibold text-slate-700">{label}</span>
    </Link>
  );
}
