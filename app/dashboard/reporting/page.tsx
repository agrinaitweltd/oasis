"use client";

import { PageHeader } from "@/components/portal/PageHeader";
import { StatCard } from "@/components/portal/ui/StatCard";
import { useRealtimeRows } from "@/lib/supabase/useRealtimeRows";
import type { Tables } from "@/types/database.types";
import { Users, CalendarCheck, Wallet, GraduationCap, FileText, Siren } from "lucide-react";

export default function ReportingPage() {
  const { rows: students } = useRealtimeRows<Tables<"students">>("students");
  const { rows: attendance } = useRealtimeRows<Tables<"attendance_records">>("attendance_records");
  const { rows: invoices } = useRealtimeRows<Tables<"fee_invoices">>("fee_invoices");
  const { rows: assessments } = useRealtimeRows<Tables<"assessments">>("assessments");
  const { rows: exams } = useRealtimeRows<Tables<"exam_entries">>("exam_entries");
  const { rows: behaviour } = useRealtimeRows<Tables<"behaviour_incidents">>("behaviour_incidents");

  const today = new Date().toISOString().slice(0, 10);
  const presentToday = attendance.filter((a) => a.date === today && a.status === "present").length;
  const outstandingInvoices = invoices.filter((i) => i.status !== "paid");
  const outstandingTotal = outstandingInvoices.reduce((sum, i) => sum + Number(i.amount), 0);

  return (
    <div>
      <PageHeader
        title="Reporting"
        description="Live counts across student, attendance, finance and academic data. Real numbers only - a full custom report builder isn't built yet."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Reporting" }]}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total Students" value={String(students.length)} icon={Users} accent="oasis" />
        <StatCard label="Present Today" value={String(presentToday)} icon={CalendarCheck} accent="emerald" />
        <StatCard label="Outstanding Invoices" value={String(outstandingInvoices.length)} icon={Wallet} accent="amber" trendLabel={`${outstandingTotal.toLocaleString()} total`} />
        <StatCard label="Assessments Logged" value={String(assessments.length)} icon={GraduationCap} accent="sky" />
        <StatCard label="Exam Entries" value={String(exams.length)} icon={FileText} accent="oasis" />
        <StatCard label="Behaviour Incidents" value={String(behaviour.length)} icon={Siren} accent="amber" />
      </div>
    </div>
  );
}
