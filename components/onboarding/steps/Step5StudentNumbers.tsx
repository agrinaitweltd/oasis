"use client";

import { TextField } from "@/components/auth/FormFields";
import { OptionCard } from "@/components/onboarding/OptionCard";
import { WizardStepHeader } from "@/components/onboarding/WizardShell";
import { studentBandLabels, type StudentBand, type StudentNumbersDetails } from "@/lib/onboarding-types";

export default function Step5StudentNumbers({
  data,
  errors,
  onChange,
}: {
  data: StudentNumbersDetails;
  errors: Partial<Record<keyof StudentNumbersDetails, string>>;
  onChange: (patch: Partial<StudentNumbersDetails>) => void;
}) {
  return (
    <div className="wizard-step-panel">
      <WizardStepHeader eyebrow="Step 5 of 10" title="Student Numbers" description="Help us understand the scale of your school." />
      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Current Student Population</p>
      <div className="wizard-option-grid">
        {(Object.entries(studentBandLabels) as [StudentBand, string][]).map(([key, label]) => (
          <OptionCard key={key} label={label} selected={data.currentPopulation === key} onClick={() => onChange({ currentPopulation: key })} />
        ))}
      </div>
      {errors.currentPopulation && <p className="auth-error-text">{errors.currentPopulation}</p>}

      <div style={{ marginTop: 24 }}>
        <TextField
          label="Expected growth over the next three years"
          required
          value={data.expectedGrowth}
          onChange={(e) => onChange({ expectedGrowth: e.target.value })}
          error={errors.expectedGrowth}
          placeholder="e.g. Expecting to grow to around 800 students"
        />
      </div>
    </div>
  );
}
