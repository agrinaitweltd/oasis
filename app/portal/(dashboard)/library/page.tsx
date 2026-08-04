"use client";

import { useMemo, useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { SearchInput } from "@/components/portal/ui/Input";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { useDebounce } from "@/hooks/useDebounce";
import { libraryBooks, libraryLoans } from "@/lib/mock/facilities";
import { getStudentById } from "@/lib/mock/students";
import type { LibraryBook, LibraryLoan } from "@/types/portal";
import { cn } from "@/lib/utils/cn";

export default function LibraryPage() {
  const [tab, setTab] = useState<"catalogue" | "loans">("catalogue");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);

  const filteredBooks = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return libraryBooks;
    return libraryBooks.filter((b) => `${b.title} ${b.author} ${b.category}`.toLowerCase().includes(q));
  }, [debouncedQuery]);

  const bookColumns: Column<LibraryBook>[] = [
    {
      key: "title",
      header: "Title",
      render: (b) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-oasis-50 text-oasis-600">
            <BookOpen className="h-4 w-4" />
          </span>
          <div>
            <p className="font-medium text-slate-800">{b.title}</p>
            <p className="text-xs text-slate-400">{b.author}</p>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category", render: (b) => <Badge tone="info">{b.category}</Badge> },
    { key: "isbn", header: "ISBN", render: (b) => b.isbn },
    {
      key: "availability",
      header: "Availability",
      render: (b) => (
        <span className={b.copiesAvailable === 0 ? "font-medium text-rose-500" : "font-medium text-emerald-600"}>
          {b.copiesAvailable}/{b.copiesTotal} available
        </span>
      ),
    },
  ];

  const loanColumns: Column<LibraryLoan>[] = [
    { key: "book", header: "Book", render: (l) => libraryBooks.find((b) => b.id === l.bookId)?.title ?? "—" },
    {
      key: "student",
      header: "Borrower",
      render: (l) => {
        const s = getStudentById(l.studentId);
        return s ? `${s.firstName} ${s.lastName}` : "—";
      },
    },
    { key: "borrowed", header: "Borrowed", render: (l) => l.borrowedAt },
    { key: "due", header: "Due", render: (l) => l.dueAt },
    { key: "status", header: "Status", render: (l) => <Badge tone={l.returnedAt ? "success" : "warning"}>{l.returnedAt ? "Returned" : "On Loan"}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Library"
        description={`${libraryBooks.length} titles in the catalogue`}
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Library" }]}
        action={
          <Button>
            <Plus className="h-4 w-4" /> Add Book
          </Button>
        }
      />

      <div className="mb-5 flex gap-1 rounded-2xl border border-slate-200/70 bg-white p-1.5">
        {(["catalogue", "loans"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-[13px] font-medium capitalize transition sm:flex-none sm:px-6",
              tab === t ? "bg-oasis-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <Card className="p-0">
        {tab === "catalogue" ? (
          <>
            <div className="border-b border-slate-100 p-4">
              <SearchInput placeholder="Search by title, author or category..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
            </div>
            <Table columns={bookColumns} rows={filteredBooks} emptyTitle="No books match your search" />
          </>
        ) : (
          <Table columns={loanColumns} rows={libraryLoans} emptyTitle="No active loans" />
        )}
      </Card>
    </div>
  );
}
