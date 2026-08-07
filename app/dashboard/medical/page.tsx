"use client";

import { SimpleModule, type FieldDef } from "@/components/school/SimpleModule";
import type { Tables } from "@/types/database.types";

type Row = Tables<"medical_records">;

const fields: FieldDef[] = [
  { key: "student_id", label: "Student", type: "relation", relationTable: "students", labelKey: "full_name", required: true },
  { key: "condition", label: "Condition", type: "text" },
  { key: "allergy", label: "Allergy", type: "text" },
  { key: "medication", label: "Medication", type: "text" },
  { key: "notes", label: "Notes", type: "textarea" },
];

export default function MedicalPage() {
  return (
    <SimpleModule<Row>
      table="medical_records"
      title="Medical"
      description="Conditions, allergies, medication and care plans."
      fields={fields}
      writeRoles={["school_admin", "teacher", "bursar"]}
      deleteRoles={["school_admin"]}
      columns={[
        { key: "condition", header: "Condition", render: (r) => r.condition || "—" },
        { key: "allergy", header: "Allergy", render: (r) => r.allergy || "—" },
        { key: "medication", header: "Medication", render: (r) => r.medication || "—" },
        { key: "notes", header: "Notes", render: (r) => r.notes || "—" },
      ]}
    />
  );
}
