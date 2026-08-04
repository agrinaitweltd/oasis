"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquareText, Plus, Send, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Table, type Column } from "@/components/portal/ui/Table";
import { StatusBadge, Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { Modal } from "@/components/portal/ui/Modal";
import { Input, Select } from "@/components/portal/ui/Input";
import { announcements } from "@/lib/mock/communication";
import type { Announcement } from "@/types/portal";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { key: "all", label: "All", icon: Megaphone },
  { key: "SMS", label: "SMS", icon: MessageSquareText },
  { key: "Email", label: "Email", icon: Mail },
  { key: "In-App", label: "Announcements", icon: Bell },
] as const;

export default function CommunicationPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [composeOpen, setComposeOpen] = useState(false);

  const rows = tab === "all" ? announcements : announcements.filter((a) => a.channel === tab || (tab === "In-App" && a.channel === "Push"));

  const columns: Column<Announcement>[] = [
    {
      key: "title",
      header: "Message",
      render: (a) => (
        <div>
          <p className="font-medium text-slate-800">{a.title}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{a.body}</p>
        </div>
      ),
    },
    { key: "channel", header: "Channel", render: (a) => <Badge tone="info">{a.channel}</Badge> },
    { key: "audience", header: "Audience", render: (a) => a.audience },
    { key: "recipients", header: "Recipients", render: (a) => a.recipients.toLocaleString() },
    { key: "sentAt", header: "Sent", render: (a) => a.sentAt },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Communication"
        description="Send SMS, email and in-app announcements to your school community"
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Communication" }]}
        action={
          <Button onClick={() => setComposeOpen(true)}>
            <Plus className="h-4 w-4" /> Compose
          </Button>
        }
      />

      <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white p-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-medium transition",
              tab === t.key ? "bg-oasis-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <Card className="p-0">
        <Table columns={columns} rows={rows} emptyTitle="Nothing sent on this channel yet" />
      </Card>

      <Modal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        title="Compose message"
        description="Send an announcement to parents, teachers or students"
        maxWidth={520}
        footer={
          <>
            <Button variant="secondary" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setComposeOpen(false);
                toast("success", "Message queued", "Your announcement will be delivered shortly.");
              }}
            >
              <Send className="h-4 w-4" /> Send message
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Channel</label>
              <Select defaultValue="SMS">
                <option>SMS</option>
                <option>Email</option>
                <option>In-App</option>
                <option>Push</option>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Audience</label>
              <Select defaultValue="All">
                <option>All</option>
                <option>Parents</option>
                <option>Teachers</option>
                <option>Students</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Title</label>
            <Input placeholder="e.g. Fee deadline reminder" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Message</label>
            <textarea
              rows={4}
              placeholder="Write your message..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm outline-none transition focus:border-oasis-400 focus:ring-4 focus:ring-oasis-100"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
