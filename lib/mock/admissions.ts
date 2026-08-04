import { makeRng, fullName } from "./rand";
import { classes } from "./classes";

const rng = makeRng(1212);

export type AdmissionStage = "New Inquiry" | "Documents Submitted" | "Interview Scheduled" | "Offer Sent" | "Enrolled" | "Declined";

export type AdmissionApplication = {
  id: string;
  applicantName: string;
  guardianName: string;
  desiredClass: string;
  appliedAt: string;
  stage: AdmissionStage;
  phone: string;
};

const stages: AdmissionStage[] = ["New Inquiry", "Documents Submitted", "Interview Scheduled", "Offer Sent", "Enrolled", "Declined"];

export const admissions: AdmissionApplication[] = Array.from({ length: 28 }, (_, i) => {
  const applicant = fullName(rng);
  const guardian = fullName(rng);
  return {
    id: `adm_${i}`,
    applicantName: `${applicant.first} ${applicant.last}`,
    guardianName: `${guardian.first} ${guardian.last}`,
    desiredClass: rng.pick(classes).name,
    appliedAt: rng.dateWithinDays(45),
    stage: rng.pick(stages),
    phone: `+256 7${rng.int(0, 9)}${rng.int(0, 9)} ${rng.int(100, 999)} ${rng.int(100, 999)}`,
  };
});

export const admissionStages = stages;
