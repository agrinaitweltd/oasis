"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, FileText, PieChart, Receipt, TrendingDown, Wallet } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { SearchInput } from "@/components/portal/ui/Input";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Pagination } from "@/components/portal/ui/Pagination";
import { StatusBadge } from "@/components/portal/ui/Badge";
import { StatCard } from "@/components/portal/ui/StatCard";
import { Button } from "@/components/portal/ui/Button";
import { TrendAreaChart, DonutChart } from "@/components/portal/charts/Charts";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { invoices, payments, expenses, totalCollected, totalOutstanding, totalExpenses } from "@/lib/mock/finance";
import { getStudentById } from "@/lib/mock/students";
import type { Invoice, Payment, ExpenseRecord } from "@/types/portal";
import { cn } from "@/lib/utils/cn";

function ugx(n: number) {
  return "UGX " + n.toLocaleString("en-UG");
}

const TABS = [
  { key: "invoices", label: "Invoices", icon: Receipt },
  { key: "payments", label: "Payments", icon: Wallet },
  { key: "outstanding", label: "Outstanding", icon: AlertTriangle },
  { key: "expenses", label: "Income & Expenses", icon: TrendingDown },
  { key: "reports", label: "Financial Reports", icon: PieChart },
] as const;

export default function FinancePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("invoices");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);

  const invoiceColumns: Column<Invoice>[] = [
    { key: "no", header: "Invoice", render: (i) => i.invoiceNo },
    {
      key: "student",
      header: "Student",
      render: (i) => {
        const s = getStudentById(i.studentId);
        return s ? `${s.firstName} ${s.lastName}` : "—";
      },
    },
    { key: "amount", header: "Amount", render: (i) => ugx(i.amount) },
    { key: "paid", header: "Paid", render: (i) => ugx(i.amountPaid) },
    { key: "due", header: "Due", render: (i) => i.dueDate },
    { key: "status", header: "Status", render: (i) => <StatusBadge status={i.status} /> },
  ];

  const filteredInvoices = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter((i) => {
      const s = getStudentById(i.studentId);
      return i.invoiceNo.toLowerCase().includes(q) || (s && `${s.firstName} ${s.lastName}`.toLowerCase().includes(q));
    });
  }, [debouncedQuery]);
  const invoicePage = usePagination(filteredInvoices, 8);

  const paymentColumns: Column<Payment>[] = [
    { key: "ref", header: "Reference", render: (p) => p.reference },
    {
      key: "student",
      header: "Student",
      render: (p) => {
        const s = getStudentById(p.studentId);
        return s ? `${s.firstName} ${s.lastName}` : "—";
      },
    },
    { key: "amount", header: "Amount", render: (p) => ugx(p.amount) },
    { key: "method", header: "Method", render: (p) => p.method },
    { key: "date", header: "Date", render: (p) => p.paidAt },
  ];
  const paymentPage = usePagination(payments, 8);

  const overdue = invoices.filter((i) => i.status === "Overdue" || i.status === "Pending");
  const overduePage = usePagination(overdue, 8);

  const expenseColumns: Column<ExpenseRecord>[] = [
    { key: "category", header: "Category", render: (e) => e.category },
    { key: "description", header: "Description", render: (e) => e.description },
    { key: "amount", header: "Amount", render: (e) => ugx(e.amount) },
    { key: "date", header: "Date", render: (e) => e.date },
    { key: "approved", header: "Approved By", render: (e) => e.approvedBy },
  ];

  const trend = Array.from({ length: 8 }, (_, i) => ({ label: `Wk ${i + 1}`, value: Math.round(totalCollected() * ((i + 3) / 40)) }));
  const expenseSplit = expenses.slice(0, 6).map((e) => ({ name: e.category, value: e.amount }));

  return (
    <div>
      <PageHeader
        title="Finance"
        description="Invoices, payments, expenses and financial reporting"
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Finance" }]}
        action={
          <Button>
            <FileText className="h-4 w-4" /> New Invoice
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Collected" value={ugx(totalCollected())} icon={Wallet} accent="emerald" trend={11} />
        <StatCard label="Outstanding" value={ugx(totalOutstanding())} icon={AlertTriangle} accent="amber" trend={-6} />
        <StatCard label="Expenses" value={ugx(totalExpenses())} icon={TrendingDown} accent="oasis" />
        <StatCard label="Overdue Invoices" value={String(overdue.length)} icon={Receipt} accent="sky" />
      </div>

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

      {tab === "invoices" && (
        <Card className="p-0">
          <div className="border-b border-slate-100 p-4">
            <SearchInput placeholder="Search invoices..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
          </div>
          <Table columns={invoiceColumns} rows={invoicePage.pageItems} emptyTitle="No invoices found" />
          <Pagination {...invoicePage} onPageChange={invoicePage.setPage} />
        </Card>
      )}

      {tab === "payments" && (
        <Card className="p-0">
          <Table columns={paymentColumns} rows={paymentPage.pageItems} emptyTitle="No payments recorded" />
          <Pagination {...paymentPage} onPageChange={paymentPage.setPage} />
        </Card>
      )}

      {tab === "outstanding" && (
        <Card className="p-0">
          <Table columns={invoiceColumns} rows={overduePage.pageItems} emptyTitle="No outstanding balances — great job!" />
          <Pagination {...overduePage} onPageChange={overduePage.setPage} />
        </Card>
      )}

      {tab === "expenses" && (
        <Card className="p-0">
          <Table columns={expenseColumns} rows={expenses} emptyTitle="No expenses recorded" />
        </Card>
      )}

      {tab === "reports" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Card>
            <CardHeader title="Collections trend" subtitle="Last 8 weeks" />
            <TrendAreaChart data={trend} />
          </Card>
          <Card>
            <CardHeader title="Expense breakdown" subtitle="By category" />
            <DonutChart data={expenseSplit} />
          </Card>
        </div>
      )}
    </div>
  );
}
