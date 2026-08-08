"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Button } from "@/components/portal/ui/Button";
import { Drawer } from "@/components/portal/ui/Drawer";
import { Input, SearchInput } from "@/components/portal/ui/Input";
import { Avatar } from "@/components/portal/ui/Avatar";
import { Badge } from "@/components/portal/ui/Badge";
import { Field } from "@/components/school/Field";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRealtimeRows } from "@/lib/supabase/useRealtimeRows";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import { useDebounce } from "@/hooks/useDebounce";
import type { Tables } from "@/types/database.types";

type Student = Tables<"students">;

export default function StudentsPage() {
  const { profile, role } = useAuth();
  const { toast } = useToast();
  const { rows, loading } = useRealtimeRows<Student>("students", "full_name");
  const canWrite = role === "school_admin" || role === "teacher";

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const filtered = rows.filter((s) => !debouncedQuery.trim() || s.full_name.toLowerCase().includes(debouncedQuery.trim().toLowerCase()));

  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [formClass, setFormClass] = useState("");
  const [house, setHouse] = useState("");
  const [dob, setDob] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile?.school_id || !fullName.trim()) return;
    setSaving(true);
    const { error } = await createClient().from("students").insert({
      school_id: profile.school_id,
      full_name: fullName.trim(),
      admission_number: admissionNumber.trim() || null,
      form_class: formClass.trim() || null,
      house: house.trim() || null,
      date_of_birth: dob || null,
      guardian_name: guardianName.trim() || null,
      guardian_phone: guardianPhone.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast("error", "Couldn't add student", error.message);
      return;
    }
    setOpen(false);
    setFullName("");
    setAdmissionNumber("");
    setFormClass("");
    setHouse("");
    setDob("");
    setGuardianName("");
    setGuardianPhone("");
    toast("success", "Student added", "");
  }

  const columns: Column<Student>[] = [
    {
      key: "student",
      header: "Student",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.full_name} />
          <div>
            <p className="font-medium text-slate-800">{r.full_name}</p>
            <p className="text-xs text-slate-400">{r.admission_number || "No admission number"}</p>
          </div>
        </div>
      ),
    },
    { key: "class", header: "Class", render: (r) => r.form_class || "—" },
    { key: "house", header: "House", render: (r) => r.house || "—" },
    { key: "guardian", header: "Guardian", render: (r) => r.guardian_name || "—" },
    { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "active" ? "success" : "neutral"}>{r.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Student Management"
        description="Personal info, admission number, form/class, house, guardian contacts."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Student Management" }]}
        action={
          canWrite && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Add student
            </Button>
          )
        }
      />

      <Card className="p-0">
        <div className="border-b border-slate-100 p-4">
          <SearchInput placeholder="Search students..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
        </div>
        <Table columns={columns} rows={filtered} loading={loading} emptyTitle="No students yet" />
      </Card>

      <Drawer open={open} onClose={() => setOpen(false)} title="Add student" width={480}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name">
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </Field>
          <Field label="Admission number">
            <Input value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} />
          </Field>
          <Field label="Form / class">
            <Input value={formClass} onChange={(e) => setFormClass(e.target.value)} />
          </Field>
          <Field label="House">
            <Input value={house} onChange={(e) => setHouse(e.target.value)} />
          </Field>
          <Field label="Date of birth">
            <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </Field>
          <Field label="Guardian name">
            <Input value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
          </Field>
          <Field label="Guardian phone">
            <Input value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Add student"}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
