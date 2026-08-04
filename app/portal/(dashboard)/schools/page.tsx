"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { SearchInput } from "@/components/portal/ui/Input";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Pagination } from "@/components/portal/ui/Pagination";
import { Badge } from "@/components/portal/ui/Badge";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { schoolRequests, apiKeysForRequest } from "@/lib/mock/school-requests";
import type { SchoolRequest, SchoolRequestStatus } from "@/types/portal";
import { cn } from "@/lib/utils/cn";

const STAGE_TONE: Record<SchoolRequestStatus, "neutral" | "info" | "warning" | "success" | "danger"> = {
  pending_review: "warning",
  approved: "success",
  rejected: "danger",
  more_info_requested: "info",
  suspended: "neutral",
};

const STAGE_LABEL: Record<SchoolRequestStatus, string> = {
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  more_info_requested: "More Info Requested",
  suspended: "Suspended",
};

const STAGES: SchoolRequestStatus[] = ["pending_review", "approved", "more_info_requested", "rejected", "suspended"];

export default function SchoolsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [statusFilter, setStatusFilter] = useState<SchoolRequestStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return schoolRequests.filter((r) => {
      const matchesQuery = !q || r.schoolName.toLowerCase().includes(q) || r.contactName.toLowerCase().includes(q) || r.district.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [debouncedQuery, statusFilter]);

  const { page, pageCount, pageItems, total, pageSize, setPage } = usePagination(filtered, 8);

  const columns: Column<SchoolRequest>[] = [
    {
      key: "school",
      header: "School",
      render: (r) => (
        <div>
          <p className="font-medium text-slate-800">{r.schoolName}</p>
          <p className="text-xs text-slate-400">{r.district} District</p>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (r) => (
        <div>
          <p className="text-slate-700">{r.contactName}</p>
          <p className="text-xs text-slate-400">{r.contactRole}</p>
        </div>
      ),
    },
    { key: "type", header: "Type", render: (r) => r.schoolType },
    { key: "requested", header: "Requested", render: (r) => r.requestedAt },
    {
      key: "keys",
      header: "API Keys",
      render: (r) => {
        const count = apiKeysForRequest(r.id).length;
        return count > 0 ? <Badge tone="info">{count} active</Badge> : <span className="text-xs text-slate-400">—</span>;
      },
    },
    { key: "status", header: "Status", render: (r) => <Badge tone={STAGE_TONE[r.status]}>{STAGE_LABEL[r.status]}</Badge> },
  ];

  const counts = STAGES.map((s) => ({ status: s, count: schoolRequests.filter((r) => r.status === s).length }));

  return (
    <div>
      <PageHeader
        title="Schools"
        description="Review setup requests, approve schools onto the platform, and manage their API keys"
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Schools" }]}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {counts.map(({ status, count }) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            className={cn(
              "rounded-2xl border p-3.5 text-left transition",
              statusFilter === status ? "border-oasis-400 bg-oasis-50" : "border-slate-200/70 bg-white hover:border-slate-300"
            )}
          >
            <p className="text-lg font-bold text-slate-900">{count}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-slate-500">{STAGE_LABEL[status]}</p>
          </button>
        ))}
      </div>

      <Card className="p-0">
        <div className="border-b border-slate-100 p-4">
          <SearchInput placeholder="Search by school, contact or district..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
        </div>
        <Table
          columns={columns}
          rows={pageItems}
          onRowClick={(r) => router.push(`/portal/schools/${r.id}`)}
          emptyTitle="No school requests match your filters"
        />
        <Pagination page={page} pageCount={pageCount} total={total} pageSize={pageSize} onPageChange={setPage} />
      </Card>
    </div>
  );
}
