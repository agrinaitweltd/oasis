import type { Parent, Student } from "@/types/portal";
import { fullName, makeRng, LAST_NAMES } from "./rand";
import { classes } from "./classes";

const rng = makeRng(3003);

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const ALLERGIES = ["Peanuts", "Penicillin", "Dust", "Pollen", "Lactose", "Shellfish"];
const CONDITIONS = ["Asthma", "Epilepsy", "Diabetes (Type 1)", "Sickle Cell"];
const DOC_TYPES = ["Birth Certificate", "Immunisation Record", "Previous Report Card", "Transfer Letter", "Medical Form"];

const STUDENT_COUNT = 96;

function makeGuardianEmail(last: string) {
  return `${last.toLowerCase()}.family@example.com`;
}

export const parents: Parent[] = [];
export const students: Student[] = [];

for (let i = 0; i < STUDENT_COUNT; i++) {
  const { first, last, gender } = fullName(rng);
  const cls = rng.pick(classes);
  const shareSibling = i > 0 && rng.bool(0.18);
  let guardian: Parent;
  if (shareSibling && parents.length > 0) {
    guardian = rng.pick(parents);
  } else {
    const parentName = fullName(rng);
    guardian = {
      id: `par_${parents.length}`,
      firstName: parentName.first,
      lastName: last,
      email: makeGuardianEmail(last),
      phone: `+256 7${rng.int(0, 9)}${rng.int(0, 9)} ${rng.int(100, 999)} ${rng.int(100, 999)}`,
      studentIds: [],
      feeBalance: 0,
      lastMessageAt: rng.bool(0.5) ? rng.dateWithinDays(30) : null,
    };
    parents.push(guardian);
  }

  const student: Student = {
    id: `stu_${i}`,
    admissionNo: `OAS-${String(2400 + i)}`,
    firstName: first,
    lastName: shareSibling ? guardian.lastName : last,
    gender,
    dateOfBirth: rng.dateWithinDays(365 * rng.int(6, 18) + 3650),
    classId: cls.id,
    className: cls.name,
    stream: cls.stream,
    photoUrl: null,
    status: rng.bool(0.94) ? "Active" : rng.pick(["Inactive", "Graduated", "Transferred"] as const),
    guardianId: guardian.id,
    medical: {
      bloodGroup: rng.pick(BLOOD_GROUPS),
      allergies: rng.bool(0.3) ? rng.pickMany(ALLERGIES, rng.int(1, 2)) : [],
      conditions: rng.bool(0.12) ? rng.pickMany(CONDITIONS, 1) : [],
      notes: rng.bool(0.2) ? "Requires reminder for medication after lunch." : "",
    },
    emergencyContacts: [
      { name: `${guardian.firstName} ${guardian.lastName}`, relationship: "Parent", phone: guardian.phone },
      { name: `${rng.pick(LAST_NAMES)} Household`, relationship: "Relative", phone: `+256 7${rng.int(0, 9)}${rng.int(0, 9)} ${rng.int(100, 999)} ${rng.int(100, 999)}` },
    ],
    documents: rng.pickMany(DOC_TYPES, rng.int(2, 4)).map((name) => ({
      name,
      type: name.includes("Medical") ? "PDF" : "Image",
      uploadedAt: rng.dateWithinDays(300),
    })),
    behaviourNotes: rng.bool(0.4)
      ? [
          {
            date: rng.dateWithinDays(90),
            type: rng.pick(["Positive", "Negative", "Neutral"] as const),
            note: rng.pick([
              "Helped organise the class library.",
              "Disrupted class during a lesson.",
              "Represented the school at inter-school debate.",
              "Late submission of homework, spoken to.",
              "Outstanding performance in group project.",
            ]),
            recordedBy: "Class Teacher",
          },
        ]
      : [],
    attendanceRate: rng.int(78, 100),
  };

  guardian.studentIds.push(student.id);
  guardian.feeBalance += rng.int(0, 6) * 50000;
  students.push(student);
}

export function getStudentById(id: string) {
  return students.find((s) => s.id === id);
}
export function getParentById(id: string) {
  return parents.find((p) => p.id === id);
}
export function getStudentsByClass(classId: string) {
  return students.filter((s) => s.classId === classId);
}
