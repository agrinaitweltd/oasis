"use client";

import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Activity,
  Server,
  HardDrive,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { StatCard } from "@/components/portal/ui/StatCard";
import { TrendAreaChart } from "@/components/portal/charts/Charts";
import { schoolRequests } from "@/lib/mock/school-requests";
import { platformEvents, revenueTrend, totalMrrUgx, globalSettings } from "@/lib/mock/platform";

function ugx(n: number) {
  return "UGX " + n.toLocaleString("en-UG");
}

export default function DashboardPage() {
  const approved = schoolRequests.filter((r) => r.status === "approved");
  const active = approved.filter((r) => r.subscriptionStatus === "active");
  const trial = approved.filter((r) => r.subscriptionStatus === "trial");
  const expiring = approved.filter((r) => r.subscriptionStatus === "expiring");
  const newThisMonth = schoolRequests.filter((r) => r.createdAt >= "2026-07-01").length;

  const totalStorageUsed = approved.reduce((s, r) => s + r.storageUsedMb, 0);
  const totalStorageLimit = approved.reduce((s, r) => s + r.storageLimitMb, 0) || 1;
  const storagePct = Math.round((totalStorageUsed / totalStorageLimit) * 100);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Platform health and business overview."
        action={
          <Link
            href="/portal/schools"
            className="inline-flex items-center gap-1.5 rounded-xl bg-oasis-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-oasis-600"
          >
            Manage schools <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total Schools" value={String(schoolRequests.length)} icon={Building2} accent="oasis" />
        <StatCard label="Active Schools" value={String(active.length)} icon={CheckCircle2} accent="emerald" />
        <StatCard label="Trial Schools" value={String(trial.length)} icon={Sparkles} accent="sky" />
        <StatCard label="Expiring Subscriptions" value={String(expiring.length)} icon={AlertTriangle} accent="amber" />
        <StatCard label="Platform Uptime" value="99.6%" icon={Server} accent="emerald" trend={0} trendLabel="last 30 days" />
        <StatCard label="API Status" value="Operational" icon={Activity} accent="emerald" />
        <StatCard label="Storage Usage" value={`${storagePct}%`} icon={HardDrive} accent="sky" trendLabel={`${(totalStorageUsed / 1024).toFixed(1)} GB of ${(totalStorageLimit / 1024).toFixed(1)} GB`} />
        <StatCard label="New Schools This Month" value={String(newThisMonth)} icon={Building2} accent="oasis" />
      </div>

      <div className="mt-5">
        <Card>
          <CardHeader title="Monthly recurring revenue" subtitle={`Currently ${ugx(totalMrrUgx())} / month`} />
          <TrendAreaChart data={revenueTrend.map((p) => ({ label: p.label, value: p.revenueUgx }))} />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Recent platform events" subtitle="School lifecycle, billing and system activity" />
          <ul className="divide-y divide-slate-50">
            {platformEvents.slice(0, 8).map((item) => (
              <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-oasis-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-700">{item.message}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {item.actor} &middot; {item.timestamp}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Platform version" subtitle="Global configuration" />
          <dl className="space-y-3 text-sm">
            <Row label="Version" value={globalSettings.platformVersion} />
            <Row label="Maintenance mode" value={globalSettings.maintenanceMode ? "On" : "Off"} />
            <Row label="Default currency" value={globalSettings.defaultCurrency} />
            <Row label="Default timezone" value={globalSettings.defaultTimezone} />
          </dl>
          <Link href="/portal/platform" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-oasis-600 hover:text-oasis-700">
            Manage platform settings <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
