"use client";

import { Badge } from "@/components/portal/ui/Badge";
import { PageHeader } from "@/components/portal/PageHeader";
import { SimpleModule, type FieldDef } from "@/components/school/SimpleModule";
import type { Tables } from "@/types/database.types";

type Staff = Tables<"staff">;
type LeaveRequest = Tables<"staff_leave_requests">;

const staffFields: FieldDef[] = [
  { key: "full_name", label: "Full name", type: "text", required: true },
  { key: "job_title", label: "Job title", type: "text" },
  { key: "department", label: "Department", type: "text" },
];

const leaveFields: FieldDef[] = [
  { key: "staff_id", label: "Staff member", type: "relation", relationTable: "staff", labelKey: "full_name", required: true },
  { key: "start_date", label: "Start date", type: "date", required: true },
  { key: "end_date", label: "End date", type: "date", required: true },
  { key: "reason", label: "Reason", type: "textarea" },
];

export default function StaffPage() {
  return (
    <div>
      <PageHeader
        title="Staff Management"
        description="Staff profiles and leave requests."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Staff Management" }]}
      />

      <div className="mb-6">
        <SimpleModule<Staff>
          table="staff"
          title="Staff roster"
          description=""
          fields={staffFields}
          writeRoles={["school_admin"]}
          deleteRoles={[]}
          compact
          columns={[
            { key: "name", header: "Name", render: (r) => <p className="font-medium text-slate-800">{r.full_name}</p> },
            { key: "title", header: "Job title", render: (r) => r.job_title || "—" },
            { key: "dept", header: "Department", render: (r) => r.department || "—" },
            { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "active" ? "success" : "neutral"}>{r.status}</Badge> },
          ]}
        />
      </div>

      <SimpleModule<LeaveRequest>
        table="staff_leave_requests"
        title="Leave requests"
        description=""
        fields={leaveFields}
        writeRoles={["school_admin", "teacher", "bursar"]}
        deleteRoles={["school_admin"]}
        compact
        columns={[
          { key: "dates", header: "Dates", render: (r) => `${r.start_date} → ${r.end_date}` },
          { key: "reason", header: "Reason", render: (r) => r.reason || "—" },
          {
            key: "status",
            header: "Status",
            render: (r) => <Badge tone={r.status === "approved" ? "success" : r.status === "rejected" ? "danger" : "warning"}>{r.status}</Badge>,
          },
        ]}
      />
    </div>
  );
}
