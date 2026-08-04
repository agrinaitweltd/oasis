"use client";

import { useState } from "react";
import { Megaphone, Plus, Rocket, ToggleLeft } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { Select } from "@/components/portal/ui/Input";
import { featureFlags as initialFlags, platformAnnouncements, globalSettings, deployments } from "@/lib/mock/platform";
import type { FeatureFlag } from "@/types/portal";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils/cn";

const TABS = ["Overview", "Feature Flags", "Announcements", "Global Settings"] as const;

export default function PlatformPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [maintenance, setMaintenance] = useState(globalSettings.maintenanceMode);
  const [flags, setFlags] = useState<FeatureFlag[]>(initialFlags);

  function toggleFlag(id: string) {
    setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
    const flag = flags.find((f) => f.id === id);
    toast("info", "Feature flag updated", `${flag?.label} is now ${flag?.enabled ? "disabled" : "enabled"}.`);
  }

  return (
    <div>
      <PageHeader
        title="Platform"
        description="System-wide configuration: maintenance, announcements, versioning and feature rollout."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Platform" }]}
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

      {tab === "Overview" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader title="Maintenance mode" subtitle="Temporarily block access for all schools during upgrades" />
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">{maintenance ? "Maintenance mode is ON" : "Platform is live"}</p>
                <p className="text-xs text-slate-500">{maintenance ? "All schools currently see a maintenance page." : "All schools have normal access."}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMaintenance((v) => !v);
                  toast(maintenance ? "success" : "info", maintenance ? "Maintenance mode disabled" : "Maintenance mode enabled", "");
                }}
                className={cn("relative h-7 w-12 flex-shrink-0 rounded-full transition", maintenance ? "bg-amber-500" : "bg-slate-300")}
              >
                <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform", maintenance ? "translate-x-6" : "translate-x-1")} />
              </button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Version control" subtitle="Recent deployments" />
            <ul className="space-y-2">
              {deployments.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700">{d.version}</span>
                    <span className="text-xs text-slate-400">{d.environment}</span>
                  </div>
                  <Badge tone={d.status === "success" ? "success" : d.status === "failed" ? "danger" : "warning"}>{d.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "Feature Flags" && (
        <Card className="p-0">
          <div className="divide-y divide-slate-50">
            {flags.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{f.label}</p>
                  <p className="text-xs text-slate-500">{f.description}</p>
                  <p className="mt-1 text-[11px] text-slate-400">Rollout: {f.rolloutPercent}%</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFlag(f.id)}
                  className={cn("relative h-6 w-11 flex-shrink-0 rounded-full transition", f.enabled ? "bg-oasis-500" : "bg-slate-300")}
                >
                  <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform", f.enabled ? "translate-x-6" : "translate-x-1")} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Announcements" && (
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <p className="text-sm text-slate-500">Platform-wide messages shown to schools.</p>
            <Button size="sm" onClick={() => toast("info", "Compose announcement", "Announcement composer would open here.")}>
              <Plus className="h-3.5 w-3.5" /> New announcement
            </Button>
          </div>
          <div className="divide-y divide-slate-50">
            {platformAnnouncements.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-4 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-oasis-50 text-oasis-600">
                    <Megaphone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.body}</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {a.audience} &middot; {a.publishedAt}
                    </p>
                  </div>
                </div>
                <Badge tone={a.status === "published" ? "success" : a.status === "scheduled" ? "warning" : "neutral"}>{a.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Global Settings" && (
        <Card>
          <CardHeader title="Global academic & platform defaults" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Default Academic Year Start">
              <Select defaultValue={globalSettings.defaultAcademicYearStart}>
                <option>January</option>
                <option>February</option>
                <option>September</option>
              </Select>
            </Field>
            <Field label="Default Terms per Year">
              <Select defaultValue={String(globalSettings.defaultTermsPerYear)}>
                <option value="2">2</option>
                <option value="3">3</option>
              </Select>
            </Field>
            <Field label="Default Currency">
              <Select defaultValue={globalSettings.defaultCurrency}>
                <option>UGX</option>
                <option>KES</option>
                <option>USD</option>
              </Select>
            </Field>
            <Field label="Default Timezone">
              <Select defaultValue={globalSettings.defaultTimezone}>
                <option>Africa/Kampala</option>
                <option>Africa/Nairobi</option>
              </Select>
            </Field>
          </div>
          <Button className="mt-5" onClick={() => toast("success", "Settings saved", "Global defaults updated.")}>
            <ToggleLeft className="h-4 w-4" /> Save changes
          </Button>
        </Card>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  );
}
