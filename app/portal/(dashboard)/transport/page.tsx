"use client";

import { Bus, MapPin, Plus, User } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { Button } from "@/components/portal/ui/Button";
import { transportRoutes } from "@/lib/mock/facilities";

export default function TransportPage() {
  return (
    <div>
      <PageHeader
        title="Transport"
        description={`${transportRoutes.length} active school bus routes`}
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Transport" }]}
        action={
          <Button>
            <Plus className="h-4 w-4" /> Add Route
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {transportRoutes.map((r) => {
          const pct = Math.round((r.studentsAssigned / r.capacity) * 100);
          return (
            <Card key={r.id}>
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-oasis-50 text-oasis-600">
                  <Bus className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{r.vehiclePlate}</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{r.name}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <User className="h-3.5 w-3.5" /> {r.driver}
              </p>
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                  <span>Occupancy</span>
                  <span>
                    {r.studentsAssigned}/{r.capacity}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-oasis-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="mt-4">
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <MapPin className="h-3.5 w-3.5" /> STOPS
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {r.stops.map((s) => (
                    <span key={s} className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] text-slate-500">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
