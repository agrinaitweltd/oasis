"use client";

import { SimpleModule, type FieldDef } from "@/components/school/SimpleModule";
import type { Tables } from "@/types/database.types";

type Row = Tables<"exam_entries">;

const fields: FieldDef[] = [
  { key: "student_id", label: "Student", type: "relation", relationTable: "students", labelKey: "full_name", required: true },
  { key: "exam_name", label: "Exam", type: "text", required: true },
  { key: "subject", label: "Subject", type: "text", required: true },
  { key: "exam_date", label: "Date", type: "date" },
  { key: "seat_number", label: "Seat number", type: "text" },
  { key: "result", label: "Result", type: "text" },
];

export default function ExamsPage() {
  return (
    <SimpleModule<Row>
      table="exam_entries"
      title="Exams"
      description="Entries, seat numbers and results."
      fields={fields}
      writeRoles={["school_admin", "teacher", "bursar"]}
      deleteRoles={["school_admin"]}
      columns={[
        { key: "exam", header: "Exam", render: (r) => r.exam_name },
        { key: "subject", header: "Subject", render: (r) => r.subject },
        { key: "date", header: "Date", render: (r) => r.exam_date || "—" },
        { key: "seat", header: "Seat", render: (r) => r.seat_number || "—" },
        { key: "result", header: "Result", render: (r) => r.result || "—" },
      ]}
    />
  );
}
