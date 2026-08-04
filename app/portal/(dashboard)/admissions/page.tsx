"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { SearchInput } from "@/components/portal/ui/Input";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Pagination } from "@/components/portal/ui/Pagination";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { admissions, admissionStages, type AdmissionApplication, type AdmissionStage } from "@/lib/mock/admissions";
import { cn } from "@/lib/utils/cn";

const STAGE_TONE: Record<AdmissionStage, "neutral" | "info" | "warning" | "success" | "danger"> = {
  "New Inquiry": "neutral",
  "Documents Submitted": "info",
  "Interview Scheduled": "warning",
  "Offer Sent": "warning",
  Enrolled: "success",
  Declined: "danger",
};

export default function AdmissionsPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [stageFilter, setStageFilter] = useState<AdmissionStage | "all">("all");

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return admissions.filter((a) => {
      const matchesQuery = !q || a.applicantName.toLowerCase().includes(q) || a.guardianName.toLowerCase().includes(q);
      const matchesStage = stageFilter === "all" || a.stage === stageFilter;
      return matchesQuery && matchesStage;
    });
  }, [debouncedQuery, stageFilter]);

  const { page, pageCount, pageItems, total, pageSize, setPage } = usePagination(filtered, 8);

  const columns: Column<AdmissionApplication>[] = [
    { key: "applicant", header: "Applicant", render: (a) => <span className="font-medium text-slate-800">{a.applicantName}</span> },
    { key: "guardian", header: "Guardian", render: (a) => a.guardianName },
    { key: "class", header: "Applying For", render: (a) => a.desiredClass },
    { key: "applied", header: "Applied", render: (a) => a.appliedAt },
    { key: "stage", header: "Stage", render: (a) => <Badge tone={STAGE_TONE[a.stage]}>{a.stage}</Badge> },
  ];

  const counts = admissionStages.map((stage) => ({ stage, count: admissions.filter((a) => a.stage === stage).length }));

  return (
    <div>
      <PageHeader
        title="Admissions"
        description={`${admissions.length} applications in the pipeline this term`}
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Admissions" }]}
        action={
          <Button>
            <Plus className="h-4 w-4" /> New Application
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {counts.map(({ stage, count }) => (
          <button
            key={stage}
            onClick={() => setStageFilter(stageFilter === stage ? "all" : stage)}
            className={cn(
              "rounded-2xl border p-3.5 text-left transition",
              stageFilter === stage ? "border-oasis-400 bg-oasis-50" : "border-slate-200/70 bg-white hover:border-slate-300"
            )}
          >
            <p className="text-lg font-bold text-slate-900">{count}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-slate-500">{stage}</p>
          </button>
        ))}
      </div>

      <Card className="p-0">
        <div className="border-b border-slate-100 p-4">
          <SearchInput placeholder="Search applicants..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
        </div>
        <Table columns={columns} rows={pageItems} emptyTitle="No applications match your filters" />
        <Pagination page={page} pageCount={pageCount} total={total} pageSize={pageSize} onPageChange={setPage} />
      </Card>
    </div>
  );
}
