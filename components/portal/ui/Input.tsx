"use client";

import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-oasis-400 focus:ring-4 focus:ring-oasis-100",
        className
      )}
      {...rest}
    />
  );
});

export function SearchInput({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        className={cn(
          "h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-oasis-400 focus:ring-4 focus:ring-oasis-100",
          className
        )}
        {...rest}
      />
    </div>
  );
}

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...rest },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-oasis-400 focus:ring-4 focus:ring-oasis-100",
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
});
