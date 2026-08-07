"use client";

import { Badge } from "@/components/portal/ui/Badge";
import { PageHeader } from "@/components/portal/PageHeader";
import { SimpleModule, type FieldDef } from "@/components/school/SimpleModule";
import type { Tables } from "@/types/database.types";

type Trip = Tables<"school_trips">;
type Consent = Tables<"trip_consents">;

const tripFields: FieldDef[] = [
  { key: "name", label: "Trip name", type: "text", required: true },
  { key: "destination", label: "Destination", type: "text" },
  { key: "trip_date", label: "Date", type: "date" },
  { key: "cost", label: "Cost", type: "number" },
];

const consentFields: FieldDef[] = [
  { key: "trip_id", label: "Trip", type: "relation", relationTable: "school_trips", labelKey: "name", required: true },
  { key: "student_id", label: "Student", type: "relation", relationTable: "students", labelKey: "full_name", required: true },
  { key: "consent_given", label: "Consent", type: "boolean-select", required: true, trueLabel: "Given", falseLabel: "Not given" },
];

export default function TripsPage() {
  return (
    <div>
      <PageHeader
        title="School Trips"
        description="Trip planning, cost and parental consent."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "School Trips" }]}
      />

      <div className="mb-6">
        <SimpleModule<Trip>
          table="school_trips"
          title="Trips"
          description=""
          fields={tripFields}
          writeRoles={["school_admin", "teacher", "bursar"]}
          deleteRoles={["school_admin"]}
          compact
          columns={[
            { key: "name", header: "Name", render: (r) => <p className="font-medium text-slate-800">{r.name}</p> },
            { key: "destination", header: "Destination", render: (r) => r.destination || "—" },
            { key: "date", header: "Date", render: (r) => r.trip_date || "—" },
            { key: "cost", header: "Cost", render: (r) => (r.cost != null ? r.cost.toLocaleString() : "—") },
          ]}
        />
      </div>

      <SimpleModule<Consent>
        table="trip_consents"
        title="Consents"
        description=""
        fields={consentFields}
        writeRoles={["school_admin", "teacher", "bursar"]}
        deleteRoles={["school_admin"]}
        compact
        columns={[
          { key: "consent", header: "Consent", render: (r) => <Badge tone={r.consent_given ? "success" : "warning"}>{r.consent_given ? "Given" : "Not given"}</Badge> },
        ]}
      />
    </div>
  );
}
