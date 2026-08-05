"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { SearchInput, Select } from "@/components/portal/ui/Input";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Pagination } from "@/components/portal/ui/Pagination";
import { Badge } from "@/components/portal/ui/Badge";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { useCollection } from "@/lib/store";
import type { PlatformEvent } from "@/types/portal";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

const TYPE_LABEL: Record<string, string> = {
  school_created: "School Created",
  subscription_renewed: "Subscription Renewed",
  subscription_cancelled: "Subscription Cancelled",
  admin_invited: "Admin Invited",
  backup_completed: "Backup Completed",
  feature_enabled: "Feature Enabled",
  maintenance: "Maintenance",
  deployment: "Deployment",
};

export default function AuditLogsPage() {
  const [auditLog] = useCollection<PlatformEvent>("oasis_platform_events");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return auditLog.filter((e) => {
      const matchesQuery = !q || e.message.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || e.type === typeFilter;
      return matchesQuery && matchesType;
    });
  }, [auditLog, debouncedQuery, typeFilter]);

  const { page, pageCount, pageItems, total, pageSize, setPage } = usePagination(filtered, 12);

  const columns: Column<PlatformEvent>[] = [
    { key: "type", header: "Type", render: (e) => <Badge tone="info">{TYPE_LABEL[e.type]}</Badge> },
    { key: "message", header: "Event", render: (e) => e.message },
    { key: "actor", header: "Actor", render: (e) => e.actor },
    { key: "timestamp", header: "Timestamp", render: (e) => e.timestamp },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Platform-level actions only - school created, subscription renewed, admin invited, backup completed, feature enabled. Not individual student or teacher activity."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Audit Logs" }]}
      />

      <Card className="p-0">
        {auditLog.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No platform actions logged yet" description="Approving schools, sending notifications and other admin actions will be recorded here." />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
              <SearchInput placeholder="Search events..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1" />
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="sm:w-56">
                <option value="all">All event types</option>
                {Object.entries(TYPE_LABEL).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <Table columns={columns} rows={pageItems} emptyTitle="No events match your filters" />
            <Pagination page={page} pageCount={pageCount} total={total} pageSize={pageSize} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}
