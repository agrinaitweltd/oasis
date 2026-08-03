"use client";

import { TextField } from "@/components/auth/FormFields";
import { OptionCard } from "@/components/onboarding/OptionCard";
import { WizardStepHeader } from "@/components/onboarding/WizardShell";
import type { AcademicDetails } from "@/lib/onboarding-types";

const curricula = ["Ugandan National Curriculum", "Cambridge", "IB", "Other"];

export default function Step7Academic({
  data,
  errors,
  onChange,
}: {
  data: AcademicDetails;
  errors: Partial<Record<keyof AcademicDetails, string>>;
  onChange: (patch: Partial<AcademicDetails>) => void;
}) {
  return (
    <div className="wizard-step-panel">
      <WizardStepHeader eyebrow="Step 7 of 10" title="Academic Information" description="What and how you teach." />

      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Which curriculum do you offer?</p>
      <div className="wizard-option-grid">
        {curricula.map((c) => (
          <OptionCard key={c} label={c} selected={data.curriculum === c} onClick={() => onChange({ curriculum: c })} />
        ))}
      </div>
      {errors.curriculum && <p className="auth-error-text">{errors.curriculum}</p>}

      {data.curriculum === "Other" && (
        <div style={{ marginTop: 16 }}>
          <TextField
            label="Please specify"
            required
            value={data.otherCurriculum}
            onChange={(e) => onChange({ otherCurriculum: e.target.value })}
            error={errors.otherCurriculum}
          />
        </div>
      )}

      <div className="wizard-grid cols-2" style={{ marginTop: 24 }}>
        <div className="span-2">
          <TextField label="Subjects Offered" required value={data.subjectsOffered} onChange={(e) => onChange({ subjectsOffered: e.target.value })} error={errors.subjectsOffered} placeholder="e.g. Maths, English, Science, Social Studies..." />
        </div>
        <TextField label="Number of Classes" type="number" min={0} required value={data.numClasses} onChange={(e) => onChange({ numClasses: e.target.value })} error={errors.numClasses} />
        <TextField label="Number of Streams" type="number" min={0} required value={data.numStreams} onChange={(e) => onChange({ numStreams: e.target.value })} error={errors.numStreams} />
        <div className="span-2">
          <TextField label="Examination Levels" required value={data.examinationLevels} onChange={(e) => onChange({ examinationLevels: e.target.value })} error={errors.examinationLevels} placeholder="e.g. PLE, UCE, UACE" />
        </div>
      </div>
    </div>
  );
}
