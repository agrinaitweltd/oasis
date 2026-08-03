"use client";

import { OptionCard } from "@/components/onboarding/OptionCard";
import { WizardStepHeader } from "@/components/onboarding/WizardShell";
import { schoolTypeLabels, type SchoolTypeOption } from "@/lib/onboarding-types";

export default function Step2SchoolType({
  value,
  onChange,
}: {
  value: SchoolTypeOption | "";
  onChange: (value: SchoolTypeOption) => void;
}) {
  return (
    <div className="wizard-step-panel">
      <WizardStepHeader eyebrow="Step 2 of 10" title="School Type" description="Which best describes your school?" />
      <div className="wizard-option-grid">
        {(Object.entries(schoolTypeLabels) as [SchoolTypeOption, string][]).map(([key, label]) => (
          <OptionCard key={key} label={label} selected={value === key} onClick={() => onChange(key)} />
        ))}
      </div>
    </div>
  );
}
