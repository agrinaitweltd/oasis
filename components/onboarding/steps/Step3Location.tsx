"use client";

import { TextField } from "@/components/auth/FormFields";
import { WizardStepHeader } from "@/components/onboarding/WizardShell";
import type { LocationDetails } from "@/lib/onboarding-types";

export default function Step3Location({
  data,
  errors,
  onChange,
}: {
  data: LocationDetails;
  errors: Partial<Record<keyof LocationDetails, string>>;
  onChange: (patch: Partial<LocationDetails>) => void;
}) {
  return (
    <div className="wizard-step-panel">
      <WizardStepHeader eyebrow="Step 3 of 10" title="School Location" description="Where is your school based?" />
      <div className="wizard-grid cols-2">
        <TextField label="Country" required value={data.country} onChange={(e) => onChange({ country: e.target.value })} error={errors.country} />
        <TextField label="Region" required value={data.region} onChange={(e) => onChange({ region: e.target.value })} error={errors.region} placeholder="e.g. Central" />
        <TextField label="District" required value={data.district} onChange={(e) => onChange({ district: e.target.value })} error={errors.district} />
        <TextField label="City / Town" required value={data.cityTown} onChange={(e) => onChange({ cityTown: e.target.value })} error={errors.cityTown} />
        <TextField label="Parish" value={data.parish} onChange={(e) => onChange({ parish: e.target.value })} hint="Optional" />
        <div />
        <div className="span-2">
          <TextField
            label="Physical Address"
            required
            value={data.physicalAddress}
            onChange={(e) => onChange({ physicalAddress: e.target.value })}
            error={errors.physicalAddress}
            placeholder="Street, plot number, landmark"
          />
        </div>
        <TextField label="Google Maps Location" value={data.mapsLink} onChange={(e) => onChange({ mapsLink: e.target.value })} hint="Optional - paste a Google Maps link" />
        <TextField label="Postal Address" value={data.postalAddress} onChange={(e) => onChange({ postalAddress: e.target.value })} hint="Optional" placeholder="P.O. Box ..." />
      </div>
    </div>
  );
}
