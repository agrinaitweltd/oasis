"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { Select } from "@/components/portal/ui/Input";
import { classes } from "@/lib/mock/classes";
import { teachers } from "@/lib/mock/teachers";
import { timetable, timetableDays, timetablePeriods, timetableForClass, timetableForTeacher } from "@/lib/mock/timetable";
import { cn } from "@/lib/utils/cn";

type ViewMode = "class" | "teacher" | "room";

export default function TimetablePage() {
  const [mode, setMode] = useState<ViewMode>("class");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? "");
  const [room, setRoom] = useState("");

  const rooms = useMemo(() => [...new Set(timetable.map((t) => t.room))].sort(), []);

  const slots = useMemo(() => {
    if (mode === "class") return timetableForClass(classId);
    if (mode === "teacher") return timetableForTeacher(teacherId);
    return timetable.filter((t) => t.room === (room || rooms[0]));
  }, [mode, classId, teacherId, room, rooms]);

  return (
    <div>
      <PageHeader
        title="Timetable"
        description="Weekly schedule by class, teacher or room"
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Timetable" }]}
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {(["class", "teacher", "room"] as ViewMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold capitalize transition",
              mode === m ? "bg-oasis-500 text-white shadow-sm" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            )}
          >
            {m} timetable
          </button>
        ))}

        <div className="ml-auto">
          {mode === "class" && (
            <Select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-52">
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.stream}
                </option>
              ))}
            </Select>
          )}
          {mode === "teacher" && (
            <Select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="w-52">
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </Select>
          )}
          {mode === "room" && (
            <Select value={room || rooms[0]} onChange={(e) => setRoom(e.target.value)} className="w-52">
              {rooms.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          )}
        </div>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-24 border-b border-r border-slate-100 bg-slate-50/60 p-2.5 text-left text-xs font-semibold text-slate-400">Period</th>
              {timetableDays.map((d) => (
                <th key={d} className="border-b border-slate-100 bg-slate-50/60 p-2.5 text-left text-xs font-semibold text-slate-500">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetablePeriods.map((p) => (
              <tr key={p.period} className="border-b border-slate-50 last:border-0">
                <td className="border-r border-slate-100 p-2.5 align-top">
                  <p className="text-xs font-semibold text-slate-600">P{p.period}</p>
                  <p className="text-[11px] text-slate-400">
                    {p.startTime}&ndash;{p.endTime}
                  </p>
                </td>
                {timetableDays.map((d) => {
                  const slot = slots.find((s) => s.day === d && s.period === p.period);
                  const teacher = slot ? teachers.find((t) => t.id === slot.teacherId) : null;
                  return (
                    <td key={d} className="p-1.5 align-top">
                      {slot ? (
                        <div className="rounded-xl bg-oasis-50 p-2.5">
                          <p className="text-[13px] font-semibold text-oasis-700">{slot.subject}</p>
                          <p className="mt-0.5 text-[11px] text-oasis-600/80">
                            {mode !== "teacher" && teacher ? `${teacher.firstName} ${teacher.lastName}` : slot.room}
                          </p>
                          <p className="text-[11px] text-oasis-600/60">{mode === "room" ? "" : slot.room}</p>
                        </div>
                      ) : (
                        <div className="h-14 rounded-xl border border-dashed border-slate-100" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
