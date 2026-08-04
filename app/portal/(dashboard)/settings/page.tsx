"use client";

import { useState } from "react";
import { Building2, CalendarRange, Layers, Save, Shield, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Input, Select } from "@/components/portal/ui/Input";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { portalUsers, roles } from "@/lib/mock/users";
import { classes } from "@/lib/mock/classes";
import type { PortalUser, Role } from "@/types/portal";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { key: "school", label: "School Information", icon: Building2 },
  { key: "academic", label: "Academic Year & Terms", icon: CalendarRange },
  { key: "classes", label: "Classes & Subjects", icon: Layers },
  { key: "users", label: "Users", icon: UsersRound },
  { key: "roles", label: "Roles & Permissions", icon: Shield },
] as const;

export default function SettingsPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("school");

  const userColumns: Column<PortalUser>[] = [
    { key: "name", header: "Name", render: (u) => <span className="font-medium text-slate-800">{u.name}</span> },
    { key: "email", header: "Email", render: (u) => u.email },
    { key: "role", header: "Role", render: (u) => <Badge tone="info">{u.role}</Badge> },
    { key: "status", header: "Status", render: (u) => <Badge tone={u.status === "Active" ? "success" : "danger"}>{u.status}</Badge> },
  ];

  const roleColumns: Column<Role>[] = [
    { key: "name", header: "Role", render: (r) => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: "users", header: "Users", render: (r) => r.usersCount },
    {
      key: "permissions",
      header: "Key Permissions",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.permissions.slice(0, 2).map((p) => (
            <Badge key={p} tone="neutral">
              {p}
            </Badge>
          ))}
          {r.permissions.length > 2 && <Badge tone="neutral">+{r.permissions.length - 2} more</Badge>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Settings" description="Configure your school's profile, academic structure and access" breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Settings" }]} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
        <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white p-1.5 lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex flex-shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-medium transition",
                tab === t.key ? "bg-oasis-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <t.icon className="h-4 w-4 flex-shrink-0" /> <span className="whitespace-nowrap">{t.label}</span>
            </button>
          ))}
        </div>

        <div>
          {tab === "school" && (
            <Card>
              <CardHeader title="School information" subtitle="Basic details shown across the platform" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="School Name" defaultValue="OASIS Demo School" />
                <Field label="School Email" defaultValue="info@oasis-demo.co.ug" />
                <Field label="Phone Number" defaultValue="+256 700 000 000" />
                <Field label="District" defaultValue="Kampala" />
                <Field label="Address" defaultValue="Plot 12, Kampala Road" className="sm:col-span-2" />
              </div>
              <Button className="mt-5" onClick={() => toast("success", "Settings saved", "School information has been updated.")}>
                <Save className="h-4 w-4" /> Save changes
              </Button>
            </Card>
          )}

          {tab === "academic" && (
            <Card>
              <CardHeader title="Academic year & terms" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Current Academic Year" defaultValue="2026" />
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Current Term</label>
                  <Select defaultValue="Term 2">
                    <option>Term 1</option>
                    <option>Term 2</option>
                    <option>Term 3</option>
                  </Select>
                </div>
                <Field label="Term Ends" defaultValue="2026-08-28" type="date" />
              </div>
              <Button className="mt-5" onClick={() => toast("success", "Settings saved", "Academic calendar has been updated.")}>
                <Save className="h-4 w-4" /> Save changes
              </Button>
            </Card>
          )}

          {tab === "classes" && (
            <Card className="p-0">
              <Table
                columns={[
                  { key: "name", header: "Class", render: (c: (typeof classes)[number]) => `${c.name} ${c.stream}` },
                  { key: "room", header: "Room", render: (c: (typeof classes)[number]) => c.room },
                  { key: "size", header: "Capacity", render: (c: (typeof classes)[number]) => `${c.studentCount}/${c.capacity}` },
                ]}
                rows={classes}
              />
            </Card>
          )}

          {tab === "users" && (
            <Card className="p-0">
              <Table columns={userColumns} rows={portalUsers} emptyTitle="No users found" />
            </Card>
          )}

          {tab === "roles" && (
            <Card className="p-0">
              <Table columns={roleColumns} rows={roles} emptyTitle="No roles configured" />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, className, ...rest }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">{label}</label>
      <Input {...rest} />
    </div>
  );
}
