"use client";

import { useMemo, useState } from "react";
import { BarChart3, FileSpreadsheet, GraduationCap, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Select } from "@/components/portal/ui/Input";
import { Table, type Column } from "@/components/portal/ui/Table";
import { StatusBadge, Badge } from "@/components/portal/ui/Badge";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { ComparisonBarChart } from "@/components/portal/charts/Charts";
import { exams, resultsForExam } from "@/lib/mock/exams";
import type { ExamResult } from "@/types/portal";
import { getStudentById } from "@/lib/mock/students";
import { classes } from "@/lib/mock/classes";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { key: "exams", label: "Exam Management", icon: ListChecks },
  { key: "marks", label: "Marks & Gradebook", icon: FileSpreadsheet },
  { key: "reports", label: "Report Cards", icon: GraduationCap },
  { key: "performance", label: "Performance", icon: BarChart3 },
] as const;

export default function ExaminationsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("exams");
  const publishedExams = exams.filter((e) => e.status === "Published");
  const [examId, setExamId] = useState(publishedExams[0]?.id ?? exams[0].id);

  const results = useMemo(() => resultsForExam(examId), [examId]);

  const columns: Column<ExamResult>[] = [
    {
      key: "student",
      header: "Student",
      render: (r) => {
        const s = getStudentById(r.studentId);
        return s ? `${s.firstName} ${s.lastName}` : "—";
      },
    },
    { key: "subject", header: "Subject", render: (r) => r.subject },
    { key: "score", header: "Score", render: (r) => `${r.score}/${r.maxScore}` },
    { key: "grade", header: "Grade", render: (r) => <Badge tone={r.grade === "A" ? "success" : r.grade === "F" ? "danger" : "neutral"}>{r.grade}</Badge> },
  ];

  const avgBySubject = useMemo(() => {
    const bySubject = new Map<string, number[]>();
    results.forEach((r) => {
      const arr = bySubject.get(r.subject) ?? [];
      arr.push(r.score);
      bySubject.set(r.subject, arr);
    });
    return [...bySubject.entries()].map(([label, scores]) => ({
      label,
      average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));
  }, [results]);

  return (
    <div>
      <PageHeader
        title="Examinations"
        description="Manage exams, marks, report cards and performance"
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Examinations" }]}
      />

      <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white p-1.5">
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

      {tab === "exams" && (
        <Card className="p-0">
          <Table
            columns={[
              { key: "name", header: "Exam", render: (e: (typeof exams)[number]) => e.name },
              { key: "term", header: "Term", render: (e: (typeof exams)[number]) => e.term },
              { key: "dates", header: "Dates", render: (e: (typeof exams)[number]) => `${e.startDate} → ${e.endDate}` },
              { key: "status", header: "Status", render: (e: (typeof exams)[number]) => <StatusBadge status={e.status} /> },
            ]}
            rows={exams}
          />
        </Card>
      )}

      {(tab === "marks" || tab === "reports") && (
        <>
          <div className="mb-4">
            <Select value={examId} onChange={(e) => setExamId(e.target.value)} className="w-64">
              {publishedExams.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </Select>
          </div>
          <Card className="p-0">
            {tab === "marks" ? (
              <Table columns={columns} rows={results.slice(0, 200)} emptyTitle="No results published for this exam yet" />
            ) : results.length === 0 ? (
              <div className="p-6">
                <EmptyState title="No report cards available" description="Results must be published before report cards can be generated." />
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {classes.slice(0, 6).map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {c.name} {c.stream}
                      </p>
                      <p className="text-xs text-slate-400">{c.studentCount} report cards ready</p>
                    </div>
                    <button className="text-sm font-semibold text-oasis-600 hover:text-oasis-700">Generate PDFs</button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {tab === "performance" && (
        <Card>
          <CardHeader title="Average score by subject" subtitle={exams.find((e) => e.id === examId)?.name} />
          <ComparisonBarChart data={avgBySubject} bars={[{ key: "average", color: "#9498ef" }]} xKey="label" />
        </Card>
      )}
    </div>
  );
}
