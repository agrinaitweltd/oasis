import { makeRng } from "./rand";
import { classes } from "./classes";
import { teachers } from "./teachers";

const rng = makeRng(1313);

export type Homework = {
  id: string;
  title: string;
  subject: string;
  classId: string;
  teacherId: string;
  assignedAt: string;
  dueAt: string;
  status: "Open" | "Due Soon" | "Closed";
  submissions: number;
  totalStudents: number;
};

const TITLES = [
  "Chapter 5 exercises",
  "Essay: My Community",
  "Practical lab report",
  "Group project outline",
  "Reading comprehension worksheet",
  "Times tables practice",
  "Map skills assignment",
  "Science fair proposal",
];
const SUBJECTS = ["Mathematics", "English", "Science", "Social Studies"];

export const homework: Homework[] = Array.from({ length: 24 }, (_, i) => {
  const cls = rng.pick(classes);
  const teacher = rng.pick(teachers);
  const total = cls.studentCount;
  return {
    id: `hw_${i}`,
    title: rng.pick(TITLES),
    subject: rng.pick(SUBJECTS),
    classId: cls.id,
    teacherId: teacher.id,
    assignedAt: rng.dateWithinDays(20),
    dueAt: rng.dateWithinDays(-7),
    status: rng.pick(["Open", "Due Soon", "Closed"] as const),
    submissions: rng.int(0, total),
    totalStudents: total,
  };
});
