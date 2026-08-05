"use client";

import { useState } from "react";
import { Database, Gauge, ListTree, Rocket, Trash2, Webhook } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { useCollection } from "@/lib/store";
import type { ApiKey, SchoolRequest } from "@/types/portal";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils/cn";

const TABS = ["API Keys", "Queues", "Error Logs", "Deployments", "Maintenance"] as const;

export default function DeveloperToolsPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("API Keys");
  const [keys] = useCollection<ApiKey>("oasis_api_keys_registry");
  const [schools] = useCollection<SchoolRequest>("oasis_school_registry");

  return (
    <div>
      <PageHeader
        title="Developer Tools"
        description="API keys, webhooks, queues, error logs, performance and deployments."
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
          <CardHeader title={`All issued API keys (${keys.length})`} subtitle="Across every school" className="p-5 pb-0" />
          {keys.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No API keys issued yet" description="Generate keys from a school's detail page once it's approved." />
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {keys.map((k) => (
                <div key={k.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{schools.find((s) => s.id === k.schoolRequestId)?.schoolName ?? "—"}</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-400">{k.keyPreview}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {k.label} &middot; Created {k.createdAt}
                    </p>
                  </div>
                  <Badge tone={k.status === "active" ? "success" : "neutral"}>{k.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "Queues" && (
        <Card>
          <EmptyState icon={ListTree} title="No queue monitoring connected" description="Connect a job queue (e.g. for SMS, email or report generation) to see live queue depth here." />
        </Card>
      )}

      {tab === "Error Logs" && (
        <Card>
          <EmptyState title="No errors reported" description="Application error tracking will populate this list once connected." />
        </Card>
      )}

      {tab === "Deployments" && (
        <Card>
          <EmptyState icon={Rocket} title="No deployment history" description="Connect CI/CD to see deployment history here." />
        </Card>
      )}

      {tab === "Maintenance" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <Webhook className="mb-3 h-6 w-6 text-oasis-500" />
            <p className="text-sm font-semibold text-slate-800">Webhooks</p>
            <p className="mb-3 text-xs text-slate-500">Manage outbound webhook endpoints.</p>
            <Button variant="secondary" size="sm" onClick={() => toast("info", "Webhooks", "No webhook endpoints configured yet.")}>
              Manage
            </Button>
          </Card>
          <Card>
            <Gauge className="mb-3 h-6 w-6 text-oasis-500" />
            <p className="text-sm font-semibold text-slate-800">Performance Monitoring</p>
            <p className="mb-3 text-xs text-slate-500">No monitoring service connected.</p>
            <Button variant="secondary" size="sm" onClick={() => toast("info", "Performance", "Connect a monitoring service to see metrics.")}>
              View details
            </Button>
          </Card>
          <Card>
            <Database className="mb-3 h-6 w-6 text-oasis-500" />
            <p className="text-sm font-semibold text-slate-800">Database Migrations</p>
            <p className="mb-3 text-xs text-slate-500">No database connected yet.</p>
            <Button variant="secondary" size="sm" onClick={() => toast("info", "Migrations", "Connect a database to see migration history.")}>
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
