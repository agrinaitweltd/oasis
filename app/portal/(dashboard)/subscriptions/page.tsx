"use client";

import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Button } from "@/components/portal/ui/Button";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { subscriptionPlans } from "@/lib/platform-store";
import { useCollection } from "@/lib/store";
import type { SchoolRequest } from "@/types/portal";
import { useToast } from "@/hooks/useToast";

function ugx(n: number) {
  return "UGX " + n.toLocaleString("en-UG");
}

export default function SubscriptionsPage() {
  const { toast } = useToast();
  const [schools] = useCollection<SchoolRequest>("oasis_school_registry");
  const trialSchools = schools.filter((r) => r.subscriptionStatus === "trial");

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        description="Plans, trials and billing status across all schools. Real numbers only - grows as schools are approved."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Subscriptions" }]}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {subscriptionPlans.map((plan, i) => {
          const schoolsOnPlan = schools.filter((s) => s.plan === plan.key).length;
          return (
            <Card key={plan.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` } as React.CSSProperties}>
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
              <div className="mt-5 border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">{schoolsOnPlan} school{schoolsOnPlan !== 1 ? "s" : ""} on this plan</span>
              </div>
            </Card>
          );
        })}

        <Card className="border-dashed">
          <CardHeader title="Free trials" subtitle={`${trialSchools.length} school${trialSchools.length !== 1 ? "s" : ""} currently on trial`} />
          {trialSchools.length === 0 ? (
            <EmptyState title="No schools on trial" description="Approved schools start on a trial by default." />
          ) : (
            <div className="space-y-2">
              {trialSchools.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <span className="font-medium text-slate-700">{s.schoolName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast("info", "Upgrade requires billing integration", "No payment gateway is connected yet.")}
                  >
                    Upgrade
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-5 border-dashed bg-slate-50/60">
        <p className="text-xs text-slate-400">
          Invoices, payments and failed-payment tracking will appear here once a payment gateway is connected under
          Integrations. No transactions have occurred yet.
        </p>
      </Card>
    </div>
  );
}
