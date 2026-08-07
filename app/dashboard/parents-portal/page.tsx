"use client";

import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Badge } from "@/components/portal/ui/Badge";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRealtimeRows } from "@/lib/supabase/useRealtimeRows";
import type { Tables } from "@/types/database.types";
import { Heart } from "lucide-react";

export default function ParentsPortalPage() {
  const { user } = useAuth();
  const { rows: students, loading } = useRealtimeRows<Tables<"students">>("students", "full_name");
  const myChildren = students.filter((s) => s.guardian_profile_id === user?.id);

  const { rows: attendance } = useRealtimeRows<Tables<"attendance_records">>("attendance_records", "date");
  const { rows: behaviour } = useRealtimeRows<Tables<"behaviour_incidents">>("behaviour_incidents");
  const { rows: invoices } = useRealtimeRows<Tables<"fee_invoices">>("fee_invoices");

  return (
    <div>
      <PageHeader
        title="Parents Portal"
        description="Your child's attendance, behaviour and fees."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Parents Portal" }]}
      />

      {!loading && myChildren.length === 0 ? (
        <Card>
          <EmptyState icon={Heart} title="No child linked to your account yet" description="Ask your school admin to link your account to your child's student record." />
        </Card>
      ) : (
        myChildren.map((child) => (
          <div key={child.id} className="mb-6">
            <h2 className="mb-3 text-base font-semibold text-slate-800">{child.full_name}</h2>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <Card>
                <CardHeader title="Recent attendance" />
                {attendance
                  .filter((a) => a.student_id === child.id)
                  .slice(0, 5)
                  .map((a) => (
                    <div key={a.id} className="flex items-center justify-between py-1.5 text-sm">
                      <span className="text-slate-500">{a.date}</span>
                      <Badge tone={a.status === "present" ? "success" : "warning"}>{a.status}</Badge>
                    </div>
                  ))}
              </Card>
              <Card>
                <CardHeader title="Behaviour" />
                {behaviour
                  .filter((b) => b.student_id === child.id)
                  .slice(0, 5)
                  .map((b) => (
                    <div key={b.id} className="py-1.5 text-sm text-slate-600">
                      {b.description}
                    </div>
                  ))}
              </Card>
              <Card>
                <CardHeader title="Fees" />
                {invoices
                  .filter((i) => i.student_id === child.id)
                  .slice(0, 5)
                  .map((i) => (
                    <div key={i.id} className="flex items-center justify-between py-1.5 text-sm">
                      <span className="text-slate-600">{i.description}</span>
                      <Badge tone={i.status === "paid" ? "success" : "warning"}>{i.status}</Badge>
                    </div>
                  ))}
              </Card>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
