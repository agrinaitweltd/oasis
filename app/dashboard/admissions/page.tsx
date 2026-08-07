"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Button } from "@/components/portal/ui/Button";
import { Modal } from "@/components/portal/ui/Modal";
import { Input } from "@/components/portal/ui/Input";
import { Badge } from "@/components/portal/ui/Badge";
import { Field } from "@/components/school/Field";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRealtimeRows } from "@/lib/supabase/useRealtimeRows";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import type { Tables } from "@/types/database.types";

type Application = Tables<"admission_applications">;

const STATUS_TONE: Record<string, "neutral" | "info" | "warning" | "success" | "danger"> = {
  pending: "warning",
  offered: "info",
  accepted: "success",
  rejected: "danger",
};

export default function AdmissionsPage() {
  const { profile, role } = useAuth();
  const { toast } = useToast();
  const { rows, loading } = useRealtimeRows<Application>("admission_applications");
  const canWrite = role === "school_admin" || role === "teacher" || role === "bursar";

  const [open, setOpen] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [dob, setDob] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [applyingForClass, setApplyingForClass] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile?.school_id || !applicantName.trim()) return;
    setSaving(true);
    const { error } = await createClient().from("admission_applications").insert({
      school_id: profile.school_id,
      applicant_name: applicantName.trim(),
      date_of_birth: dob || null,
      guardian_name: guardianName.trim() || null,
      guardian_phone: guardianPhone.trim() || null,
      guardian_email: guardianEmail.trim() || null,
      applying_for_class: applyingForClass.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast("error", "Couldn't add application", error.message);
      return;
    }
    setOpen(false);
    setApplicantName("");
    setDob("");
    setGuardianName("");
    setGuardianPhone("");
    setGuardianEmail("");
    setApplyingForClass("");
    toast("success", "Application added", "");
  }

  async function setStatus(id: string, status: string) {
    const { error } = await createClient().from("admission_applications").update({ status }).eq("id", id);
    if (error) toast("error", "Couldn't update status", error.message);
  }

  const columns: Column<Application>[] = [
    { key: "name", header: "Applicant", render: (r) => <p className="font-medium text-slate-800">{r.applicant_name}</p> },
    { key: "class", header: "Applying for", render: (r) => r.applying_for_class || "—" },
    { key: "guardian", header: "Guardian", render: (r) => r.guardian_name || "—" },
    { key: "contact", header: "Contact", render: (r) => r.guardian_phone || r.guardian_email || "—" },
    { key: "status", header: "Status", render: (r) => <Badge tone={STATUS_TONE[r.status] ?? "neutral"}>{r.status}</Badge> },
    ...(canWrite
      ? [
          {
            key: "actions",
            header: "",
            render: (r: Application) => (
              <select
                value={r.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setStatus(r.id, e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs"
              >
                <option value="pending">Pending</option>
                <option value="offered">Offered</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title="Admissions"
        description="Online applications, offer management and enrolment."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Admissions" }]}
        action={
          canWrite && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Add application
            </Button>
          )
        }
      />

      <Card className="p-0">
        <Table columns={columns} rows={rows} loading={loading} emptyTitle="No applications yet" />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add admission application" maxWidth={480}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Applicant name">
            <Input value={applicantName} onChange={(e) => setApplicantName(e.target.value)} required />
          </Field>
          <Field label="Date of birth">
            <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </Field>
          <Field label="Applying for class">
            <Input value={applyingForClass} onChange={(e) => setApplyingForClass(e.target.value)} />
          </Field>
          <Field label="Guardian name">
            <Input value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
          </Field>
          <Field label="Guardian phone">
            <Input value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} />
          </Field>
          <Field label="Guardian email">
            <Input type="email" value={guardianEmail} onChange={(e) => setGuardianEmail(e.target.value)} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Add application"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
