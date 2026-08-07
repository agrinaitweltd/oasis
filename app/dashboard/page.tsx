"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { schoolNav } from "@/lib/school-nav";
import { Building2 } from "lucide-react";

export default function DashboardPage() {
  const { user, profile, role } = useAuth();

  return (
    <div>
      <PageHeader
        title={`Welcome, ${profile?.full_name || user?.email || ""}`}
        description={role ? ROLE_LABELS[role] : undefined}
      />

      {!profile?.school_id && (
        <Card className="mb-5 border-dashed bg-slate-50/60">
          <EmptyState
            icon={Building2}
            title="Not linked to a school yet"
            description="Your account isn't attached to a school, so the modules below won't show any data until that's set up."
          />
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {schoolNav
          .filter((item) => item.href !== "/dashboard")
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white p-4 transition hover:-translate-y-0.5 hover:border-oasis-300 hover:shadow-sm"
            >
              <item.icon className="h-5 w-5 text-oasis-500" />
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </Link>
          ))}
      </div>
    </div>
  );
}
