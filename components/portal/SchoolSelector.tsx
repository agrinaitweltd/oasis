"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Check, ChevronDown, Search } from "lucide-react";
import { searchSchools } from "@/lib/mock/schools";
import type { School } from "@/types/portal";
import { cn } from "@/lib/utils/cn";

export function SchoolSelector({
  value,
  onChange,
}: {
  value: School | null;
  onChange: (school: School) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const results = searchSchools(query);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Select your school</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-12 w-full items-center gap-2.5 rounded-xl border bg-white px-3.5 text-left text-sm transition",
          open ? "border-oasis-400 ring-4 ring-oasis-100" : "border-slate-200 hover:border-slate-300"
        )}
      >
        <Building2 className="h-[18px] w-[18px] flex-shrink-0 text-slate-400" />
        <span className={cn("flex-1 truncate", value ? "font-medium text-slate-900" : "text-slate-400")}>
          {value ? value.name : "Search schools..."}
        </span>
        <ChevronDown className={cn("h-4 w-4 flex-shrink-0 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="animate-pop absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-popover">
          <div className="relative border-b border-slate-100 p-2">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search schools..."
              className="h-10 w-full rounded-lg border-0 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-oasis-200"
            />
          </div>
          <div className="scrollbar-thin max-h-60 overflow-y-auto p-1.5">
            {results.length === 0 && <p className="px-3 py-4 text-center text-sm text-slate-400">No schools match &ldquo;{query}&rdquo;</p>}
            {results.map((school) => (
              <button
                key={school.id}
                type="button"
                onClick={() => {
                  onChange(school);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-oasis-50"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-oasis-100 text-[11px] font-bold text-oasis-700">
                  {school.logoInitials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-800">{school.name}</span>
                  <span className="block truncate text-xs text-slate-400">{school.district} District</span>
                </span>
                {value?.id === school.id && <Check className="h-4 w-4 flex-shrink-0 text-oasis-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
