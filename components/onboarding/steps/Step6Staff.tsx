"use client";

import { TextField } from "@/components/auth/FormFields";
import { WizardStepHeader } from "@/components/onboarding/WizardShell";
import type { StaffDetails } from "@/lib/onboarding-types";

export default function Step6Staff({
  data,
  errors,
  onChange,
}: {
  data: StaffDetails;
  errors: Partial<Record<keyof StaffDetails, string>>;
  onChange: (patch: Partial<StaffDetails>) => void;
}) {
  return (
    <div className="wizard-step-panel">
      <WizardStepHeader eyebrow="Step 6 of 10" title="Staff Information" description="Tell us about your team." />
      <div className="wizard-grid cols-2">
        <TextField label="Number of Teachers" type="number" min={0} required value={data.teachers} onChange={(e) => onChange({ teachers: e.target.value })} error={errors.teachers} />
        <TextField label="Administrative Staff" type="number" min={0} required value={data.adminStaff} onChange={(e) => onChange({ adminStaff: e.target.value })} error={errors.adminStaff} />
        <TextField label="Finance Staff" type="number" min={0} value={data.financeStaff} onChange={(e) => onChange({ financeStaff: e.target.value })} />
        <TextField label="ICT Staff" type="number" min={0} value={data.ictStaff} onChange={(e) => onChange({ ictStaff: e.target.value })} />
        <TextField label="Boarding Staff" type="number" min={0} value={data.boardingStaff} onChange={(e) => onChange({ boardingStaff: e.target.value })} />
        <TextField label="Support Staff" type="number" min={0} value={data.supportStaff} onChange={(e) => onChange({ supportStaff: e.target.value })} />
        <div className="span-2">
          <TextField label="Total Employees" type="number" min={0} required value={data.totalEmployees} onChange={(e) => onChange({ totalEmployees: e.target.value })} error={errors.totalEmployees} />
        </div>
      </div>
    </div>
  );
}
