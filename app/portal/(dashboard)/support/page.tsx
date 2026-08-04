"use client";

import { useState } from "react";
import { Clock, KeyRound, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { Modal } from "@/components/portal/ui/Modal";
import { Select } from "@/components/portal/ui/Input";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { supportTickets, supportAccessRequests as initialAccessRequests } from "@/lib/mock/platform";
import { schoolRequests } from "@/lib/mock/school-requests";
import type { SupportAccessRequest, SupportTicket } from "@/types/portal";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils/cn";

const PRIORITY_TONE: Record<string, "neutral" | "warning" | "danger"> = { low: "neutral", medium: "warning", high: "danger", urgent: "danger" };
const STATUS_TONE: Record<string, "info" | "warning" | "success" | "neutral"> = { open: "info", pending: "warning", resolved: "success", closed: "neutral" };
const ACCESS_TONE: Record<string, "warning" | "success" | "danger" | "neutral"> = { pending: "warning", approved: "success", denied: "danger", expired: "neutral", revoked: "danger" };

const TABS = ["Tickets", "Support Access"] as const;

// Parses both "YYYY-MM-DD" (seed data) and "YYYY-MM-DD HH:MM" (generated at
// request time via toISOString) as UTC, so expiry comparisons aren't thrown
// off by the browser's local timezone.
function parseUtc(dateStr: string) {
  const iso = dateStr.includes(" ") ? `${dateStr.replace(" ", "T")}:00Z` : `${dateStr}T00:00:00Z`;
  return new Date(iso);
}

export default function SupportPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Tickets");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [accessRequests, setAccessRequests] = useState<SupportAccessRequest[]>(initialAccessRequests);
  const [requestOpen, setRequestOpen] = useState(false);
  const [reqSchoolId, setReqSchoolId] = useState(schoolRequests.find((r) => r.status === "approved")?.id ?? "");
  const [reqDuration, setReqDuration] = useState<30 | 60>(30);
  const [reqReason, setReqReason] = useState("");

  const ticketColumns: Column<SupportTicket>[] = [
    { key: "school", header: "School", render: (t) => t.schoolName },
    { key: "title", header: "Ticket", render: (t) => t.title },
    { key: "priority", header: "Priority", render: (t) => <Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge> },
    { key: "status", header: "Status", render: (t) => <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge> },
    { key: "updated", header: "Updated", render: (t) => t.updatedAt },
  ];

  function submitAccessRequest() {
    const school = schoolRequests.find((r) => r.id === reqSchoolId);
    if (!school || !reqReason.trim()) {
      toast("error", "Missing details", "Choose a school and describe why you need access.");
      return;
    }
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    const req: SupportAccessRequest = {
      id: `sar_${Date.now()}`,
      schoolId: school.id,
      schoolName: school.schoolName,
      requestedBy: "admin",
      reason: reqReason.trim(),
      ticketId: selectedTicket?.id ?? null,
      durationMinutes: reqDuration,
      status: "pending",
      requestedAt: now,
      approvedAt: null,
      expiresAt: null,
      actions: [{ id: `a_${Date.now()}`, action: "Access requested", timestamp: now }],
    };
    setAccessRequests((prev) => [req, ...prev]);
    setRequestOpen(false);
    setReqReason("");
    toast("info", "Access requested", `Waiting for ${school.schoolName} to approve.`);
    setTab("Support Access");
  }

  function simulateApproval(id: string) {
    setAccessRequests((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const now = new Date();
        const expires = new Date(now.getTime() + r.durationMinutes * 60000);
        const nowStr = now.toISOString().slice(0, 16).replace("T", " ");
        return {
          ...r,
          status: "approved",
          approvedAt: nowStr,
          expiresAt: expires.toISOString().slice(0, 16).replace("T", " "),
          actions: [...r.actions, { id: `a_${Date.now()}`, action: `Access approved by ${r.schoolName}`, timestamp: nowStr }],
        };
      })
    );
    toast("success", "Access approved", "Read-only access is now active and will expire automatically.");
  }

  function revokeAccess(id: string) {
    setAccessRequests((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const nowStr = new Date().toISOString().slice(0, 16).replace("T", " ");
        return { ...r, status: "revoked", actions: [...r.actions, { id: `a_${Date.now()}`, action: "Access manually revoked", timestamp: nowStr }] };
      })
    );
    toast("info", "Access revoked", "");
  }

  return (
    <div>
      <PageHeader
        title="Support"
        description="School support tickets, and time-boxed, school-approved access for investigating issues."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Support" }]}
        action={
          <Button onClick={() => setRequestOpen(true)}>
            <KeyRound className="h-4 w-4" /> Request support access
          </Button>
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
          <Table columns={ticketColumns} rows={supportTickets} onRowClick={setSelectedTicket} emptyTitle="No support tickets" />
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
                          <Button size="sm" variant="secondary" onClick={() => simulateApproval(r.id)}>
                            Simulate school approval
                          </Button>
                        )}
                        {r.status === "approved" && !isExpired && (
                          <Button size="sm" variant="danger" onClick={() => revokeAccess(r.id)}>
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

      <Modal
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket?.title ?? ""}
        description={selectedTicket?.schoolName}
        maxWidth={480}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedTicket(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedTicket) {
                  const school = schoolRequests.find((s) => s.schoolName === selectedTicket.schoolName);
                  if (school) setReqSchoolId(school.id);
                  setRequestOpen(true);
                  setSelectedTicket(null);
                }
              }}
            >
              <KeyRound className="h-4 w-4" /> Request access for this school
            </Button>
          </>
        }
      >
        {selectedTicket && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge tone={PRIORITY_TONE[selectedTicket.priority]}>{selectedTicket.priority}</Badge>
              <Badge tone={STATUS_TONE[selectedTicket.status]}>{selectedTicket.status}</Badge>
            </div>
            <p className="text-slate-600">{selectedTicket.message}</p>
            <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              If this ticket needs access to specific student records, the school should share that information
              directly in this ticket rather than granting unrestricted database access.
            </p>
          </div>
        )}
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
              {schoolRequests
                .filter((r) => r.status === "approved")
                .map((r) => (
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
