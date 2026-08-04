import type { LeaveRequest, Teacher } from "@/types/portal";
import { fullName, makeRng } from "./rand";

const rng = makeRng(2002);

const SUBJECTS = [
  "Mathematics", "English", "Science", "Social Studies", "Physics", "Chemistry", "Biology",
  "Literature", "History", "Geography", "Computer Studies", "Art & Design", "Music", "Physical Education", "Religious Education",
];

export const teachers: Teacher[] = Array.from({ length: 22 }, (_, i) => {
  const { first, last } = fullName(rng);
  const subjects = rng.pickMany(SUBJECTS, rng.int(1, 3));
  const teacher: Teacher = {
    id: `tch_${i}`,
    staffNo: `STF-${String(1000 + i)}`,
    firstName: first,
    lastName: last,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@oasis-demo.co.ug`,
    phone: `+256 7${rng.int(0, 9)}${rng.int(0, 9)} ${rng.int(100, 999)} ${rng.int(100, 999)}`,
    subjects,
    classesTaught: [],
    status: rng.bool(0.88) ? "Active" : rng.bool() ? "On Leave" : "Inactive",
    joinedAt: rng.dateWithinDays(365 * 6),
    photoUrl: null,
  };
  return teacher;
});

export function getTeacherById(id: string) {
  return teachers.find((t) => t.id === id);
}

export const leaveRequests: LeaveRequest[] = Array.from({ length: 10 }, (_, i) => {
  const teacher = rng.pick(teachers);
  const start = rng.dateWithinDays(60);
  return {
    id: `lv_${i}`,
    teacherId: teacher.id,
    type: rng.pick(["Sick", "Annual", "Maternity", "Compassionate", "Unpaid"] as const),
    startDate: start,
    endDate: start,
    status: rng.pick(["Pending", "Approved", "Rejected"] as const),
  };
});
