"use client";

import { useState, type FormEvent } from "react";
import { KeyRound, Mail, Plus, Repeat, UserX } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { Avatar } from "@/components/portal/ui/Avatar";
import { Modal } from "@/components/portal/ui/Modal";
import { Input, Select } from "@/components/portal/ui/Input";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { Field } from "@/components/school/Field";
import { useCollection } from "@/lib/store";
import { useRealtimeRows } from "@/lib/supabase/useRealtimeRows";
import type { SchoolRequest } from "@/types/portal";
import type { Tables } from "@/types/database.types";
import { useToast } from "@/hooks/useToast";

const ROLE_OPTIONS = [
  { value: "school_admin", label: "School Admin" },
  { value: "teacher", label: "Teacher" },
  { value: "parent", label: "Parent" },
  { value: "student", label: "Student" },
  { value: "bursar", label: "Bursar" },
  { value: "librarian", label: "Librarian" },
];

export default function SchoolAdminsPage() {
  const { toast } = useToast();
  const [schools] = useCollection<SchoolRequest>("oasis_school_registry");
  const admins = schools.filter((s) => s.status === "approved");
  const [selected, setSelected] = useState<SchoolRequest | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

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
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> Create account
          </Button>
        }
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

      <CreateAccountModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

function CreateAccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const { rows: liveSchools } = useRealtimeRows<Tables<"schools">>("schools", "name");
  const approvedSchools = liveSchools.filter((s) => s.status === "approved");

  const [schoolId, setSchoolId] = useState("");
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function reset() {
    setSchoolId("");
    setRole("");
    setFullName("");
    setEmail("");
    setPassword("");
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!schoolId || !role || !fullName.trim() || !email.trim() || password.length < 8) {
      setError("Fill in every field - password needs at least 8 characters.");
      return;
    }
    setError("");
    setSaving(true);
    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schoolId, role, fullName: fullName.trim(), email: email.trim(), password }),
    });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(body.error ?? "Couldn't create the account.");
      return;
    }
    toast("success", "Account created", `${email.trim()} can now sign in.`);
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Create user account" description="Provisions a working login immediately - no OTP step needed." maxWidth={480}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}

        <Field label="School">
          <Select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} required>
            <option value="">Select a school…</option>
            {approvedSchools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Role">
          <Select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select a role…</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Full name">
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </Field>
        <Field label="Email address">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create account"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
