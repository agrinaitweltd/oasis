"use client";

import { useState } from "react";
import { Megaphone, Send } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { Modal } from "@/components/portal/ui/Modal";
import { Input, Select } from "@/components/portal/ui/Input";
import { platformNotifications } from "@/lib/mock/platform";
import { schoolRequests } from "@/lib/mock/school-requests";
import type { PlatformNotification } from "@/types/portal";
import { useToast } from "@/hooks/useToast";

export default function NotificationsPage() {
  const { toast } = useToast();
  const [composeOpen, setComposeOpen] = useState(false);
  const [audience, setAudience] = useState<"one" | "multiple" | "all">("all");

  const columns: Column<PlatformNotification>[] = [
    {
      key: "title",
      header: "Notification",
      render: (n) => (
        <div>
          <p className="font-medium text-slate-800">{n.title}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{n.body}</p>
        </div>
      ),
    },
    { key: "audience", header: "Audience", render: (n) => <Badge tone="info">{n.audience === "all" ? "All schools" : n.audience === "multiple" ? `${n.targetSchools.length} schools` : "1 school"}</Badge> },
    { key: "sent", header: "Sent", render: (n) => n.sentAt },
    { key: "status", header: "Status", render: (n) => <Badge tone={n.status === "sent" ? "success" : n.status === "scheduled" ? "warning" : "neutral"}>{n.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Send platform announcements to one school, several schools, or everyone."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Notifications" }]}
        action={
          <Button onClick={() => setComposeOpen(true)}>
            <Megaphone className="h-4 w-4" /> Compose
          </Button>
        }
      />

      <Card className="p-0">
        <Table columns={columns} rows={platformNotifications} emptyTitle="No notifications sent yet" />
      </Card>

      <Modal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        title="Compose notification"
        maxWidth={500}
        footer={
          <>
            <Button variant="secondary" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setComposeOpen(false);
                toast("success", "Notification sent", "");
              }}
            >
              <Send className="h-4 w-4" /> Send
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Audience</label>
            <Select value={audience} onChange={(e) => setAudience(e.target.value as typeof audience)}>
              <option value="all">All schools</option>
              <option value="multiple">Multiple schools</option>
              <option value="one">One school</option>
            </Select>
          </div>
          {audience === "one" && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">School</label>
              <Select defaultValue={schoolRequests[0]?.id}>
                {schoolRequests.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.schoolName}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Title</label>
            <Input placeholder="e.g. Scheduled maintenance" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Message</label>
            <textarea
              rows={4}
              placeholder="Write your announcement..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm outline-none transition focus:border-oasis-400 focus:ring-4 focus:ring-oasis-100"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
