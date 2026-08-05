"use client";

import { useEffect, useState } from "react";
import { Megaphone, Plus, ToggleLeft } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Button } from "@/components/portal/ui/Button";
import { Select } from "@/components/portal/ui/Input";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { listFeatureFlags, toggleFeatureFlag, getMaintenanceMode, setMaintenanceMode, logEvent } from "@/lib/platform-store";
import type { FeatureFlag } from "@/types/portal";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils/cn";

const TABS = ["Overview", "Feature Flags", "Announcements", "Global Settings"] as const;
const PLATFORM_VERSION = "0.1.0";

export default function PlatformPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [maintenance, setMaintenance] = useState(false);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);

  useEffect(() => {
    setMaintenance(getMaintenanceMode());
    setFlags(listFeatureFlags());
  }, []);

  function toggleMaintenance() {
    const next = !maintenance;
    setMaintenanceMode(next);
    setMaintenance(next);
    logEvent("maintenance", next ? "Maintenance mode enabled" : "Maintenance mode disabled", "admin");
    toast(next ? "info" : "success", next ? "Maintenance mode enabled" : "Maintenance mode disabled", "");
  }

  function toggleFlag(id: string) {
    toggleFeatureFlag(id);
    const updated = listFeatureFlags();
    setFlags(updated);
    const flag = updated.find((f) => f.id === id);
    toast("info", "Feature flag updated", `${flag?.label} is now ${flag?.enabled ? "enabled" : "disabled"}.`);
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
                onClick={toggleMaintenance}
                className={cn("relative h-7 w-12 flex-shrink-0 rounded-full transition-colors duration-300", maintenance ? "bg-amber-500" : "bg-slate-300")}
              >
                <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300", maintenance ? "translate-x-6" : "translate-x-1")} />
              </button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Version" subtitle="Current platform release" />
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <span className="font-medium text-slate-700">OASIS Platform</span>
              <span className="font-mono text-slate-500">v{PLATFORM_VERSION}</span>
            </div>
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
                </div>
                <button
                  type="button"
                  onClick={() => toggleFlag(f.id)}
                  className={cn("relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-300", f.enabled ? "bg-oasis-500" : "bg-slate-300")}
                >
                  <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300", f.enabled ? "translate-x-6" : "translate-x-1")} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Announcements" && (
        <Card>
          <EmptyState
            icon={Megaphone}
            title="No announcements yet"
            description="Platform-wide announcements sent to schools appear here. Use Notifications to compose one."
            action={
              <Button onClick={() => toast("info", "Head to Notifications", "Announcements are composed there.")}>
                <Plus className="h-4 w-4" /> Compose
              </Button>
            }
          />
        </Card>
      )}

      {tab === "Global Settings" && (
        <Card>
          <CardHeader title="Global academic & platform defaults" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Default Academic Year Start">
              <Select defaultValue="February">
                <option>January</option>
                <option>February</option>
                <option>September</option>
              </Select>
            </Field>
            <Field label="Default Terms per Year">
              <Select defaultValue="3">
                <option value="2">2</option>
                <option value="3">3</option>
              </Select>
            </Field>
            <Field label="Default Currency">
              <Select defaultValue="UGX">
                <option>UGX</option>
                <option>KES</option>
                <option>USD</option>
              </Select>
            </Field>
            <Field label="Default Timezone">
              <Select defaultValue="Africa/Kampala">
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
