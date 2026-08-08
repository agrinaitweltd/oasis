"use client";

import { CheckCircle2, Circle, MinusCircle } from "lucide-react";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRealtimeRows } from "@/lib/supabase/useRealtimeRows";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database.types";

type StepKey = "school_profile" | "classes" | "staff" | "subjects" | "departments" | "fee_structure" | "houses" | "dormitories" | "transport" | "exams_grading";

type Step = { key: StepKey; label: string; done: boolean; skippable: boolean };

/** Progress is computed dynamically from real row counts, never a stored
 * per-step flag - so it can never drift out of sync with what's actually in
 * the database (agreed with the mobile team, who track it the same way).
 * schools.onboarding_skipped_steps covers the one thing row counts can't
 * express: "not applicable" vs "not done yet". */
export function useOnboardingSteps(): { steps: Step[]; resolvedCount: number; loading: boolean } {
  const { profile } = useAuth();
  const { rows: schools, loading: loadingSchool } = useRealtimeRows<Tables<"schools">>("schools");
  const school = schools.find((s) => s.id === profile?.school_id);

  const { rows: classes } = useRealtimeRows<Tables<"classes">>("classes");
  const { rows: staff } = useRealtimeRows<Tables<"staff">>("staff");
  const { rows: subjects } = useRealtimeRows<Tables<"subjects">>("subjects");
  const { rows: departments } = useRealtimeRows<Tables<"departments">>("departments");
  const { rows: feeCategories } = useRealtimeRows<Tables<"fee_categories">>("fee_categories");
  const { rows: houses } = useRealtimeRows<Tables<"houses">>("houses");
  const { rows: dormitories } = useRealtimeRows<Tables<"dormitories">>("dormitories");
  const { rows: transportRoutes } = useRealtimeRows<Tables<"transport_routes">>("transport_routes");
  const { rows: examTypes } = useRealtimeRows<Tables<"exam_types">>("exam_types");
  const { rows: gradeBands } = useRealtimeRows<Tables<"grade_bands">>("grade_bands");

  const skipped = new Set(school?.onboarding_skipped_steps ?? []);

  const steps: Step[] = [
    { key: "school_profile", label: "School Profile", done: !!(school?.name && school?.address && school?.contact_email), skippable: false },
    { key: "classes", label: "Classes", done: classes.length > 0, skippable: false },
    { key: "staff", label: "Staff", done: staff.length > 0, skippable: false },
    { key: "subjects", label: "Subjects", done: subjects.length > 0, skippable: false },
    { key: "departments", label: "Departments", done: departments.length > 0, skippable: true },
    { key: "fee_structure", label: "Fee Structure", done: feeCategories.length > 0, skippable: false },
    { key: "houses", label: "Houses", done: houses.length > 0, skippable: true },
    { key: "dormitories", label: "Dormitories", done: dormitories.length > 0, skippable: true },
    { key: "transport", label: "Transport Routes", done: transportRoutes.length > 0, skippable: true },
    { key: "exams_grading", label: "Exam Types & Grading", done: examTypes.length > 0 && gradeBands.length > 0, skippable: true },
  ];

  const resolvedCount = steps.filter((s) => s.done || skipped.has(s.key)).length;

  return { steps: steps.map((s) => ({ ...s, done: s.done || skipped.has(s.key) })), resolvedCount, loading: loadingSchool };
}

export function OnboardingChecklist() {
  const { profile } = useAuth();
  const { steps, resolvedCount, loading } = useOnboardingSteps();

  async function skipStep(key: StepKey) {
    if (!profile?.school_id) return;
    const supabase = createClient();
    const { data: school } = await supabase.from("schools").select("onboarding_skipped_steps").eq("id", profile.school_id).maybeSingle();
    const next = Array.from(new Set([...(school?.onboarding_skipped_steps ?? []), key]));
    await supabase.from("schools").update({ onboarding_skipped_steps: next }).eq("id", profile.school_id);
  }

  if (loading) return null;
  if (resolvedCount === steps.length) return null;

  return (
    <Card className="mb-5">
      <CardHeader title="Finish setting up your school" subtitle={`${resolvedCount} of ${steps.length} steps done`} />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {steps.map((step) => (
          <div key={step.key} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2">
            <div className="flex items-center gap-2">
              {step.done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-slate-300" />}
              <span className={step.done ? "text-sm text-slate-500 line-through" : "text-sm font-medium text-slate-700"}>{step.label}</span>
            </div>
            {!step.done && step.skippable && (
              <button
                type="button"
                onClick={() => skipStep(step.key)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <MinusCircle className="h-3.5 w-3.5" /> Not applicable
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
