import type { SchoolClass } from "@/types/portal";
import { makeRng } from "./rand";
import { teachers } from "./teachers";

const rng = makeRng(1001);

const LEVELS = ["Baby Class", "Middle Class", "Top Class", "P.1", "P.2", "P.3", "P.4", "P.5", "P.6", "P.7", "S.1", "S.2", "S.3", "S.4", "S.5", "S.6"];
const STREAMS = ["North", "South", "East", "West"];
const ROOMS = ["Block A - 101", "Block A - 102", "Block B - 201", "Block B - 202", "Block C - 301", "Block C - 302", "Science Wing - 1", "Science Wing - 2"];

export const classes: SchoolClass[] = LEVELS.flatMap((level, i) =>
  STREAMS.slice(0, i < 3 ? 2 : 2).map((stream, j) => {
    const capacity = rng.int(28, 40);
    const studentCount = rng.int(Math.round(capacity * 0.7), capacity);
    return {
      id: `cls_${i}_${j}`,
      name: level,
      stream,
      teacherId: teachers[(i * 2 + j) % teachers.length].id,
      studentCount,
      capacity,
      room: rng.pick(ROOMS),
    };
  })
);

export function getClassById(id: string) {
  return classes.find((c) => c.id === id);
}
