"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { SearchInput, Select } from "@/components/portal/ui/Input";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Pagination } from "@/components/portal/ui/Pagination";
import { StatusBadge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { homework, type Homework } from "@/lib/mock/homework";
import { classes } from "@/lib/mock/classes";
import { teachers } from "@/lib/mock/teachers";

export default function HomeworkPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedQuery = useDebounce(query);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return homework.filter((h) => {
      const matchesQuery = !q || h.title.toLowerCase().includes(q) || h.subject.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || h.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [debouncedQuery, statusFilter]);

  const { page, pageCount, pageItems, total, pageSize, setPage } = usePagination(filtered, 8);

  const columns: Column<Homework>[] = [
    {
      key: "title",
      header: "Assignment",
      render: (h) => (
        <div>
          <p className="font-medium text-slate-800">{h.title}</p>
          <p className="text-xs text-slate-400">{h.subject}</p>
        </div>
      ),
    },
    {
      key: "class",
      header: "Class",
      render: (h) => {
        const c = classes.find((cc) => cc.id === h.classId);
        return c ? `${c.name} ${c.stream}` : "—";
      },
    },
    {
      key: "teacher",
      header: "Assigned By",
      render: (h) => {
        const t = teachers.find((tt) => tt.id === h.teacherId);
        return t ? `${t.firstName} ${t.lastName}` : "—";
      },
    },
    { key: "due", header: "Due Date", render: (h) => h.dueAt },
    {
      key: "submissions",
      header: "Submissions",
      render: (h) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${(h.submissions / Math.max(1, h.totalStudents)) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-500">
            {h.submissions}/{h.totalStudents}
          </span>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (h) => <StatusBadge status={h.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Homework"
        description={`${homework.length} assignments issued this term`}
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Homework" }]}
        action={
          <Button>
            <Plus className="h-4 w-4" /> New Assignment
          </Button>
        }
      />

      <Card className="p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
          <SearchInput placeholder="Search assignments..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1" />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-44">
            <option value="all">All statuses</option>
            <option value="Open">Open</option>
            <option value="Due Soon">Due Soon</option>
            <option value="Closed">Closed</option>
          </Select>
        </div>
        <Table columns={columns} rows={pageItems} emptyTitle="No assignments match your filters" />
        <Pagination page={page} pageCount={pageCount} total={total} pageSize={pageSize} onPageChange={setPage} />
      </Card>
    </div>
  );
}
