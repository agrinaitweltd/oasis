import type { AttendanceRecord } from "@/types/portal";
import { makeRng } from "./rand";
import { students } from "./students";

const rng = makeRng(4004);

function last14Days() {
  const days: string[] = [];
  const base = new Date(2026, 7, 4);
  for (let i = 13; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue; // skip weekends
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export const attendanceDays = last14Days();

export const attendanceRecords: AttendanceRecord[] = attendanceDays.flatMap((date) =>
  students.map((s, i) => {
    const roll = rng.next();
    const status = roll < 0.86 ? "Present" : roll < 0.93 ? "Late" : roll < 0.98 ? "Absent" : "Excused";
    return {
      id: `att_${date}_${i}`,
      studentId: s.id,
      classId: s.classId,
      date,
      status,
      arrivalTime: status === "Present" ? "07:4" + rng.int(0, 9) : status === "Late" ? "08:" + rng.int(15, 45) : null,
      note: status === "Excused" ? "Parent notified school in advance." : undefined,
    };
  })
);

export function attendanceForDate(date: string) {
  return attendanceRecords.filter((r) => r.date === date);
}
