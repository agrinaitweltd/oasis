import type {
  SubscriptionPlan,
  Invoice,
  RevenuePoint,
  PlatformEvent,
  FeatureFlag,
  PlatformAnnouncement,
  SecurityLogEntry,
  BlockedIp,
  PlatformAnalytics,
  SupportTicket,
  PlatformNotification,
  Integration,
  BackupRecord,
  SchoolAdminAccount,
  ErrorLogEntry,
  DeploymentRecord,
  QueueStatus,
  SupportAccessRequest,
} from "@/types/portal";
import { makeRng } from "./rand";
import { schoolRequests } from "./school-requests";

const rng = makeRng(31415);

const approvedSchools = schoolRequests.filter((r) => r.status === "approved");

// --- Subscription plans -------------------------------------------------------

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan_starter",
    key: "starter",
    name: "Starter",
    priceMonthlyUgx: 3000,
    studentRange: "50–250 students",
    features: ["Student Information System", "Attendance", "Finance & Fees", "Parent Portal"],
    schoolsOnPlan: schoolRequests.filter((r) => r.plan === "starter").length,
  },
  {
    id: "plan_growth",
    key: "growth",
    name: "Growth",
    priceMonthlyUgx: 2200,
    studentRange: "250–1,000 students",
    features: ["Everything in Starter", "Multi-Campus Dashboard", "School Analytics"],
    schoolsOnPlan: schoolRequests.filter((r) => r.plan === "growth").length,
  },
  {
    id: "plan_scale",
    key: "scale",
    name: "Scale",
    priceMonthlyUgx: 1400,
    studentRange: "1,000–2,500 students",
    features: ["Everything in Growth", "Priority Support", "Custom Integrations"],
    schoolsOnPlan: schoolRequests.filter((r) => r.plan === "scale").length,
  },
];

export const invoices: Invoice[] = approvedSchools.map((s, i) => ({
  id: `pinv_${i}`,
  invoiceNo: `PL-${String(9000 + i)}`,
  schoolId: s.id,
  amountUgx: rng.int(400, 2200) * 1000,
  issuedAt: rng.dateWithinDays(45),
  dueAt: rng.dateWithinDays(-15),
  status: rng.pick(["paid", "paid", "paid", "pending", "overdue", "failed"] as const),
}));

export function totalMrrUgx() {
  return invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amountUgx, 0);
}
export function outstandingInvoices() {
  return invoices.filter((i) => i.status === "pending" || i.status === "overdue");
}
export function failedPayments() {
  return invoices.filter((i) => i.status === "failed");
}

export const revenueTrend: RevenuePoint[] = Array.from({ length: 8 }, (_, i) => ({
  label: `Wk ${i + 1}`,
  revenueUgx: Math.round(totalMrrUgx() * ((i + 3) / 42)),
}));

// --- Platform events / audit log ----------------------------------------------

const EVENT_TEMPLATES: { type: PlatformEvent["type"]; message: (s: string) => string; actor: string }[] = [
  { type: "school_created", message: (s) => `${s} was created and marked pending review`, actor: "Registration System" },
  { type: "subscription_renewed", message: (s) => `${s}'s subscription renewed for another term`, actor: "Billing System" },
  { type: "subscription_cancelled", message: (s) => `${s} cancelled their subscription`, actor: "Billing System" },
  { type: "admin_invited", message: (s) => `A new admin was invited for ${s}`, actor: "Support Team" },
  { type: "backup_completed", message: (s) => `Nightly backup completed for ${s}`, actor: "Backup Service" },
  { type: "feature_enabled", message: () => `Feature flag "New Report Cards" enabled for 25% rollout`, actor: "Platform Team" },
  { type: "maintenance", message: () => `Scheduled maintenance window completed with no downtime`, actor: "Platform Team" },
  { type: "deployment", message: () => `Deployed version 2.4.1 to production`, actor: "CI/CD" },
];

export const platformEvents: PlatformEvent[] = Array.from({ length: 30 }, (_, i) => {
  const template = rng.pick(EVENT_TEMPLATES);
  const school = rng.pick(schoolRequests).schoolName;
  return {
    id: `evt_${i}`,
    type: template.type,
    message: template.message(school),
    timestamp: rng.dateWithinDays(30),
    actor: template.actor,
  };
}).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

export const auditLog = platformEvents;

// --- Platform / feature flags / announcements ----------------------------------

export const featureFlags: FeatureFlag[] = [
  { id: "ff_1", key: "new_report_cards", label: "New Report Cards", description: "Redesigned report card generation with custom templates.", enabled: true, rolloutPercent: 25 },
  { id: "ff_2", key: "whatsapp_notifications", label: "WhatsApp Notifications", description: "Send fee reminders and announcements via WhatsApp.", enabled: true, rolloutPercent: 100 },
  { id: "ff_3", key: "ai_timetable", label: "AI Timetable Generator", description: "Auto-generate conflict-free timetables.", enabled: false, rolloutPercent: 0 },
  { id: "ff_4", key: "offline_mode", label: "Offline Mode", description: "Allow attendance capture without internet connectivity.", enabled: false, rolloutPercent: 10 },
  { id: "ff_5", key: "parent_app_v2", label: "Parent App v2", description: "Redesigned parent mobile experience.", enabled: true, rolloutPercent: 60 },
];

export const platformAnnouncements: PlatformAnnouncement[] = [
  { id: "pa_1", title: "Scheduled maintenance - 10 Aug", body: "OASIS will be briefly unavailable for upgrades between 1-2am EAT.", audience: "all", publishedAt: "2026-08-02", status: "published" },
  { id: "pa_2", title: "New: WhatsApp reminders", body: "You can now send fee reminders directly over WhatsApp.", audience: "active", publishedAt: "2026-07-20", status: "published" },
  { id: "pa_3", title: "Trial extension available", body: "Reply to this message if you'd like a 2-week trial extension.", audience: "trial", publishedAt: "2026-08-10", status: "scheduled" },
];

export const globalSettings = {
  defaultAcademicYearStart: "February",
  defaultTermsPerYear: 3,
  defaultCurrency: "UGX",
  defaultTimezone: "Africa/Kampala",
  maintenanceMode: false,
  platformVersion: "2.4.1",
};

// --- Security -------------------------------------------------------------------

const COUNTRIES = ["Kampala, UG", "Nairobi, KE", "Unknown", "Lagos, NG", "Kigali, RW"];

export const securityLog: SecurityLogEntry[] = Array.from({ length: 20 }, (_, i) => {
  const type = rng.pick(["failed_login", "failed_login", "suspicious_activity", "ip_blocked", "session_revoked", "2fa_change"] as const);
  const detail: Record<typeof type, string> = {
    failed_login: "3 failed login attempts for admin@" + rng.pick(schoolRequests).schoolCode.toLowerCase() + ".oasis.co.ug",
    suspicious_activity: "Unusual API request volume detected from a single key",
    ip_blocked: "IP address blocked after repeated failed attempts",
    session_revoked: "Session revoked after password change",
    "2fa_change": "Two-factor authentication was disabled on an admin account",
  } as any;
  return {
    id: `sec_${i}`,
    type,
    detail: detail[type],
    ipAddress: `${rng.int(10, 220)}.${rng.int(0, 255)}.${rng.int(0, 255)}.${rng.int(1, 254)}`,
    location: rng.pick(COUNTRIES),
    timestamp: rng.dateWithinDays(14),
    severity: rng.pick(["low", "medium", "high"] as const),
  };
});

export const blockedIps: BlockedIp[] = Array.from({ length: 5 }, (_, i) => ({
  id: `ip_${i}`,
  ipAddress: `${rng.int(10, 220)}.${rng.int(0, 255)}.${rng.int(0, 255)}.${rng.int(1, 254)}`,
  reason: rng.pick(["Repeated failed logins", "Suspicious API usage", "Manually blocked by staff"]),
  blockedAt: rng.dateWithinDays(20),
}));

// --- Analytics (aggregate only) -------------------------------------------------

export const platformAnalytics: PlatformAnalytics = {
  totalStudents: 24850,
  totalTeachers: 1240,
  totalParents: 19200,
  dailyUptimePct: 99.6,
  loginsThisMonth: 182400,
  smsSentThisMonth: 64200,
  avgAttendancePct: 92,
};

// --- Support tickets --------------------------------------------------------------

const TICKET_TITLES = [
  "Unable to generate report cards",
  "SMS credits not deducting correctly",
  "Parent portal login issue",
  "Request to increase storage limit",
  "Timetable clash after import",
  "Need help migrating from Excel",
  "API key not working in sandbox",
  "Billing question about termly plan",
];

export const supportTickets: SupportTicket[] = TICKET_TITLES.map((title, i) => ({
  id: `tkt_${i}`,
  schoolName: rng.pick(schoolRequests).schoolName,
  title,
  message: "Full details were provided by the school when they raised this ticket.",
  status: rng.pick(["open", "pending", "resolved", "closed"] as const),
  priority: rng.pick(["low", "medium", "high", "urgent"] as const),
  createdAt: rng.dateWithinDays(21),
  updatedAt: rng.dateWithinDays(3),
}));

// --- Notifications ------------------------------------------------------------

export const platformNotifications: PlatformNotification[] = [
  { id: "not_1", title: "Fee reminder templates updated", body: "You can now customise SMS fee reminder templates.", audience: "all", targetSchools: [], sentAt: "2026-07-25", status: "sent" },
  { id: "not_2", title: "Your trial ends in 5 days", body: "Upgrade now to keep access to all your data.", audience: "multiple", targetSchools: schoolRequests.filter((r) => r.subscriptionStatus === "trial").map((r) => r.schoolName), sentAt: "2026-08-01", status: "sent" },
  { id: "not_3", title: "Planned downtime notice", body: "Brief maintenance window this weekend.", audience: "all", targetSchools: [], sentAt: "2026-08-08", status: "scheduled" },
];

// --- Integrations ---------------------------------------------------------------

export const integrations: Integration[] = [
  { id: "int_1", name: "MTN Mobile Money", category: "payments", status: "connected", connectedSchools: 34 },
  { id: "int_2", name: "Airtel Money", category: "payments", status: "connected", connectedSchools: 21 },
  { id: "int_3", name: "Flutterwave", category: "payments", status: "connected", connectedSchools: 12 },
  { id: "int_4", name: "SendGrid", category: "email", status: "connected", connectedSchools: 48 },
  { id: "int_5", name: "Africa's Talking (SMS)", category: "sms", status: "connected", connectedSchools: 45 },
  { id: "int_6", name: "WhatsApp Business API", category: "whatsapp", status: "not_connected", connectedSchools: 0 },
  { id: "int_7", name: "Google Workspace", category: "google", status: "connected", connectedSchools: 18 },
  { id: "int_8", name: "Google Classroom", category: "google", status: "error", connectedSchools: 3 },
];

// --- Backups ----------------------------------------------------------------------

export const backups: BackupRecord[] = Array.from({ length: 14 }, (_, i) => {
  const status = rng.pick(["completed", "completed", "completed", "running", "failed"] as const);
  const startedAt = rng.dateWithinDays(20);
  return {
    id: `bak_${i}`,
    schoolName: rng.pick(schoolRequests).schoolName,
    triggeredBy: rng.pick(["System (nightly)", "System (nightly)", "Admin User"]),
    startedAt,
    completedAt: status === "completed" ? startedAt : null,
    status,
    sizeMb: rng.int(80, 3200),
  };
});

// --- School administrators ------------------------------------------------------

export const schoolAdmins: SchoolAdminAccount[] = approvedSchools.slice(0, 14).map((s, i) => ({
  id: `sa_${i}`,
  schoolId: s.id,
  schoolName: s.schoolName,
  name: s.contactName,
  email: s.contactEmail,
  status: rng.bool(0.9) ? "active" : "disabled",
  lastLoginAt: s.lastLoginAt,
  twoFactorEnabled: rng.bool(0.55),
}));

// --- Developer tools --------------------------------------------------------------

export const errorLogs: ErrorLogEntry[] = [
  { id: "err_1", message: "Timeout connecting to SMS gateway", service: "notifications-service", level: "error", occurredAt: rng.dateWithinDays(2), count: 14 },
  { id: "err_2", message: "PDF generation failed for report card batch", service: "reports-service", level: "error", occurredAt: rng.dateWithinDays(5), count: 3 },
  { id: "err_3", message: "Rate limit approaching for Flutterwave webhook", service: "billing-service", level: "warning", occurredAt: rng.dateWithinDays(1), count: 27 },
  { id: "err_4", message: "Slow query on attendance aggregation", service: "core-api", level: "warning", occurredAt: rng.dateWithinDays(4), count: 9 },
];

export const deployments: DeploymentRecord[] = [
  { id: "dep_1", version: "2.4.1", environment: "production", status: "success", deployedAt: rng.dateWithinDays(1), deployedBy: "CI/CD" },
  { id: "dep_2", version: "2.4.1-rc2", environment: "staging", status: "success", deployedAt: rng.dateWithinDays(2), deployedBy: "CI/CD" },
  { id: "dep_3", version: "2.4.0", environment: "production", status: "success", deployedAt: rng.dateWithinDays(9), deployedBy: "CI/CD" },
  { id: "dep_4", version: "2.3.9", environment: "production", status: "failed", deployedAt: rng.dateWithinDays(16), deployedBy: "CI/CD" },
];

export const queues: QueueStatus[] = [
  { id: "q_1", name: "sms-delivery", pending: 42, processing: 5, failed: 1 },
  { id: "q_2", name: "email-delivery", pending: 12, processing: 2, failed: 0 },
  { id: "q_3", name: "report-generation", pending: 3, processing: 1, failed: 0 },
  { id: "q_4", name: "backups", pending: 0, processing: 1, failed: 0 },
];

// --- Temporary support access -----------------------------------------------------

export const supportAccessRequests: SupportAccessRequest[] = [
  {
    id: "sar_1",
    schoolId: approvedSchools[0]?.id ?? "req_0",
    schoolName: approvedSchools[0]?.schoolName ?? "Taibah International School",
    requestedBy: "admin",
    reason: "Investigating ticket about report card generation failure.",
    ticketId: "tkt_0",
    durationMinutes: 30,
    status: "approved",
    requestedAt: rng.dateWithinDays(2),
    approvedAt: rng.dateWithinDays(2),
    expiresAt: rng.dateWithinDays(-0.02) /* effectively expired for demo */,
    actions: [
      { id: "a1", action: "Access requested", timestamp: rng.dateWithinDays(2) },
      { id: "a2", action: "Access approved by school admin", timestamp: rng.dateWithinDays(2) },
      { id: "a3", action: "Viewed report card export logs (read-only)", timestamp: rng.dateWithinDays(2) },
      { id: "a4", action: "Access expired automatically", timestamp: rng.dateWithinDays(1) },
    ],
  },
];
