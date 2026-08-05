"use client";

import { useState } from "react";
import { Clock, KeyRound, Plus, ShieldCheck, Ticket } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { Modal } from "@/components/portal/ui/Modal";
import { Input, Select } from "@/components/portal/ui/Input";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { createTicket, requestSupportAccess, approveSupportAccess, revokeSupportAccess, parseUtc } from "@/lib/platform-store";
import { useCollection } from "@/lib/store";
import type { SchoolRequest, SupportAccessRequest, SupportTicket } from "@/types/portal";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils/cn";

const PRIORITY_TONE: Record<string, "neutral" | "warning" | "danger"> = { low: "neutral", medium: "warning", high: "danger", urgent: "danger" };
const STATUS_TONE: Record<string, "info" | "warning" | "success" | "neutral"> = { open: "info", pending: "warning", resolved: "success", closed: "neutral" };
const ACCESS_TONE: Record<string, "warning" | "success" | "danger" | "neutral"> = { pending: "warning", approved: "success", denied: "danger", expired: "neutral", revoked: "danger" };

const TABS = ["Tickets", "Support Access"] as const;

export default function SupportPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Tickets");
  const [tickets] = useCollection<SupportTicket>("oasis_support_tickets");
  const [accessRequests] = useCollection<SupportAccessRequest>("oasis_support_access_requests");
  const [schools] = useCollection<SchoolRequest>("oasis_school_registry");
  const approvedSchools = schools.filter((s) => s.status === "approved");

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketSchool, setTicketSchool] = useState("");
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketPriority, setTicketPriority] = useState<SupportTicket["priority"]>("medium");

  const [requestOpen, setRequestOpen] = useState(false);
  const [reqSchoolId, setReqSchoolId] = useState("");
  const [reqDuration, setReqDuration] = useState<30 | 60>(30);
  const [reqReason, setReqReason] = useState("");

  const ticketColumns: Column<SupportTicket>[] = [
    { key: "school", header: "School", render: (t) => t.schoolName },
    { key: "title", header: "Ticket", render: (t) => t.title },
    { key: "priority", header: "Priority", render: (t) => <Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge> },
    { key: "status", header: "Status", render: (t) => <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge> },
    { key: "updated", header: "Updated", render: (t) => t.updatedAt },
  ];

  function submitTicket() {
    if (!ticketSchool || !ticketTitle.trim() || !ticketMessage.trim()) {
      toast("error", "Missing details", "Fill in the school, title and message.");
      return;
    }
    createTicket({ schoolName: ticketSchool, title: ticketTitle.trim(), message: ticketMessage.trim(), priority: ticketPriority });
    setTicketOpen(false);
    setTicketTitle("");
    setTicketMessage("");
    toast("success", "Ticket logged", "");
  }

  function submitAccessRequest() {
    const school = schools.find((r) => r.id === reqSchoolId);
    if (!school || !reqReason.trim()) {
      toast("error", "Missing details", "Choose a school and describe why you need access.");
      return;
    }
    requestSupportAccess({ schoolId: school.id, schoolName: school.schoolName, reason: reqReason.trim(), ticketId: selectedTicket?.id ?? null, durationMinutes: reqDuration });
    setRequestOpen(false);
    setReqReason("");
    toast("info", "Access requested", `Waiting for ${school.schoolName} to approve.`);
    setTab("Support Access");
  }

  return (
    <div>
      <PageHeader
        title="Support"
        description="School support tickets, and time-boxed, school-approved access for investigating issues."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Support" }]}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setTicketOpen(true)}>
              <Plus className="h-4 w-4" /> Log ticket
            </Button>
            <Button onClick={() => setRequestOpen(true)} disabled={approvedSchools.length === 0}>
              <KeyRound className="h-4 w-4" /> Request support access
            </Button>
          </div>
        }
      />

      <div className="mb-5 flex gap-1 rounded-2xl border border-slate-200/70 bg-white p-1.5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-xl px-4 py-2 text-[13px] font-medium transition",
              tab === t ? "bg-oasis-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Tickets" && (
        <Card className="p-0">
          {tickets.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={Ticket} title="No support tickets" description="Tickets logged for schools will appear here." />
            </div>
          ) : (
            <Table columns={ticketColumns} rows={tickets} onRowClick={setSelectedTicket} emptyTitle="No support tickets" />
          )}
        </Card>
      )}

      {tab === "Support Access" && (
        <Card className="p-0">
          {accessRequests.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={ShieldCheck} title="No support access requests" description="Request temporary read-only access when investigating a ticket." />
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {accessRequests.map((r) => {
                const isExpired = r.status === "approved" && r.expiresAt && parseUtc(r.expiresAt) < new Date();
                const effectiveStatus = isExpired ? "expired" : r.status;
                return (
                  <div key={r.id} className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-800">{r.schoolName}</p>
                          <Badge tone={ACCESS_TONE[effectiveStatus]}>{effectiveStatus}</Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">{r.reason}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Clock className="h-3 w-3" />
                          Requested {r.requestedAt} &middot; {r.durationMinutes} min window
                          {r.expiresAt && ` · expires ${r.expiresAt}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {r.status === "pending" && (
                          <Button size="sm" variant="secondary" onClick={() => approveSupportAccess(r.id)}>
                            Simulate school approval
                          </Button>
                        )}
                        {r.status === "approved" && !isExpired && (
                          <Button size="sm" variant="danger" onClick={() => revokeSupportAccess(r.id)}>
                            Revoke now
                          </Button>
                        )}
                      </div>
                    </div>
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs font-semibold text-oasis-600">View activity log ({r.actions.length})</summary>
                      <ul className="mt-2 space-y-1.5 border-l-2 border-slate-100 pl-3">
                        {r.actions.map((a) => (
                          <li key={a.id} className="text-xs text-slate-500">
                            <span className="font-medium text-slate-700">{a.action}</span> &middot; {a.timestamp}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      <Modal open={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={selectedTicket?.title ?? ""} description={selectedTicket?.schoolName} maxWidth={480}>
        {selectedTicket && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge tone={PRIORITY_TONE[selectedTicket.priority]}>{selectedTicket.priority}</Badge>
              <Badge tone={STATUS_TONE[selectedTicket.status]}>{selectedTicket.status}</Badge>
            </div>
            <p className="text-slate-600">{selectedTicket.message}</p>
          </div>
        )}
      </Modal>

      <Modal
        open={ticketOpen}
        onClose={() => setTicketOpen(false)}
        title="Log a support ticket"
        maxWidth={460}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTicketOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitTicket}>Log ticket</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">School</label>
            <Select value={ticketSchool} onChange={(e) => setTicketSchool(e.target.value)}>
              <option value="">Select a school</option>
              {schools.map((s) => (
                <option key={s.id} value={s.schoolName}>
                  {s.schoolName}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Priority</label>
            <Select value={ticketPriority} onChange={(e) => setTicketPriority(e.target.value as SupportTicket["priority"])}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Title</label>
            <Input value={ticketTitle} onChange={(e) => setTicketTitle(e.target.value)} placeholder="Briefly describe the issue" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Message</label>
            <textarea
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-oasis-400 focus:ring-4 focus:ring-oasis-100"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        title="Request support access"
        description="Read-only, time-boxed, and fully logged - the school must approve before access begins."
        maxWidth={460}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRequestOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitAccessRequest}>Send request</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">School</label>
            <Select value={reqSchoolId} onChange={(e) => setReqSchoolId(e.target.value)}>
              <option value="">Select a school</option>
              {approvedSchools.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.schoolName}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Duration</label>
            <Select value={reqDuration} onChange={(e) => setReqDuration(Number(e.target.value) as 30 | 60)}>
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Reason</label>
            <textarea
              value={reqReason}
              onChange={(e) => setReqReason(e.target.value)}
              rows={3}
              placeholder="Why do you need access?"
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-oasis-400 focus:ring-4 focus:ring-oasis-100"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
