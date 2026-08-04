import type { ReactNode } from "react";
import { Breadcrumbs } from "./ui/Breadcrumbs";

export function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
}: {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
