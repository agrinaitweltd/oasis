"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const EVENT_DAYS = [4, 9, 12, 15, 22]; // demo event markers for the shown month

export function MiniCalendar() {
  const [cursor, setCursor] = useState(new Date(2026, 7, 1));
  const today = new Date(2026, 7, 4);

  const monthLabel = cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first

  const cells: (number | null)[] = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">{monthLabel}</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-400">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <span key={i} />;
          const isToday =
            cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth() && day === today.getDate();
          const hasEvent = EVENT_DAYS.includes(day) && cursor.getMonth() === 7;
          return (
            <div key={i} className="relative flex h-8 items-center justify-center">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs transition",
                  isToday ? "bg-oasis-500 font-semibold text-white" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {day}
              </span>
              {hasEvent && !isToday && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-oasis-400" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
