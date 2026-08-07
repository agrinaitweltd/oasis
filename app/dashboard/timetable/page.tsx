"use client";

import { SimpleModule, type FieldDef } from "@/components/school/SimpleModule";
import type { Tables } from "@/types/database.types";

type Row = Tables<"timetable_entries">;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const fields: FieldDef[] = [
  { key: "class_name", label: "Class", type: "text", required: true },
  { key: "subject", label: "Subject", type: "text", required: true },
  {
    key: "day_of_week",
    label: "Day",
    type: "select",
    required: true,
    options: DAYS.map((d, i) => ({ value: String(i + 1), label: d })),
  },
  { key: "start_time", label: "Start time", type: "time", required: true },
  { key: "end_time", label: "End time", type: "time", required: true },
  { key: "teacher_id", label: "Teacher", type: "relation", relationTable: "profiles", labelKey: "full_name" },
  { key: "room", label: "Room", type: "text" },
];

export default function TimetablePage() {
  return (
    <SimpleModule<Row>
      table="timetable_entries"
      title="Timetable"
      description="School, staff and student timetables."
      orderBy="day_of_week"
      fields={fields}
      writeRoles={["school_admin", "teacher", "bursar"]}
      deleteRoles={["school_admin"]}
      columns={[
        { key: "class", header: "Class", render: (r) => r.class_name },
        { key: "subject", header: "Subject", render: (r) => r.subject },
        { key: "day", header: "Day", render: (r) => DAYS[r.day_of_week - 1] ?? r.day_of_week },
        { key: "time", header: "Time", render: (r) => `${r.start_time}–${r.end_time}` },
        { key: "room", header: "Room", render: (r) => r.room || "—" },
      ]}
    />
  );
}
