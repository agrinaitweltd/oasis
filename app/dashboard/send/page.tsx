"use client";

import { SimpleModule, type FieldDef } from "@/components/school/SimpleModule";
import type { Tables } from "@/types/database.types";

type Row = Tables<"send_records">;

const fields: FieldDef[] = [
  { key: "student_id", label: "Student", type: "relation", relationTable: "students", labelKey: "full_name", required: true },
  { key: "need_type", label: "Need type", type: "text", required: true },
  { key: "support_plan", label: "Support plan", type: "textarea" },
  { key: "review_date", label: "Review date", type: "date" },
];

export default function SendPage() {
  return (
    <SimpleModule<Row>
      table="send_records"
      title="SEND"
      description="SEN register and support plans."
      fields={fields}
      writeRoles={["school_admin", "teacher", "bursar"]}
      deleteRoles={["school_admin"]}
      columns={[
        { key: "need", header: "Need type", render: (r) => r.need_type },
        { key: "plan", header: "Support plan", render: (r) => r.support_plan || "—" },
        { key: "review", header: "Review date", render: (r) => r.review_date || "—" },
      ]}
    />
  );
}
