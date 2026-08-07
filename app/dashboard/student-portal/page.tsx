"use client";

import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Badge } from "@/components/portal/ui/Badge";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRealtimeRows } from "@/lib/supabase/useRealtimeRows";
import type { Tables } from "@/types/database.types";
import { UserSquare2 } from "lucide-react";

export default function StudentPortalPage() {
  const { user } = useAuth();
  const { rows: students, loading } = useRealtimeRows<Tables<"students">>("students", "full_name");
  const me = students.find((s) => s.student_profile_id === user?.id);

  const { rows: homework } = useRealtimeRows<Tables<"homework">>("homework", "due_date");
  const { rows: timetable } = useRealtimeRows<Tables<"timetable_entries">>("timetable_entries", "day_of_week");
  const { rows: assessments } = useRealtimeRows<Tables<"assessments">>("assessments");

  if (!loading && !me) {
    return (
      <div>
        <PageHeader title="Student Portal" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Student Portal" }]} />
        <Card>
          <EmptyState icon={UserSquare2} title="Your account isn't linked to a student record yet" description="Ask your school admin to link your account." />
        </Card>
      </div>
    );
  }

  const myHomework = homework.filter((h) => h.class_name === me?.form_class);
  const myTimetable = timetable.filter((t) => t.class_name === me?.form_class);
  const myGrades = assessments.filter((a) => a.student_id === me?.id);

  return (
    <div>
      <PageHeader
        title="Student Portal"
        description={me ? `Welcome, ${me.full_name}` : undefined}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Student Portal" }]}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title="Homework" />
          {myHomework.length === 0 && <p className="text-sm text-slate-400">Nothing set.</p>}
          {myHomework.slice(0, 5).map((h) => (
            <div key={h.id} className="py-1.5 text-sm">
              <p className="font-medium text-slate-700">{h.title}</p>
              <p className="text-xs text-slate-400">{h.subject} · due {h.due_date || "—"}</p>
            </div>
          ))}
        </Card>
        <Card>
          <CardHeader title="Timetable" />
          {myTimetable.length === 0 && <p className="text-sm text-slate-400">No timetable set for your class.</p>}
          {myTimetable.slice(0, 6).map((t) => (
            <div key={t.id} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-slate-600">{t.subject}</span>
              <span className="text-xs text-slate-400">{t.start_time}</span>
            </div>
          ))}
        </Card>
        <Card>
          <CardHeader title="Grades" />
          {myGrades.length === 0 && <p className="text-sm text-slate-400">No grades yet.</p>}
          {myGrades.slice(0, 5).map((g) => (
            <div key={g.id} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-slate-600">{g.subject}</span>
              <Badge tone="info">
                {g.score ?? "—"}/{g.max_score}
              </Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
