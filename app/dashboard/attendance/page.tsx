"use client";

import { Badge } from "@/components/portal/ui/Badge";
import { SimpleModule, type FieldDef } from "@/components/school/SimpleModule";
import type { Tables } from "@/types/database.types";

type Row = Tables<"attendance_records">;

const STATUS_TONE: Record<string, "success" | "danger" | "warning" | "neutral"> = {
  present: "success",
  absent: "danger",
  late: "warning",
  excused: "neutral",
};

const fields: FieldDef[] = [
  { key: "student_id", label: "Student", type: "relation", relationTable: "students", labelKey: "full_name", required: true },
  { key: "date", label: "Date", type: "date", required: true },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "present", label: "Present" },
      { value: "absent", label: "Absent" },
      { value: "late", label: "Late" },
      { value: "excused", label: "Excused" },
    ],
  },
  { key: "notes", label: "Notes", type: "textarea" },
];

export default function AttendancePage() {
  return (
    <SimpleModule<Row>
      table="attendance_records"
      title="Attendance"
      description="Daily attendance records."
      orderBy="date"
      fields={fields}
      writeRoles={["school_admin", "teacher"]}
      deleteRoles={[]}
      columns={[
        { key: "date", header: "Date", render: (r) => r.date },
        { key: "status", header: "Status", render: (r) => <Badge tone={STATUS_TONE[r.status] ?? "neutral"}>{r.status}</Badge> },
        { key: "notes", header: "Notes", render: (r) => r.notes || "—" },
      ]}
    />
  );
}
