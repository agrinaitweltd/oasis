"use client";

import { BedDouble, Plus } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { hostelRooms } from "@/lib/mock/facilities";
import type { HostelRoom } from "@/types/portal";

export default function HostelPage() {
  const columns: Column<HostelRoom>[] = [
    {
      key: "room",
      header: "Room",
      render: (r) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-oasis-50 text-oasis-600">
            <BedDouble className="h-4 w-4" />
          </span>
          <div>
            <p className="font-medium text-slate-800">{r.roomNo}</p>
            <p className="text-xs text-slate-400">{r.block}</p>
          </div>
        </div>
      ),
    },
    { key: "warden", header: "Warden", render: (r) => r.wardenName },
    {
      key: "occupancy",
      header: "Occupancy",
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-oasis-500" style={{ width: `${(r.occupied / r.capacity) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-500">
            {r.occupied}/{r.capacity}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <Badge tone={r.occupied >= r.capacity ? "danger" : r.occupied === 0 ? "neutral" : "success"}>{r.occupied >= r.capacity ? "Full" : r.occupied === 0 ? "Empty" : "Available"}</Badge>,
    },
  ];

  const totalCapacity = hostelRooms.reduce((s, r) => s + r.capacity, 0);
  const totalOccupied = hostelRooms.reduce((s, r) => s + r.occupied, 0);

  return (
    <div>
      <PageHeader
        title="Hostel"
        description={`${totalOccupied}/${totalCapacity} boarding places occupied across ${hostelRooms.length} rooms`}
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Hostel" }]}
        action={
          <Button>
            <Plus className="h-4 w-4" /> Add Room
          </Button>
        }
      />
      <Card className="p-0">
        <Table columns={columns} rows={hostelRooms} emptyTitle="No hostel rooms configured" />
      </Card>
    </div>
  );
}
