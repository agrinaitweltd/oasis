"use client";

import { SimpleModule, type FieldDef } from "@/components/school/SimpleModule";
import type { Tables } from "@/types/database.types";

type Row = Tables<"assessments">;

const fields: FieldDef[] = [
  { key: "student_id", label: "Student", type: "relation", relationTable: "students", labelKey: "full_name", required: true },
  { key: "subject", label: "Subject", type: "text", required: true },
  { key: "term", label: "Term", type: "text" },
  { key: "score", label: "Score", type: "number" },
  { key: "max_score", label: "Max score", type: "number", placeholder: "100" },
  { key: "comments", label: "Comments", type: "textarea" },
];

export default function AcademicPage() {
  return (
    <SimpleModule<Row>
      table="assessments"
      title="Academic"
      description="Assessments, gradebooks and progress tracking."
      fields={fields}
      writeRoles={["school_admin", "teacher", "bursar"]}
      deleteRoles={["school_admin"]}
      columns={[
        { key: "subject", header: "Subject", render: (r) => r.subject },
        { key: "term", header: "Term", render: (r) => r.term || "—" },
        { key: "score", header: "Score", render: (r) => `${r.score ?? "—"} / ${r.max_score}` },
        { key: "comments", header: "Comments", render: (r) => r.comments || "—" },
      ]}
    />
  );
}
