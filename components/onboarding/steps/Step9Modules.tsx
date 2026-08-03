"use client";

import { OptionCard } from "@/components/onboarding/OptionCard";
import { WizardStepHeader } from "@/components/onboarding/WizardShell";
import { moduleLabels, type ModuleKey } from "@/lib/onboarding-types";

export default function Step9Modules({
  selected,
  error,
  onToggle,
}: {
  selected: ModuleKey[];
  error?: string;
  onToggle: (key: ModuleKey) => void;
}) {
  return (
    <div className="wizard-step-panel">
      <WizardStepHeader
        eyebrow="Step 9 of 10"
        title="Modules Required"
        description="Select everything you'd like OASIS to help with. You can change this later."
      />
      <div className="wizard-option-grid">
        {(Object.entries(moduleLabels) as [ModuleKey, string][]).map(([key, label]) => (
          <OptionCard key={key} label={label} selected={selected.includes(key)} onClick={() => onToggle(key)} checkbox />
        ))}
      </div>
      {error && <p className="auth-error-text">{error}</p>}
    </div>
  );
}
