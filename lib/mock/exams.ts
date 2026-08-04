import type { Exam, ExamResult } from "@/types/portal";
import { makeRng } from "./rand";
import { classes } from "./classes";
import { students } from "./students";

const rng = makeRng(6006);

const SUBJECTS = ["Mathematics", "English", "Science", "Social Studies"];

export const exams: Exam[] = [
  { id: "exm_0", name: "Beginning of Term Assessment", term: "Term 2, 2026", startDate: "2026-05-12", endDate: "2026-05-16", status: "Published", classIds: classes.map((c) => c.id) },
  { id: "exm_1", name: "Mid-Term Examination", term: "Term 2, 2026", startDate: "2026-06-23", endDate: "2026-06-27", status: "Published", classIds: classes.map((c) => c.id) },
  { id: "exm_2", name: "End of Term Examination", term: "Term 2, 2026", startDate: "2026-08-10", endDate: "2026-08-14", status: "Scheduled", classIds: classes.map((c) => c.id) },
];

function gradeFor(pct: number) {
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

export const examResults: ExamResult[] = exams
  .filter((e) => e.status === "Published")
  .flatMap((exam) =>
    students.flatMap((s) =>
      SUBJECTS.map((subject, i) => {
        const score = rng.int(35, 98);
        return {
          id: `res_${exam.id}_${s.id}_${i}`,
          examId: exam.id,
          studentId: s.id,
          subject,
          score,
          maxScore: 100,
          grade: gradeFor(score),
        };
      })
    )
  );

export function resultsForExam(examId: string) {
  return examResults.filter((r) => r.examId === examId);
}
export function resultsForStudent(studentId: string) {
  return examResults.filter((r) => r.studentId === studentId);
}
