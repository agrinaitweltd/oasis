"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { EmptyState } from "./EmptyState";
import { TableSkeleton } from "./Skeleton";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
};

export function Table<T extends { id: string }>({
  columns,
  rows,
  loading,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
}) {
  if (loading) {
    return (
      <div className="p-5">
        <TableSkeleton cols={columns.length} />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="p-6">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
            {columns.map((col) => (
              <th key={col.key} className={cn("whitespace-nowrap px-5 py-3 font-semibold", col.headerClassName)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/80",
                onRowClick && "cursor-pointer"
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("whitespace-nowrap px-5 py-3.5 text-slate-700", col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
