"use client";

import { WizardStepHeader } from "@/components/onboarding/WizardShell";
import {
  currentSystemLabels,
  moduleLabels,
  schoolTypeLabels,
  studentBandLabels,
  type OnboardingData,
} from "@/lib/onboarding-types";

function Section({
  title,
  onEdit,
  items,
}: {
  title: string;
  onEdit: () => void;
  items: { label: string; value: string }[];
}) {
  return (
    <div className="wizard-review-section">
      <div className="wizard-review-section-header">
        <h3>{title}</h3>
        <button type="button" className="wizard-review-edit" onClick={onEdit}>
          Edit
        </button>
      </div>
      <dl className="wizard-review-grid">
        {items
          .filter((i) => i.value)
          .map((item) => (
            <div className="wizard-review-item" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}

export default function Step10Review({ data, goToStep }: { data: OnboardingData; goToStep: (step: number) => void }) {
  const o = data.organisation;
  const l = data.location;
  const p = data.profile;
  const s = data.studentNumbers;
  const st = data.staff;
  const a = data.academic;
  const cs = data.currentSystems;

  return (
    <div className="wizard-step-panel">
      <WizardStepHeader eyebrow="Step 10 of 10" title="Review &amp; Submit" description="Please check everything looks right before submitting." />

      <Section
        title="School & Organisation"
        onEdit={() => goToStep(1)}
        items={[
          { label: "Company Name", value: o.companyName },
          { label: "School Name", value: o.schoolName },
          { label: "Trading Name", value: o.tradingName || "" },
          { label: "School Email", value: o.schoolEmail },
          { label: "School Phone", value: o.schoolPhone },
          { label: "Alt. Phone", value: o.altPhone || "" },
          { label: "Head Teacher", value: o.headTeacherName },
          { label: "Director", value: o.directorName },
          { label: "Website", value: o.website || "" },
        ]}
      />

      <Section
        title="School Type"
        onEdit={() => goToStep(2)}
        items={[{ label: "Type", value: data.schoolType.schoolType ? schoolTypeLabels[data.schoolType.schoolType] : "" }]}
      />

      <Section
        title="Location"
        onEdit={() => goToStep(3)}
        items={[
          { label: "Country", value: l.country },
          { label: "Region", value: l.region },
          { label: "District", value: l.district },
          { label: "City / Town", value: l.cityTown },
          { label: "Parish", value: l.parish || "" },
          { label: "Physical Address", value: l.physicalAddress },
          { label: "Postal Address", value: l.postalAddress || "" },
        ]}
      />

      <Section
        title="School Profile"
        onEdit={() => goToStep(4)}
        items={[
          { label: "Year Established", value: p.yearEstablished },
          { label: "Years in Operation", value: p.yearsInOperation },
          { label: "Academic Calendar", value: p.academicCalendar },
          { label: "Ownership", value: p.ownership },
          { label: "Day / Boarding", value: p.boarding },
          { label: "Gender", value: p.gender },
          { label: "Campuses", value: p.numCampuses },
          { label: "Annual Intake", value: p.annualIntake },
        ]}
      />

      <Section
        title="Student Numbers"
        onEdit={() => goToStep(5)}
        items={[
          { label: "Current Population", value: s.currentPopulation ? studentBandLabels[s.currentPopulation] : "" },
          { label: "Expected Growth", value: s.expectedGrowth },
        ]}
      />

      <Section
        title="Staff"
        onEdit={() => goToStep(6)}
        items={[
          { label: "Teachers", value: st.teachers },
          { label: "Admin Staff", value: st.adminStaff },
          { label: "Finance Staff", value: st.financeStaff },
          { label: "ICT Staff", value: st.ictStaff },
          { label: "Boarding Staff", value: st.boardingStaff },
          { label: "Support Staff", value: st.supportStaff },
          { label: "Total Employees", value: st.totalEmployees },
        ]}
      />

      <Section
        title="Academic"
        onEdit={() => goToStep(7)}
        items={[
          { label: "Curriculum", value: a.curriculum === "Other" ? a.otherCurriculum || "Other" : a.curriculum },
          { label: "Subjects", value: a.subjectsOffered },
          { label: "Classes", value: a.numClasses },
          { label: "Streams", value: a.numStreams },
          { label: "Examination Levels", value: a.examinationLevels },
        ]}
      />

      <Section
        title="Current Systems"
        onEdit={() => goToStep(8)}
        items={[
          { label: "System", value: cs.currentSystem ? currentSystemLabels[cs.currentSystem] : "" },
          { label: "Software Name", value: cs.currentSoftwareName || "" },
        ]}
      />

      <Section
        title="Modules Required"
        onEdit={() => goToStep(9)}
        items={[{ label: "Selected Modules", value: data.modules.modules.map((m) => moduleLabels[m]).join(", ") }]}
      />
    </div>
  );
}
