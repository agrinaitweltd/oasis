"use client";

import { Badge } from "@/components/portal/ui/Badge";
import { SimpleModule, type FieldDef } from "@/components/school/SimpleModule";
import type { Tables } from "@/types/database.types";

type Row = Tables<"safeguarding_concerns">;

const fields: FieldDef[] = [
  { key: "student_id", label: "Student", type: "relation", relationTable: "students", labelKey: "full_name" },
  { key: "concern", label: "Concern", type: "textarea", required: true },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "open", label: "Open" },
      { value: "closed", label: "Closed" },
    ],
  },
];

export default function SafeguardingPage() {
  return (
    <SimpleModule<Row>
      table="safeguarding_concerns"
      title="Safeguarding"
      description="Concerns and case management. Restricted to School Admin only."
      fields={fields}
      writeRoles={["school_admin"]}
      deleteRoles={["school_admin"]}
      readRoles={["school_admin"]}
      columns={[
        { key: "concern", header: "Concern", render: (r) => r.concern },
        { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "open" ? "warning" : "success"}>{r.status}</Badge> },
      ]}
    />
  );
}
