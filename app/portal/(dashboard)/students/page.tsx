"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Plus, UserRound } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { SearchInput, Select } from "@/components/portal/ui/Input";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Pagination } from "@/components/portal/ui/Pagination";
import { StatusBadge } from "@/components/portal/ui/Badge";
import { Avatar } from "@/components/portal/ui/Avatar";
import { Button } from "@/components/portal/ui/Button";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { students } from "@/lib/mock/students";
import { classes } from "@/lib/mock/classes";
import type { Student } from "@/types/portal";

export default function StudentsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedQuery = useDebounce(query);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return students.filter((s) => {
      const matchesQuery = !q || `${s.firstName} ${s.lastName} ${s.admissionNo}`.toLowerCase().includes(q);
      const matchesClass = classFilter === "all" || s.classId === classFilter;
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesQuery && matchesClass && matchesStatus;
    });
  }, [debouncedQuery, classFilter, statusFilter]);

  const { page, pageCount, pageItems, total, pageSize, setPage } = usePagination(filtered, 8);

  const columns: Column<Student>[] = [
    {
      key: "name",
      header: "Student",
      render: (s) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${s.firstName} ${s.lastName}`} />
          <div>
            <p className="font-medium text-slate-800">
              {s.firstName} {s.lastName}
            </p>
            <p className="text-xs text-slate-400">{s.admissionNo}</p>
          </div>
        </div>
      ),
    },
    { key: "class", header: "Class", render: (s) => `${s.className} ${s.stream}` },
    { key: "gender", header: "Gender", render: (s) => s.gender },
    {
      key: "attendance",
      header: "Attendance",
      render: (s) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-oasis-500" style={{ width: `${s.attendanceRate}%` }} />
          </div>
          <span className="text-xs text-slate-500">{s.attendanceRate}%</span>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (s) => <StatusBadge status={s.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Students"
        description={`${students.length} students enrolled across ${classes.length} classes`}
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Students" }]}
        action={
          <div className="flex gap-2">
            <Button variant="secondary">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button>
              <Plus className="h-4 w-4" /> Add Student
            </Button>
          </div>
        }
      />

      <Card className="p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput placeholder="Search by name or admission number..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="sm:w-48">
            <option value="all">All classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.stream}
              </option>
            ))}
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-40">
            <option value="all">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
            <option value="Transferred">Transferred</option>
          </Select>
        </div>

        <Table
          columns={columns}
          rows={pageItems}
          onRowClick={(s) => router.push(`/portal/students/${s.id}`)}
          emptyTitle="No students match your filters"
          emptyDescription="Try adjusting your search or filters."
        />
        <Pagination page={page} pageCount={pageCount} total={total} pageSize={pageSize} onPageChange={setPage} />
      </Card>
    </div>
  );
}
