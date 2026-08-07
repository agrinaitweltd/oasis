"use client";

import { Badge } from "@/components/portal/ui/Badge";
import { SimpleModule, type FieldDef } from "@/components/school/SimpleModule";
import type { Tables } from "@/types/database.types";

type Row = Tables<"behaviour_incidents">;

const fields: FieldDef[] = [
  { key: "student_id", label: "Student", type: "relation", relationTable: "students", labelKey: "full_name", required: true },
  {
    key: "type",
    label: "Type",
    type: "select",
    required: true,
    options: [
      { value: "positive", label: "Positive" },
      { value: "negative", label: "Negative" },
    ],
  },
  { key: "points", label: "Points", type: "number", placeholder: "0" },
  { key: "description", label: "Description", type: "textarea", required: true },
];

export default function BehaviourPage() {
  return (
    <SimpleModule<Row>
      table="behaviour_incidents"
      title="Behaviour"
      description="Incidents, points, rewards and sanctions."
      fields={fields}
      writeRoles={["school_admin", "teacher"]}
      deleteRoles={[]}
      columns={[
        { key: "type", header: "Type", render: (r) => <Badge tone={r.type === "positive" ? "success" : "danger"}>{r.type}</Badge> },
        { key: "points", header: "Points", render: (r) => r.points },
        { key: "description", header: "Description", render: (r) => r.description },
      ]}
    />
  );
}
