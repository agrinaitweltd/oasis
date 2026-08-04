"use client";

import { useMemo, useState } from "react";
import { MessageSquare, Plus } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { SearchInput } from "@/components/portal/ui/Input";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Pagination } from "@/components/portal/ui/Pagination";
import { Avatar } from "@/components/portal/ui/Avatar";
import { Button } from "@/components/portal/ui/Button";
import { Modal } from "@/components/portal/ui/Modal";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { parents, getStudentById } from "@/lib/mock/students";
import type { Parent } from "@/types/portal";
import { useToast } from "@/hooks/useToast";

function formatUgx(n: number) {
  return "UGX " + n.toLocaleString("en-UG");
}

export default function ParentsPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Parent | null>(null);
  const debouncedQuery = useDebounce(query);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return parents;
    return parents.filter((p) => `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(q));
  }, [debouncedQuery]);

  const { page, pageCount, pageItems, total, pageSize, setPage } = usePagination(filtered, 8);

  const columns: Column<Parent>[] = [
    {
      key: "name",
      header: "Parent",
      render: (p) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${p.firstName} ${p.lastName}`} />
          <div>
            <p className="font-medium text-slate-800">
              {p.firstName} {p.lastName}
            </p>
            <p className="text-xs text-slate-400">{p.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Contact", render: (p) => p.phone },
    {
      key: "children",
      header: "Children",
      render: (p) => p.studentIds.map((id) => getStudentById(id)?.firstName).filter(Boolean).join(", ") || "—",
    },
    {
      key: "balance",
      header: "Fee Balance",
      render: (p) => (
        <span className={p.feeBalance > 0 ? "font-medium text-amber-600" : "font-medium text-emerald-600"}>
          {formatUgx(p.feeBalance)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            toast("success", "Message sent", `A message was queued for ${p.firstName} ${p.lastName}.`);
          }}
        >
          <MessageSquare className="h-3.5 w-3.5" /> Message
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Parents"
        description={`${parents.length} parent accounts linked to student records`}
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Parents" }]}
        action={
          <Button>
            <Plus className="h-4 w-4" /> Add Parent
          </Button>
        }
      />

      <Card className="p-0">
        <div className="border-b border-slate-100 p-4">
          <SearchInput placeholder="Search parents by name or email..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
        </div>
        <Table columns={columns} rows={pageItems} onRowClick={setSelected} emptyTitle="No parents match your search" />
        <Pagination page={page} pageCount={pageCount} total={total} pageSize={pageSize} onPageChange={setPage} />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.firstName} ${selected.lastName}` : ""} description="Parent details">
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Avatar name={`${selected.firstName} ${selected.lastName}`} size={48} />
              <div>
                <p className="font-semibold text-slate-800">{selected.email}</p>
                <p className="text-slate-500">{selected.phone}</p>
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Children</p>
              <ul className="space-y-1">
                {selected.studentIds.map((id) => {
                  const s = getStudentById(id);
                  return s ? (
                    <li key={id} className="text-slate-700">
                      {s.firstName} {s.lastName} &middot; {s.className} {s.stream}
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
            <div className="rounded-xl bg-slate-50 p-3.5">
              <p className="text-xs text-slate-400">Fee Balance</p>
              <p className="font-semibold text-slate-800">{formatUgx(selected.feeBalance)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
