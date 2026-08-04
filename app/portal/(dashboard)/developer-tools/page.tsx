"use client";

import { useState } from "react";
import { AlertTriangle, Database, Gauge, ListTree, Rocket, Trash2, Webhook } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { apiKeys, getSchoolRequestById } from "@/lib/mock/school-requests";
import { errorLogs, deployments, queues } from "@/lib/mock/platform";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils/cn";

const TABS = ["API Keys", "Queues", "Error Logs", "Deployments", "Maintenance"] as const;

export default function DeveloperToolsPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("API Keys");

  return (
    <div>
      <PageHeader
        title="Developer Tools"
        description="Feature flags, API keys, webhooks, queues, error logs, performance and deployments."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Developer Tools" }]}
      />

      <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white p-1.5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-shrink-0 rounded-xl px-4 py-2 text-[13px] font-medium transition",
              tab === t ? "bg-oasis-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "API Keys" && (
        <Card className="p-0">
          <CardHeader title={`All issued API keys (${apiKeys.length})`} subtitle="Across every school" className="p-5 pb-0" />
          <div className="divide-y divide-slate-50">
            {apiKeys.map((k) => (
              <div key={k.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{getSchoolRequestById(k.schoolRequestId)?.schoolName}</p>
                  <p className="mt-0.5 font-mono text-xs text-slate-400">{k.keyPreview}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {k.label} &middot; Created {k.createdAt}
                  </p>
                </div>
                <Badge tone={k.status === "active" ? "success" : "neutral"}>{k.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Queues" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {queues.map((q) => (
            <Card key={q.id}>
              <div className="mb-2 flex items-center gap-2">
                <ListTree className="h-4 w-4 text-oasis-500" />
                <p className="text-sm font-semibold text-slate-800">{q.name}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-slate-50 py-3">
                  <p className="text-lg font-bold text-slate-800">{q.pending}</p>
                  <p className="text-[11px] text-slate-400">Pending</p>
                </div>
                <div className="rounded-xl bg-sky-50 py-3">
                  <p className="text-lg font-bold text-sky-700">{q.processing}</p>
                  <p className="text-[11px] text-sky-500">Processing</p>
                </div>
                <div className="rounded-xl bg-rose-50 py-3">
                  <p className="text-lg font-bold text-rose-700">{q.failed}</p>
                  <p className="text-[11px] text-rose-500">Failed</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "Error Logs" && (
        <Card className="p-0">
          <div className="divide-y divide-slate-50">
            {errorLogs.map((e) => (
              <div key={e.id} className="flex items-start justify-between gap-4 p-4">
                <div className="flex items-start gap-3">
                  <span className={cn("mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg", e.level === "error" ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-600")}>
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{e.message}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {e.service} &middot; {e.occurredAt}
                    </p>
                  </div>
                </div>
                <Badge tone={e.level === "error" ? "danger" : "warning"}>{e.count}x</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Deployments" && (
        <Card className="p-0">
          <div className="divide-y divide-slate-50">
            {deployments.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Rocket className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {d.version} <span className="text-xs font-normal text-slate-400">({d.environment})</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      {d.deployedBy} &middot; {d.deployedAt}
                    </p>
                  </div>
                </div>
                <Badge tone={d.status === "success" ? "success" : d.status === "failed" ? "danger" : "warning"}>{d.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Maintenance" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <Webhook className="mb-3 h-6 w-6 text-oasis-500" />
            <p className="text-sm font-semibold text-slate-800">Webhooks</p>
            <p className="mb-3 text-xs text-slate-500">Manage outbound webhook endpoints.</p>
            <Button variant="secondary" size="sm" onClick={() => toast("info", "Webhooks", "Webhook management would open here.")}>
              Manage
            </Button>
          </Card>
          <Card>
            <Gauge className="mb-3 h-6 w-6 text-oasis-500" />
            <p className="text-sm font-semibold text-slate-800">Performance Monitoring</p>
            <p className="mb-3 text-xs text-slate-500">P50 response time: 142ms &middot; P99: 890ms</p>
            <Button variant="secondary" size="sm" onClick={() => toast("info", "Performance", "Detailed dashboard would open here.")}>
              View details
            </Button>
          </Card>
          <Card>
            <Database className="mb-3 h-6 w-6 text-oasis-500" />
            <p className="text-sm font-semibold text-slate-800">Database Migrations</p>
            <p className="mb-3 text-xs text-slate-500">18 migrations applied &middot; up to date</p>
            <Button variant="secondary" size="sm" onClick={() => toast("info", "Migrations", "Migration history would open here.")}>
              View history
            </Button>
          </Card>
          <Card>
            <Trash2 className="mb-3 h-6 w-6 text-oasis-500" />
            <p className="text-sm font-semibold text-slate-800">Cache Management</p>
            <p className="mb-3 text-xs text-slate-500">Clear the platform-wide response cache.</p>
            <Button variant="danger" size="sm" onClick={() => toast("success", "Cache cleared", "")}>
              Clear cache
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
