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
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { sendNotification } from "@/lib/platform-store";
import { useCollection } from "@/lib/store";
import type { PlatformNotification, SchoolRequest } from "@/types/portal";
import { useToast } from "@/hooks/useToast";

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications] = useCollection<PlatformNotification>("oasis_platform_notifications");
  const [schools] = useCollection<SchoolRequest>("oasis_school_registry");
  const [composeOpen, setComposeOpen] = useState(false);
  const [audience, setAudience] = useState<"one" | "multiple" | "all">("all");
  const [oneSchool, setOneSchool] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

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

  function submit() {
    if (!title.trim() || !body.trim()) {
      toast("error", "Missing details", "Add a title and message.");
      return;
    }
    const targetSchools = audience === "one" ? [oneSchool] : audience === "multiple" ? schools.map((s) => s.schoolName) : [];
    sendNotification({ title: title.trim(), body: body.trim(), audience, targetSchools });
    setComposeOpen(false);
    setTitle("");
    setBody("");
    toast("success", "Notification sent", "");
  }

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
        {notifications.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No notifications sent yet" description="Compose one above to notify schools." />
          </div>
        ) : (
          <Table columns={columns} rows={notifications} emptyTitle="No notifications sent yet" />
        )}
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
            <Button onClick={submit}>
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
              <Select value={oneSchool} onChange={(e) => setOneSchool(e.target.value)}>
                <option value="">Select a school</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.schoolName}>
                    {s.schoolName}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Scheduled maintenance" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
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
