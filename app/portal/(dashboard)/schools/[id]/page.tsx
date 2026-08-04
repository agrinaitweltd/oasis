"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  Building2,
  Check,
  Copy,
  FileText,
  KeyRound,
  MessageCircleQuestion,
  Plus,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { Modal } from "@/components/portal/ui/Modal";
import { Input } from "@/components/portal/ui/Input";
import { getSchoolRequestById, apiKeysForRequest } from "@/lib/mock/school-requests";
import { documentRequirements } from "@/lib/onboarding-types";
import { applyAdminAction, type AdminActionType } from "@/lib/admin-actions";
import type { ApiKey, SchoolRequestStatus } from "@/types/portal";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { key: "overview", label: "Overview", icon: Building2 },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "keys", label: "API Keys", icon: KeyRound },
  { key: "actions", label: "Actions", icon: MessageCircleQuestion },
] as const;

const STAGE_TONE: Record<SchoolRequestStatus, "neutral" | "info" | "warning" | "success" | "danger"> = {
  pending_review: "warning",
  approved: "success",
  rejected: "danger",
  more_info_requested: "info",
  suspended: "neutral",
};
const STAGE_LABEL: Record<SchoolRequestStatus, string> = {
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  more_info_requested: "More Info Requested",
  suspended: "Suspended",
};

function fakeKeySuffix() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 24; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export default function SchoolRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("overview");

  const request = getSchoolRequestById(params.id);
  const [status, setStatus] = useState<SchoolRequestStatus | null>(request?.status ?? null);
  const [keys, setKeys] = useState<ApiKey[]>(() => (request ? apiKeysForRequest(request.id) : []));
  const [newKeyOpen, setNewKeyOpen] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [revealedKey, setRevealedKey] = useState<{ label: string; full: string } | null>(null);

  if (!request || !status) {
    return (
      <div>
        <PageHeader title="School not found" breadcrumbs={[{ label: "Schools", href: "/portal/schools" }, { label: "Not found" }]} />
        <EmptyState title="We couldn't find that school request" />
      </div>
    );
  }

  function runAction(action: AdminActionType) {
    const result = applyAdminAction({ applicationId: request!.id, action });
    // applyAdminAction's return type is shared with the onboarding wizard's
    // ApplicationStatus (which also has "draft"), but action-derived results
    // are always one of the four non-draft statuses below.
    setStatus(result.status as SchoolRequestStatus);
    const messages: Record<AdminActionType, string> = {
      approve: `${request!.schoolName} has been approved and can now be onboarded.`,
      reject: `${request!.schoolName}'s request has been rejected.`,
      request_more_info: `More information has been requested from ${request!.schoolName}.`,
      suspend: `${request!.schoolName}'s access has been suspended.`,
    };
    toast(action === "approve" ? "success" : action === "reject" || action === "suspend" ? "error" : "info", "Status updated", messages[action]);
  }

  function generateKey() {
    const full = `oas_live_${fakeKeySuffix()}`;
    const key: ApiKey = {
      id: `key_new_${Date.now()}`,
      schoolRequestId: request!.id,
      label: newKeyLabel.trim() || "New key",
      keyPreview: `${full.slice(0, 12)}••••••••${full.slice(-4)}`,
      createdAt: new Date().toISOString().slice(0, 10),
      lastUsedAt: null,
      status: "active",
    };
    setKeys((prev) => [key, ...prev]);
    setRevealedKey({ label: key.label, full });
    setNewKeyOpen(false);
    setNewKeyLabel("");
  }

  function revokeKey(id: string) {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: "revoked" } : k)));
    toast("info", "API key revoked", "This key can no longer be used to authenticate requests.");
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push("/portal/schools")}
        className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-oasis-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to schools
      </button>

      <Card className="mb-5">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{request.schoolName}</h1>
              <Badge tone={STAGE_TONE[status]}>{STAGE_LABEL[status]}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {request.district} District &middot; {request.schoolType} &middot; Requested {request.requestedAt}
            </p>
          </div>
          {status === "pending_review" && (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => runAction("request_more_info")}>
                Request Info
              </Button>
              <Button variant="danger" onClick={() => runAction("reject")}>
                Reject
              </Button>
              <Button onClick={() => runAction("approve")}>Approve</Button>
            </div>
          )}
        </div>
      </Card>

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

      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader title="Primary contact" />
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <Detail label="Name" value={request.contactName} />
              <Detail label="Role" value={request.contactRole} />
              <Detail label="Email" value={request.contactEmail} />
              <Detail label="Phone" value={request.contactPhone} />
            </dl>
          </Card>
          <Card>
            <CardHeader title="School profile" />
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <Detail label="School Type" value={request.schoolType} />
              <Detail label="Student Population" value={request.studentBand} />
              <Detail label="District" value={request.district} />
              <Detail label="Requested On" value={request.requestedAt} />
            </dl>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader title="Modules requested" />
            <div className="flex flex-wrap gap-1.5">
              {request.modulesRequested.map((m) => (
                <Badge key={m} tone="info">
                  {m}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "documents" && (
        <Card className="p-0">
          <div className="divide-y divide-slate-50">
            {documentRequirements.map((doc, i) => {
              const uploaded = i % 3 !== 2; // mock: most documents present, a few missing
              return (
                <div key={doc.key} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", uploaded ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {doc.label} {doc.required && <span className="text-rose-400">*</span>}
                      </p>
                      <p className="text-xs text-slate-400">{doc.description}</p>
                    </div>
                  </div>
                  <Badge tone={uploaded ? "success" : "neutral"}>{uploaded ? "Uploaded" : "Missing"}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {tab === "keys" && (
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <p className="text-sm text-slate-500">
              {status === "approved" ? "Issue API keys so this school can integrate with OASIS." : "API keys can be issued once this school is approved."}
            </p>
            {status === "approved" && (
              <Button size="sm" onClick={() => setNewKeyOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> Generate key
              </Button>
            )}
          </div>
          {keys.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={KeyRound} title="No API keys issued yet" description="Generate a key once this school has been approved." />
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {keys.map((k) => (
                <div key={k.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{k.label}</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-400">{k.keyPreview}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Created {k.createdAt} &middot; {k.lastUsedAt ? `Last used ${k.lastUsedAt}` : "Never used"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={k.status === "active" ? "success" : "neutral"}>{k.status === "active" ? "Active" : "Revoked"}</Badge>
                    {k.status === "active" && (
                      <Button variant="ghost" size="sm" onClick={() => revokeKey(k.id)}>
                        <Ban className="h-3.5 w-3.5" /> Revoke
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "actions" && (
        <Card>
          <CardHeader title="Review actions" subtitle="Change this school's status. This mirrors what a real review workflow will call." />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ActionButton
              label="Approve"
              description="Grant access and allow document upload + API key issuance."
              icon={Check}
              tone="success"
              onClick={() => runAction("approve")}
              disabled={status === "approved"}
            />
            <ActionButton
              label="Request more info"
              description="Ask the school to provide additional details before deciding."
              icon={MessageCircleQuestion}
              tone="info"
              onClick={() => runAction("request_more_info")}
              disabled={status === "more_info_requested"}
            />
            <ActionButton
              label="Reject"
              description="Decline this request. The school can re-apply later."
              icon={X}
              tone="danger"
              onClick={() => runAction("reject")}
              disabled={status === "rejected"}
            />
            <ActionButton
              label="Suspend"
              description="Temporarily revoke an approved school's access."
              icon={Ban}
              tone="neutral"
              onClick={() => runAction("suspend")}
              disabled={status !== "approved"}
            />
          </div>
        </Card>
      )}

      <Modal
        open={newKeyOpen}
        onClose={() => setNewKeyOpen(false)}
        title="Generate API key"
        description={`For ${request.schoolName}`}
        maxWidth={420}
        footer={
          <>
            <Button variant="secondary" onClick={() => setNewKeyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={generateKey}>Generate key</Button>
          </>
        }
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Key label</label>
          <Input placeholder="e.g. Production" value={newKeyLabel} onChange={(e) => setNewKeyLabel(e.target.value)} />
        </div>
      </Modal>

      <Modal
        open={!!revealedKey}
        onClose={() => setRevealedKey(null)}
        title="API key generated"
        description="Copy this key now - you won't be able to see it again."
        maxWidth={480}
        footer={
          <Button onClick={() => setRevealedKey(null)}>Done</Button>
        }
      >
        {revealedKey && (
          <div>
            <p className="mb-1.5 text-xs font-semibold text-slate-600">{revealedKey.label}</p>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-slate-700">{revealedKey.full}</code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(revealedKey.full);
                  toast("success", "Copied to clipboard", "");
                }}
                className="flex-shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                aria-label="Copy key"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="mt-0.5 font-medium text-slate-800">{value}</dd>
    </div>
  );
}

function ActionButton({
  label,
  description,
  icon: Icon,
  tone,
  onClick,
  disabled,
}: {
  label: string;
  description: string;
  icon: typeof Check;
  tone: "success" | "info" | "danger" | "neutral";
  onClick: () => void;
  disabled?: boolean;
}) {
  const toneClasses: Record<string, string> = {
    success: "hover:border-emerald-300 hover:bg-emerald-50",
    info: "hover:border-sky-300 hover:bg-sky-50",
    danger: "hover:border-rose-300 hover:bg-rose-50",
    neutral: "hover:border-slate-300 hover:bg-slate-50",
  };
  const iconClasses: Record<string, string> = {
    success: "bg-emerald-50 text-emerald-600",
    info: "bg-sky-50 text-sky-600",
    danger: "bg-rose-50 text-rose-600",
    neutral: "bg-slate-100 text-slate-500",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-40",
        !disabled && toneClasses[tone]
      )}
    >
      <span className={cn("flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl", iconClasses[tone])}>
        <Icon className="h-4.5 w-4.5" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
      </span>
    </button>
  );
}
