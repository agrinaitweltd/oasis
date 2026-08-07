import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { EmptyState } from "@/components/portal/ui/EmptyState";

export function ModulePlaceholder({
  title,
  description,
  icon,
  note,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  note?: string;
}) {
  return (
    <div>
      <PageHeader title={title} description={description} breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: title }]} />
      <Card>
        <EmptyState
          icon={icon}
          title="Not built yet"
          description={note ?? "This module isn't wired up on the website yet. The underlying table already exists and is shared with the mobile app - this screen just hasn't been built here."}
        />
      </Card>
    </div>
  );
}
