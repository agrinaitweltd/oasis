import type { TimetableSlot } from "@/types/portal";
import { makeRng } from "./rand";
import { classes } from "./classes";
import { teachers } from "./teachers";

const rng = makeRng(9009);

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const PERIODS = [
  { period: 1, startTime: "08:00", endTime: "08:40" },
  { period: 2, startTime: "08:40", endTime: "09:20" },
  { period: 3, startTime: "09:20", endTime: "10:00" },
  { period: 4, startTime: "10:20", endTime: "11:00" },
  { period: 5, startTime: "11:00", endTime: "11:40" },
  { period: 6, startTime: "11:40", endTime: "12:20" },
  { period: 7, startTime: "13:20", endTime: "14:00" },
  { period: 8, startTime: "14:00", endTime: "14:40" },
];
const SUBJECTS = ["Mathematics", "English", "Science", "Social Studies", "Physical Education", "Art & Design", "Computer Studies", "Religious Education"];
const ROOMS = ["Block A - 101", "Block A - 102", "Block B - 201", "Block B - 202", "Science Lab", "Library", "Hall", "Computer Lab"];

export const timetable: TimetableSlot[] = classes.flatMap((cls, ci) =>
  DAYS.flatMap((day) =>
    PERIODS.map((p, pi) => ({
      id: `tt_${cls.id}_${day}_${p.period}`,
      day,
      period: p.period,
      startTime: p.startTime,
      endTime: p.endTime,
      subject: rng.pick(SUBJECTS),
      classId: cls.id,
      teacherId: teachers[(ci + pi) % teachers.length].id,
      room: rng.pick(ROOMS),
    }))
  )
);

export function timetableForClass(classId: string) {
  return timetable.filter((t) => t.classId === classId);
}
export function timetableForTeacher(teacherId: string) {
  return timetable.filter((t) => t.teacherId === teacherId);
}
export { DAYS as timetableDays, PERIODS as timetablePeriods };
