"use client";

import { AlertTriangle, ReceiptText, TrendingUp, Wallet } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { StatCard } from "@/components/portal/ui/StatCard";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Badge } from "@/components/portal/ui/Badge";
import { TrendAreaChart } from "@/components/portal/charts/Charts";
import { invoices, revenueTrend, totalMrrUgx, outstandingInvoices } from "@/lib/mock/platform";
import { getSchoolRequestById } from "@/lib/mock/school-requests";
import type { Invoice } from "@/types/portal";

function ugx(n: number) {
  return "UGX " + n.toLocaleString("en-UG");
}

export default function PlatformFinancePage() {
  const monthlyIncome = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amountUgx, 0);
  const refunds = Math.round(monthlyIncome * 0.015);
  const taxes = Math.round(monthlyIncome * 0.18);

  const columns: Column<Invoice>[] = [
    { key: "no", header: "Invoice", render: (i) => i.invoiceNo },
    { key: "school", header: "School", render: (i) => getSchoolRequestById(i.schoolId)?.schoolName ?? "—" },
    { key: "amount", header: "Amount", render: (i) => ugx(i.amountUgx) },
    { key: "due", header: "Due", render: (i) => i.dueAt },
    { key: "status", header: "Status", render: (i) => <Badge tone={i.status === "overdue" ? "danger" : "warning"}>{i.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Finance"
        description="Platform-level revenue, refunds and taxes. This is not any individual school's fee data."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Finance" }]}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Revenue (MRR)" value={ugx(totalMrrUgx())} icon={Wallet} accent="emerald" trend={11} />
        <StatCard label="Monthly Income" value={ugx(monthlyIncome)} icon={TrendingUp} accent="oasis" />
        <StatCard label="Refunds" value={ugx(refunds)} icon={ReceiptText} accent="amber" />
        <StatCard label="Taxes" value={ugx(taxes)} icon={ReceiptText} accent="sky" />
      </div>

      <Card className="mb-5">
        <CardHeader title="Revenue trend" subtitle="Last 8 weeks, platform-wide" />
        <TrendAreaChart data={revenueTrend.map((p) => ({ label: p.label, value: p.revenueUgx }))} />
      </Card>

      <Card className="p-0">
        <div className="flex items-center gap-2 border-b border-slate-100 p-4">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <p className="text-sm font-semibold text-slate-700">Outstanding invoices ({outstandingInvoices().length})</p>
        </div>
        <Table columns={columns} rows={outstandingInvoices()} emptyTitle="No outstanding invoices" />
      </Card>
    </div>
  );
}
