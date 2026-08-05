"use client";

import { Building2, MapPin, Server } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { StatCard } from "@/components/portal/ui/StatCard";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { useCollection } from "@/lib/store";
import type { SchoolRequest } from "@/types/portal";

export default function AnalyticsPage() {
  const [schools] = useCollection<SchoolRequest>("oasis_school_registry");
  const approved = schools.filter((r) => r.status === "approved");
  const districts = new Set(schools.map((r) => r.district)).size;

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Anonymous, platform-wide statistics only - never individual students, parents or teachers."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Analytics" }]}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Schools" value={String(schools.length)} icon={Building2} accent="oasis" />
        <StatCard label="Approved Schools" value={String(approved.length)} icon={Building2} accent="emerald" />
        <StatCard label="Districts Represented" value={String(districts)} icon={MapPin} accent="sky" />
        <StatCard label="Reporting Schools" value={String(approved.length)} icon={Server} accent="amber" />
      </div>

      <Card>
        {schools.length === 0 ? (
          <EmptyState
            title="No data to analyze yet"
            description="Once schools register and go live, aggregate platform statistics (students, teachers, logins, attendance) will appear here - always anonymised, never per-person."
          />
        ) : (
          <p className="text-sm text-slate-500">
            Per-student, per-teacher and usage analytics require each school&rsquo;s system to be live and reporting
            data. That connection hasn&rsquo;t been made yet for any school in this registry.
          </p>
        )}
      </Card>
    </div>
  );
}
