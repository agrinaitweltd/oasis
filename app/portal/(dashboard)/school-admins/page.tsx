"use client";

import { useState } from "react";
import { KeyRound, Mail, Repeat, UserX } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { Avatar } from "@/components/portal/ui/Avatar";
import { Modal } from "@/components/portal/ui/Modal";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { useCollection } from "@/lib/store";
import type { SchoolRequest } from "@/types/portal";
import { useToast } from "@/hooks/useToast";

export default function SchoolAdminsPage() {
  const { toast } = useToast();
  const [schools] = useCollection<SchoolRequest>("oasis_school_registry");
  const admins = schools.filter((s) => s.status === "approved");
  const [selected, setSelected] = useState<SchoolRequest | null>(null);

  const columns: Column<SchoolRequest>[] = [
    {
      key: "admin",
      header: "Administrator",
      render: (a) => (
        <div className="flex items-center gap-3">
          <Avatar name={a.contactName} />
          <div>
            <p className="font-medium text-slate-800">{a.contactName}</p>
            <p className="text-xs text-slate-400">{a.contactEmail}</p>
          </div>
        </div>
      ),
    },
    { key: "school", header: "School", render: (a) => a.schoolName },
    { key: "role", header: "Role", render: (a) => a.contactRole },
    { key: "lastLogin", header: "Last Login", render: (a) => a.lastLoginAt ?? "Never" },
    { key: "status", header: "Status", render: () => <Badge tone="success">Active</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="School Administrators"
        description="Manage the administrator accounts for each school - not their internal staff or student users."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "School Administrators" }]}
      />

      <Card className="p-0">
        {admins.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No school administrators yet" description="Once a school is approved, its primary contact appears here as its administrator." />
          </div>
        ) : (
          <Table columns={columns} rows={admins} onRowClick={setSelected} emptyTitle="No school administrators" />
        )}
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.contactName ?? ""} description={selected?.schoolName} maxWidth={440}>
        {selected && (
          <div className="space-y-3">
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => toast("success", "Password reset sent", `An email was sent to ${selected.contactEmail}.`)}
            >
              <KeyRound className="h-4 w-4" /> Reset admin password
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => toast("info", "Ownership transfer started", "The new owner will receive a confirmation email.")}
            >
              <Repeat className="h-4 w-4" /> Transfer ownership
            </Button>
            <Button variant="secondary" className="w-full justify-start" onClick={() => toast("info", "Change email", "An email-change link was sent for confirmation.")}>
              <Mail className="h-4 w-4" /> Change email
            </Button>
            <Button variant="danger" className="w-full justify-start" onClick={() => toast("info", "Admin disabled", "")}>
              <UserX className="h-4 w-4" /> Disable admin
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
