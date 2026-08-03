"use client";

import { TextField } from "@/components/auth/FormFields";
import { OptionCard } from "@/components/onboarding/OptionCard";
import { WizardStepHeader } from "@/components/onboarding/WizardShell";
import type { ProfileDetails } from "@/lib/onboarding-types";

export default function Step4Profile({
  data,
  errors,
  onChange,
}: {
  data: ProfileDetails;
  errors: Partial<Record<keyof ProfileDetails, string>>;
  onChange: (patch: Partial<ProfileDetails>) => void;
}) {
  return (
    <div className="wizard-step-panel">
      <WizardStepHeader eyebrow="Step 4 of 10" title="School Profile" description="A bit more about how your school operates." />
      <div className="wizard-grid cols-2">
        <TextField label="Year Established" required value={data.yearEstablished} onChange={(e) => onChange({ yearEstablished: e.target.value })} error={errors.yearEstablished} placeholder="e.g. 2005" />
        <TextField label="Years in Operation" required value={data.yearsInOperation} onChange={(e) => onChange({ yearsInOperation: e.target.value })} error={errors.yearsInOperation} />
        <TextField label="Current Academic Calendar" required value={data.academicCalendar} onChange={(e) => onChange({ academicCalendar: e.target.value })} error={errors.academicCalendar} placeholder="e.g. 3-term Ugandan calendar" />
        <TextField label="Number of Campuses" required value={data.numCampuses} onChange={(e) => onChange({ numCampuses: e.target.value })} error={errors.numCampuses} />
        <div className="span-2">
          <TextField label="Approximate Annual Intake" required value={data.annualIntake} onChange={(e) => onChange({ annualIntake: e.target.value })} error={errors.annualIntake} placeholder="e.g. 150 new students per year" />
        </div>
      </div>

      <FieldGroup label="Government or Private" error={errors.ownership}>
        <OptionCard label="Government" selected={data.ownership === "government"} onClick={() => onChange({ ownership: "government" })} />
        <OptionCard label="Private" selected={data.ownership === "private"} onClick={() => onChange({ ownership: "private" })} />
      </FieldGroup>

      <FieldGroup label="Day or Boarding" error={errors.boarding}>
        <OptionCard label="Day" selected={data.boarding === "day"} onClick={() => onChange({ boarding: "day" })} />
        <OptionCard label="Boarding" selected={data.boarding === "boarding"} onClick={() => onChange({ boarding: "boarding" })} />
        <OptionCard label="Both" selected={data.boarding === "both"} onClick={() => onChange({ boarding: "both" })} />
      </FieldGroup>

      <FieldGroup label="Mixed / Boys / Girls" error={errors.gender}>
        <OptionCard label="Mixed" selected={data.gender === "mixed"} onClick={() => onChange({ gender: "mixed" })} />
        <OptionCard label="Boys" selected={data.gender === "boys"} onClick={() => onChange({ gender: "boys" })} />
        <OptionCard label="Girls" selected={data.gender === "girls"} onClick={() => onChange({ gender: "girls" })} />
      </FieldGroup>
    </div>
  );
}

function FieldGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 24 }}>
      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{label}</p>
      <div className="wizard-option-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
        {children}
      </div>
      {error && <p className="auth-error-text">{error}</p>}
    </div>
  );
}
