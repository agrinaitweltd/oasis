"use client";

import { useState } from "react";
import { CheckCircle2, Plus, Receipt, XCircle } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { subscriptionPlans, invoices, failedPayments } from "@/lib/mock/platform";
import { schoolRequests, getSchoolRequestById } from "@/lib/mock/school-requests";
import type { Invoice } from "@/types/portal";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils/cn";

function ugx(n: number) {
  return "UGX " + n.toLocaleString("en-UG");
}

const INVOICE_TONE: Record<string, "success" | "warning" | "danger"> = {
  paid: "success",
  pending: "warning",
  overdue: "danger",
  failed: "danger",
};

const TABS = ["Plans", "Invoices", "Failed Payments"] as const;

export default function SubscriptionsPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Plans");

  const trialSchools = schoolRequests.filter((r) => r.subscriptionStatus === "trial");

  const invoiceColumns: Column<Invoice>[] = [
    { key: "no", header: "Invoice", render: (i) => i.invoiceNo },
    { key: "school", header: "School", render: (i) => getSchoolRequestById(i.schoolId)?.schoolName ?? "—" },
    { key: "amount", header: "Amount", render: (i) => ugx(i.amountUgx) },
    { key: "issued", header: "Issued", render: (i) => i.issuedAt },
    { key: "due", header: "Due", render: (i) => i.dueAt },
    { key: "status", header: "Status", render: (i) => <Badge tone={INVOICE_TONE[i.status]}>{i.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        description="Manage plans, upgrades, downgrades, trials and billing status across all schools."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Subscriptions" }]}
        action={
          <Button onClick={() => toast("info", "Create plan", "Plan builder would open here.")}>
            <Plus className="h-4 w-4" /> Create plan
          </Button>
        }
      />

      <div className="mb-5 flex gap-1 rounded-2xl border border-slate-200/70 bg-white p-1.5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-xl px-4 py-2 text-[13px] font-medium transition",
              tab === t ? "bg-oasis-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Plans" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader title={plan.name} subtitle={plan.studentRange} />
              <p className="text-2xl font-bold text-slate-900">
                {ugx(plan.priceMonthlyUgx)}
                <span className="text-sm font-normal text-slate-400"> /student/mo</span>
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">{plan.schoolsOnPlan} schools on this plan</span>
                <Button variant="secondary" size="sm" onClick={() => toast("info", "Edit plan", `Editing ${plan.name}.`)}>
                  Edit
                </Button>
              </div>
            </Card>
          ))}

          <Card className="border-dashed">
            <CardHeader title="Free trials" subtitle={`${trialSchools.length} schools currently on trial`} />
            <div className="space-y-2">
              {trialSchools.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <span className="font-medium text-slate-700">{s.schoolName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast("success", "Trial upgraded", `${s.schoolName} moved to an active plan.`)}
                  >
                    Upgrade
                  </Button>
                </div>
              ))}
              {trialSchools.length === 0 && <p className="text-sm text-slate-400">No schools currently on trial.</p>}
            </div>
          </Card>
        </div>
      )}

      {tab === "Invoices" && (
        <Card className="p-0">
          <Table columns={invoiceColumns} rows={invoices} emptyTitle="No invoices yet" />
        </Card>
      )}

      {tab === "Failed Payments" && (
        <Card className="p-0">
          {failedPayments().length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              <p className="text-sm font-medium text-slate-600">No failed payments</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {failedPayments().map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                      <XCircle className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{getSchoolRequestById(inv.schoolId)?.schoolName}</p>
                      <p className="text-xs text-slate-400">
                        {inv.invoiceNo} &middot; {ugx(inv.amountUgx)}
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => toast("info", "Retry queued", "Payment retry has been queued.")}>
                    <Receipt className="h-3.5 w-3.5" /> Retry
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
