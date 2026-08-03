export interface StepMeta {
  id: number;
  key: string;
  label: string;
  shortLabel: string;
}

export const onboardingSteps: StepMeta[] = [
  { id: 1, key: "organisation", label: "School & Organisation Details", shortLabel: "Organisation" },
  { id: 2, key: "schoolType", label: "School Type", shortLabel: "School type" },
  { id: 3, key: "location", label: "School Location", shortLabel: "Location" },
  { id: 4, key: "profile", label: "School Profile", shortLabel: "Profile" },
  { id: 5, key: "studentNumbers", label: "Student Numbers", shortLabel: "Students" },
  { id: 6, key: "staff", label: "Staff Information", shortLabel: "Staff" },
  { id: 7, key: "academic", label: "Academic Information", shortLabel: "Academics" },
  { id: 8, key: "currentSystems", label: "Current Systems", shortLabel: "Systems" },
  { id: 9, key: "modules", label: "Modules Required", shortLabel: "Modules" },
  { id: 10, key: "review", label: "Review & Submit", shortLabel: "Review" },
];
