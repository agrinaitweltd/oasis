"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Contact, Plus, UsersRound, BookMarked } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { SearchInput } from "@/components/portal/ui/Input";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Pagination } from "@/components/portal/ui/Pagination";
import { Avatar } from "@/components/portal/ui/Avatar";
import { StatusBadge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { teachers, leaveRequests } from "@/lib/mock/teachers";
import { classes } from "@/lib/mock/classes";
import type { Teacher } from "@/types/portal";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { key: "directory", label: "Directory", icon: Contact },
  { key: "subjects", label: "Subjects", icon: BookMarked },
  { key: "classes", label: "Classes", icon: UsersRound },
  { key: "leave", label: "Leave", icon: CalendarClock },
] as const;

export default function TeachersPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("directory");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((t) => `${t.firstName} ${t.lastName} ${t.staffNo}`.toLowerCase().includes(q));
  }, [debouncedQuery]);

  const { page, pageCount, pageItems, total, pageSize, setPage } = usePagination(filtered, 8);

  const columns: Column<Teacher>[] = [
    {
      key: "name",
      header: "Teacher",
      render: (t) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${t.firstName} ${t.lastName}`} />
          <div>
            <p className="font-medium text-slate-800">
              {t.firstName} {t.lastName}
            </p>
            <p className="text-xs text-slate-400">{t.staffNo}</p>
          </div>
        </div>
      ),
    },
    { key: "subjects", header: "Subjects", render: (t) => t.subjects.join(", ") },
    { key: "email", header: "Email", render: (t) => t.email },
    { key: "joined", header: "Joined", render: (t) => t.joinedAt },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
  ];

  const subjectMap = new Map<string, number>();
  teachers.forEach((t) => t.subjects.forEach((s) => subjectMap.set(s, (subjectMap.get(s) ?? 0) + 1)));

  return (
    <div>
      <PageHeader
        title="Teachers"
        description={`${teachers.length} teaching staff across ${subjectMap.size} subjects`}
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Teachers" }]}
        action={
          <Button>
            <Plus className="h-4 w-4" /> Add Teacher
          </Button>
        }
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

      {tab === "directory" && (
        <Card className="p-0">
          <div className="border-b border-slate-100 p-4">
            <SearchInput placeholder="Search teachers by name or staff number..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
          </div>
          <Table columns={columns} rows={pageItems} emptyTitle="No teachers match your search" />
          <Pagination page={page} pageCount={pageCount} total={total} pageSize={pageSize} onPageChange={setPage} />
        </Card>
      )}

      {tab === "subjects" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...subjectMap.entries()].map(([subject, count]) => (
            <Card key={subject}>
              <p className="text-sm font-semibold text-slate-800">{subject}</p>
              <p className="mt-1 text-xs text-slate-400">{count} teacher{count !== 1 ? "s" : ""} assigned</p>
            </Card>
          ))}
        </div>
      )}

      {tab === "classes" && (
        <Card className="p-0">
          <Table
            columns={[
              { key: "class", header: "Class", render: (c: (typeof classes)[number]) => `${c.name} ${c.stream}` },
              {
                key: "teacher",
                header: "Class Teacher",
                render: (c: (typeof classes)[number]) => {
                  const t = teachers.find((tt) => tt.id === c.teacherId);
                  return t ? `${t.firstName} ${t.lastName}` : "—";
                },
              },
              { key: "room", header: "Room", render: (c: (typeof classes)[number]) => c.room },
              { key: "size", header: "Class Size", render: (c: (typeof classes)[number]) => `${c.studentCount}/${c.capacity}` },
            ]}
            rows={classes.map((c) => ({ ...c }))}
          />
        </Card>
      )}

      {tab === "leave" && (
        <Card className="p-0">
          {leaveRequests.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No leave requests" />
            </div>
          ) : (
            <Table
              columns={[
                {
                  key: "teacher",
                  header: "Teacher",
                  render: (l: (typeof leaveRequests)[number]) => {
                    const t = teachers.find((tt) => tt.id === l.teacherId);
                    return t ? `${t.firstName} ${t.lastName}` : "—";
                  },
                },
                { key: "type", header: "Type", render: (l: (typeof leaveRequests)[number]) => l.type },
                { key: "dates", header: "Dates", render: (l: (typeof leaveRequests)[number]) => `${l.startDate} → ${l.endDate}` },
                { key: "status", header: "Status", render: (l: (typeof leaveRequests)[number]) => <StatusBadge status={l.status} /> },
              ]}
              rows={leaveRequests}
            />
          )}
        </Card>
      )}
    </div>
  );
}
