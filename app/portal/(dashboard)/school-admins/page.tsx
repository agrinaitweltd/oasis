"use client";

import { useState } from "react";
import { KeyRound, Mail, Plus, Repeat, UserX } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { Avatar } from "@/components/portal/ui/Avatar";
import { Modal } from "@/components/portal/ui/Modal";
import { Input, Select } from "@/components/portal/ui/Input";
import { schoolAdmins as initialAdmins } from "@/lib/mock/platform";
import { schoolRequests } from "@/lib/mock/school-requests";
import type { SchoolAdminAccount } from "@/types/portal";
import { useToast } from "@/hooks/useToast";

export default function SchoolAdminsPage() {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<SchoolAdminAccount[]>(initialAdmins);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selected, setSelected] = useState<SchoolAdminAccount | null>(null);

  function toggleStatus(id: string) {
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, status: a.status === "active" ? "disabled" : "active" } : a)));
  }

  const columns: Column<SchoolAdminAccount>[] = [
    {
      key: "admin",
      header: "Administrator",
      render: (a) => (
        <div className="flex items-center gap-3">
          <Avatar name={a.name} />
          <div>
            <p className="font-medium text-slate-800">{a.name}</p>
            <p className="text-xs text-slate-400">{a.email}</p>
          </div>
        </div>
      ),
    },
    { key: "school", header: "School", render: (a) => a.schoolName },
    { key: "2fa", header: "2FA", render: (a) => <Badge tone={a.twoFactorEnabled ? "success" : "neutral"}>{a.twoFactorEnabled ? "Enabled" : "Disabled"}</Badge> },
    { key: "lastLogin", header: "Last Login", render: (a) => a.lastLoginAt ?? "Never" },
    { key: "status", header: "Status", render: (a) => <Badge tone={a.status === "active" ? "success" : "danger"}>{a.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="School Administrators"
        description="Manage the administrator accounts for each school - not their internal staff or student users."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "School Administrators" }]}
        action={
          <Button onClick={() => setInviteOpen(true)}>
            <Plus className="h-4 w-4" /> Invite admin
          </Button>
        }
      />

      <Card className="p-0">
        <Table columns={columns} rows={admins} onRowClick={setSelected} emptyTitle="No school administrators" />
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        description={selected?.schoolName}
        maxWidth={440}
      >
        {selected && (
          <div className="space-y-3">
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => toast("success", "Password reset sent", `An email was sent to ${selected.email}.`)}
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
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => toast("info", "Change email", "An email-change link was sent for confirmation.")}
            >
              <Mail className="h-4 w-4" /> Change email
            </Button>
            <Button
              variant={selected.status === "active" ? "danger" : "primary"}
              className="w-full justify-start"
              onClick={() => {
                toggleStatus(selected.id);
                toast("info", selected.status === "active" ? "Admin disabled" : "Admin enabled", "");
                setSelected(null);
              }}
            >
              <UserX className="h-4 w-4" /> {selected.status === "active" ? "Disable admin" : "Enable admin"}
            </Button>
          </div>
        )}
      </Modal>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite school administrator"
        maxWidth={440}
        footer={
          <>
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setInviteOpen(false);
                toast("success", "Invitation sent", "");
              }}
            >
              Send invite
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">School</label>
            <Select defaultValue={schoolRequests[0]?.id}>
              {schoolRequests
                .filter((s) => s.status === "approved")
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.schoolName}
                  </option>
                ))}
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Email address</label>
            <Input type="email" placeholder="admin@school.co.ug" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
