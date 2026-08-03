"use client";

import { TextField } from "@/components/auth/FormFields";
import { WizardStepHeader } from "@/components/onboarding/WizardShell";
import type { OrganisationDetails } from "@/lib/onboarding-types";

export default function Step1Organisation({
  data,
  errors,
  onChange,
}: {
  data: OrganisationDetails;
  errors: Partial<Record<keyof OrganisationDetails, string>>;
  onChange: (patch: Partial<OrganisationDetails>) => void;
}) {
  return (
    <div className="wizard-step-panel">
      <WizardStepHeader
        eyebrow="Step 1 of 10"
        title="School & Organisation Details"
        description="Let's start with the basics about your school and who we should contact."
      />
      <div className="wizard-grid cols-2">
        <TextField
          label="Full Registered Company Name"
          required
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
          error={errors.companyName}
          placeholder="e.g. Sunrise Education Ltd"
        />
        <TextField
          label="School Name"
          required
          value={data.schoolName}
          onChange={(e) => onChange({ schoolName: e.target.value })}
          error={errors.schoolName}
          placeholder="e.g. Sunrise Primary School"
        />
        <TextField
          label="Trading Name"
          value={data.tradingName}
          onChange={(e) => onChange({ tradingName: e.target.value })}
          hint="Optional, if different from the school name"
        />
        <TextField
          label="School Website"
          value={data.website}
          onChange={(e) => onChange({ website: e.target.value })}
          hint="Optional"
          placeholder="www.yourschool.ug"
        />
        <TextField
          label="School Email Address"
          type="email"
          required
          value={data.schoolEmail}
          onChange={(e) => onChange({ schoolEmail: e.target.value })}
          error={errors.schoolEmail}
          placeholder="info@yourschool.ug"
        />
        <TextField
          label="School Telephone Number"
          type="tel"
          required
          value={data.schoolPhone}
          onChange={(e) => onChange({ schoolPhone: e.target.value })}
          error={errors.schoolPhone}
          placeholder="+256 7XX XXX XXX"
        />
        <TextField
          label="Alternative Contact Number"
          type="tel"
          value={data.altPhone}
          onChange={(e) => onChange({ altPhone: e.target.value })}
          hint="Optional"
        />
        <div />
        <TextField
          label="Head Teacher / Principal Name"
          required
          value={data.headTeacherName}
          onChange={(e) => onChange({ headTeacherName: e.target.value })}
          error={errors.headTeacherName}
        />
        <TextField
          label="Director / Proprietor Name"
          required
          value={data.directorName}
          onChange={(e) => onChange({ directorName: e.target.value })}
          error={errors.directorName}
        />
      </div>
    </div>
  );
}
