"use client";

import { ReceiptText, TrendingUp, Wallet } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { StatCard } from "@/components/portal/ui/StatCard";
import { EmptyState } from "@/components/portal/ui/EmptyState";

export default function PlatformFinancePage() {
  return (
    <div>
      <PageHeader
        title="Finance"
        description="Platform-level revenue, refunds and taxes. This is not any individual school's fee data."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Finance" }]}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Revenue (MRR)" value="UGX 0" icon={Wallet} accent="emerald" />
        <StatCard label="Monthly Income" value="UGX 0" icon={TrendingUp} accent="oasis" />
        <StatCard label="Refunds" value="UGX 0" icon={ReceiptText} accent="amber" />
        <StatCard label="Taxes" value="UGX 0" icon={ReceiptText} accent="sky" />
      </div>

      <Card>
        <EmptyState
          icon={Wallet}
          title="No financial activity yet"
          description="Revenue will appear here once a payment gateway is connected and schools have active, paid subscriptions."
        />
      </Card>
    </div>
  );
}
