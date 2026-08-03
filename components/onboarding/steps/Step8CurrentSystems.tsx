"use client";

import { TextField } from "@/components/auth/FormFields";
import { OptionCard } from "@/components/onboarding/OptionCard";
import { WizardStepHeader } from "@/components/onboarding/WizardShell";
import { currentSystemLabels, type CurrentSystem, type CurrentSystemsDetails } from "@/lib/onboarding-types";

export default function Step8CurrentSystems({
  data,
  errors,
  onChange,
}: {
  data: CurrentSystemsDetails;
  errors: Partial<Record<keyof CurrentSystemsDetails, string>>;
  onChange: (patch: Partial<CurrentSystemsDetails>) => void;
}) {
  return (
    <div className="wizard-step-panel">
      <WizardStepHeader eyebrow="Step 8 of 10" title="Current Systems" description="How do you currently manage your school?" />
      <div className="wizard-option-grid">
        {(Object.entries(currentSystemLabels) as [CurrentSystem, string][]).map(([key, label]) => (
          <OptionCard key={key} label={label} selected={data.currentSystem === key} onClick={() => onChange({ currentSystem: key })} />
        ))}
      </div>
      {errors.currentSystem && <p className="auth-error-text">{errors.currentSystem}</p>}

      {data.currentSystem === "existing_software" && (
        <div style={{ marginTop: 16 }}>
          <TextField
            label="Which system do you use?"
            required
            value={data.currentSoftwareName}
            onChange={(e) => onChange({ currentSoftwareName: e.target.value })}
            error={errors.currentSoftwareName}
          />
        </div>
      )}
    </div>
  );
}
