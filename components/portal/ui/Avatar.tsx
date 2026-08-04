import { cn } from "@/lib/utils/cn";

const PALETTE = ["bg-oasis-100 text-oasis-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-sky-100 text-sky-700", "bg-rose-100 text-rose-700"];

function hashOf(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const tone = PALETTE[hashOf(name) % PALETTE.length];
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={cn("flex flex-shrink-0 items-center justify-center rounded-full font-semibold", tone)}
    >
      {initials}
    </span>
  );
}
