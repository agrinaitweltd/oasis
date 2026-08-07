"use client";

import { Badge } from "@/components/portal/ui/Badge";
import { SimpleModule, type FieldDef } from "@/components/school/SimpleModule";
import type { Tables } from "@/types/database.types";

type Row = Tables<"messages">;

const fields: FieldDef[] = [
  { key: "subject", label: "Subject", type: "text", required: true },
  { key: "body", label: "Message", type: "textarea", required: true },
  {
    key: "audience",
    label: "Audience",
    type: "select",
    required: true,
    options: [
      { value: "all", label: "Everyone" },
      { value: "parents", label: "Parents" },
      { value: "staff", label: "Staff" },
      { value: "students", label: "Students" },
    ],
  },
];

export default function CommunicationPage() {
  return (
    <SimpleModule<Row>
      table="messages"
      title="Communication"
      description="Broadcast messages to parents, staff or students."
      fields={fields}
      writeRoles={["school_admin", "teacher", "bursar"]}
      deleteRoles={["school_admin"]}
      columns={[
        { key: "subject", header: "Subject", render: (r) => <p className="font-medium text-slate-800">{r.subject}</p> },
        { key: "audience", header: "Audience", render: (r) => <Badge tone="info">{r.audience}</Badge> },
        { key: "body", header: "Message", render: (r) => <span className="line-clamp-1 max-w-xs">{r.body}</span> },
      ]}
    />
  );
}
