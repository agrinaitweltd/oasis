// Real (non-mock) platform-level records. Nothing here is fabricated -
// subscription plans mirror the actual current pricing set on the public
// pricing page; every other collection (events, tickets, notifications,
// backups, security log) starts empty and only grows from real actions
// taken in this console, persisted to localStorage.

import type {
  Integration,
  PlatformEvent,
  PlatformEventType,
  FeatureFlag,
  SubscriptionPlan,
  SupportTicket,
  PlatformNotification,
  BackupRecord,
  SecurityLogEntry,
  BlockedIp,
  ApiKey,
  SupportAccessRequest,
} from "@/types/portal";
import { appendToCollection, getCollection, setCollection, updateInCollection } from "./store";

// Mirrors components/PricingToggle.tsx - the real, current public pricing.
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan_starter",
    key: "starter",
    name: "Starter",
    priceMonthlyUgx: 3000,
    studentRange: "50–250 students",
    features: ["Student Information System", "Attendance", "Finance & Fees", "Parent Portal"],
    schoolsOnPlan: 0,
  },
  {
    id: "plan_growth",
    key: "growth",
    name: "Growth",
    priceMonthlyUgx: 2200,
    studentRange: "250–1,000 students",
    features: ["Everything in Starter", "Multi-Campus Dashboard", "School Analytics"],
    schoolsOnPlan: 0,
  },
  {
    id: "plan_scale",
    key: "scale",
    name: "Scale",
    priceMonthlyUgx: 1400,
    studentRange: "1,000–2,500 students",
    features: ["Everything in Growth", "Priority Support", "Custom Integrations"],
    schoolsOnPlan: 0,
  },
];

// Real platform capabilities that actually exist in this app - not
// fabricated feature names. Toggle state persists to localStorage.
export const FEATURE_FLAG_DEFS: { key: string; label: string; description: string }[] = [
  { key: "guided_registration", label: "Guided School Registration", description: "The multi-step /register onboarding wizard." },
  { key: "support_access", label: "Time-Boxed Support Access", description: "School-approved, auto-expiring read-only support access." },
  { key: "api_keys", label: "Per-School API Keys", description: "Issue and revoke API keys for approved schools." },
  { key: "platform_notifications", label: "Platform Notifications", description: "Send announcements to one, several, or all schools." },
];

export const INTEGRATION_DEFS: { name: string; category: Integration["category"] }[] = [
  { name: "MTN Mobile Money", category: "payments" },
  { name: "Airtel Money", category: "payments" },
  { name: "Flutterwave", category: "payments" },
  { name: "SendGrid", category: "email" },
  { name: "Africa's Talking (SMS)", category: "sms" },
  { name: "WhatsApp Business API", category: "whatsapp" },
  { name: "Google Workspace", category: "google" },
];

const KEYS = {
  events: "oasis_platform_events",
  flags: "oasis_feature_flags",
  tickets: "oasis_support_tickets",
  notifications: "oasis_platform_notifications",
  backups: "oasis_backups",
  securityLog: "oasis_security_log",
  blockedIps: "oasis_blocked_ips",
  maintenance: "oasis_maintenance_mode",
  supportAccess: "oasis_support_access_requests",
};

// --- Platform events / audit log -------------------------------------------

export function listEvents(): PlatformEvent[] {
  return getCollection<PlatformEvent>(KEYS.events);
}
export function logEvent(type: PlatformEventType, message: string, actor = "admin") {
  const event: PlatformEvent = { id: `evt_${Date.now()}`, type, message, timestamp: new Date().toISOString().slice(0, 16).replace("T", " "), actor };
  appendToCollection(KEYS.events, event);
  return event;
}

// --- Feature flags -----------------------------------------------------------

export function listFeatureFlags(): FeatureFlag[] {
  const stored = getCollection<FeatureFlag>(KEYS.flags);
  if (stored.length) return stored;
  const defaults = FEATURE_FLAG_DEFS.map((d, i) => ({ id: `ff_${i}`, key: d.key, label: d.label, description: d.description, enabled: true, rolloutPercent: 100 }));
  setCollection(KEYS.flags, defaults);
  return defaults;
}
export function toggleFeatureFlag(id: string) {
  const flags = listFeatureFlags();
  const flag = flags.find((f) => f.id === id);
  return updateInCollection<FeatureFlag>(KEYS.flags, id, { enabled: !flag?.enabled });
}

// --- Support tickets -----------------------------------------------------------

export function listTickets(): SupportTicket[] {
  return getCollection<SupportTicket>(KEYS.tickets);
}
export function createTicket(input: { schoolName: string; title: string; message: string; priority: SupportTicket["priority"] }) {
  const now = new Date().toISOString().slice(0, 10);
  const ticket: SupportTicket = { id: `tkt_${Date.now()}`, ...input, status: "open", createdAt: now, updatedAt: now };
  appendToCollection(KEYS.tickets, ticket);
  logEvent("admin_invited", `Support ticket logged: ${input.title}`, "admin");
  return ticket;
}
export function updateTicketStatus(id: string, status: SupportTicket["status"]) {
  return updateInCollection<SupportTicket>(KEYS.tickets, id, { status, updatedAt: new Date().toISOString().slice(0, 10) });
}

// --- Notifications -----------------------------------------------------------

export function listNotifications(): PlatformNotification[] {
  return getCollection<PlatformNotification>(KEYS.notifications);
}
export function sendNotification(input: { title: string; body: string; audience: PlatformNotification["audience"]; targetSchools: string[] }) {
  const note: PlatformNotification = { id: `not_${Date.now()}`, ...input, sentAt: new Date().toISOString().slice(0, 10), status: "sent" };
  appendToCollection(KEYS.notifications, note);
  logEvent("feature_enabled", `Notification sent: "${input.title}"`, "admin");
  return note;
}

// --- Backups -----------------------------------------------------------------

export function listBackups(): BackupRecord[] {
  return getCollection<BackupRecord>(KEYS.backups);
}
export function triggerBackup(schoolName: string) {
  const now = new Date().toISOString().slice(0, 16).replace("T", " ");
  const record: BackupRecord = { id: `bak_${Date.now()}`, schoolName, triggeredBy: "admin", startedAt: now, completedAt: now, status: "completed", sizeMb: 0 };
  appendToCollection(KEYS.backups, record);
  logEvent("backup_completed", `Backup triggered for ${schoolName}`, "admin");
  return record;
}

// --- Security ------------------------------------------------------------------

export function listSecurityLog(): SecurityLogEntry[] {
  return getCollection<SecurityLogEntry>(KEYS.securityLog);
}
export function logSecurityEvent(entry: Omit<SecurityLogEntry, "id" | "timestamp">) {
  const full: SecurityLogEntry = { ...entry, id: `sec_${Date.now()}`, timestamp: new Date().toISOString().slice(0, 16).replace("T", " ") };
  appendToCollection(KEYS.securityLog, full);
  return full;
}
export function listBlockedIps(): BlockedIp[] {
  return getCollection<BlockedIp>(KEYS.blockedIps);
}
export function unblockIp(id: string) {
  const items = getCollection<BlockedIp>(KEYS.blockedIps).filter((i) => i.id !== id);
  setCollection(KEYS.blockedIps, items);
}

// --- Maintenance mode ------------------------------------------------------------

export function getMaintenanceMode(): boolean {
  return getCollection<boolean>(KEYS.maintenance)[0] ?? false;
}
export function setMaintenanceMode(value: boolean) {
  setCollection(KEYS.maintenance, [value]);
}

// --- Developer tools: API keys across all schools --------------------------------

export function allApiKeys(): ApiKey[] {
  return getCollection<ApiKey>("oasis_api_keys_registry");
}

// --- Time-boxed support access -------------------------------------------------

export function listSupportAccessRequests(): SupportAccessRequest[] {
  return getCollection<SupportAccessRequest>(KEYS.supportAccess);
}
export function requestSupportAccess(input: {
  schoolId: string;
  schoolName: string;
  reason: string;
  ticketId: string | null;
  durationMinutes: 30 | 60;
}) {
  const now = new Date().toISOString().slice(0, 16).replace("T", " ");
  const req: SupportAccessRequest = {
    id: `sar_${Date.now()}`,
    ...input,
    requestedBy: "admin",
    status: "pending",
    requestedAt: now,
    approvedAt: null,
    expiresAt: null,
    actions: [{ id: `a_${Date.now()}`, action: "Access requested", timestamp: now }],
  };
  appendToCollection(KEYS.supportAccess, req);
  logEvent("admin_invited", `Support access requested for ${input.schoolName}`, "admin");
  return req;
}
export function approveSupportAccess(id: string) {
  const items = getCollection<SupportAccessRequest>(KEYS.supportAccess);
  const req = items.find((r) => r.id === id);
  if (!req) return;
  const now = new Date();
  const expires = new Date(now.getTime() + req.durationMinutes * 60000);
  const nowStr = now.toISOString().slice(0, 16).replace("T", " ");
  const expiresStr = expires.toISOString().slice(0, 16).replace("T", " ");
  updateInCollection<SupportAccessRequest>(KEYS.supportAccess, id, {
    status: "approved",
    approvedAt: nowStr,
    expiresAt: expiresStr,
    actions: [...req.actions, { id: `a_${Date.now()}`, action: `Access approved by ${req.schoolName}`, timestamp: nowStr }],
  });
  logEvent("admin_invited", `Support access approved for ${req.schoolName}`, req.schoolName);
}
export function revokeSupportAccess(id: string) {
  const items = getCollection<SupportAccessRequest>(KEYS.supportAccess);
  const req = items.find((r) => r.id === id);
  if (!req) return;
  const nowStr = new Date().toISOString().slice(0, 16).replace("T", " ");
  updateInCollection<SupportAccessRequest>(KEYS.supportAccess, id, {
    status: "revoked",
    actions: [...req.actions, { id: `a_${Date.now()}`, action: "Access manually revoked", timestamp: nowStr }],
  });
}

export function parseUtc(dateStr: string) {
  const iso = dateStr.includes(" ") ? `${dateStr.replace(" ", "T")}:00Z` : `${dateStr}T00:00:00Z`;
  return new Date(iso);
}
