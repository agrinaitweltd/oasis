// Domain types for the OASIS platform-admin console. This is signed into
// by OASIS/Swivel Technologies staff to administer the PLATFORM - schools,
// subscriptions, billing, uptime, support - not any individual school's
// day-to-day data (students, parents, fees, attendance, grades). No type
// here should ever carry student/parent/teacher personal records; that
// data belongs to each school's own system, out of reach of this console
// except via the time-boxed support-access mechanism below.
//
// Shaped so a future Supabase table (same field names) can replace the
// mock data in lib/mock/* without changing anything that consumes these
// types.

export type School = {
  id: string;
  name: string;
  district: string;
  logoInitials: string;
};

// --- Schools (metadata only) ------------------------------------------------

export type SchoolRequestStatus = "pending_review" | "approved" | "rejected" | "more_info_requested" | "suspended";
export type SubscriptionPlanKey = "starter" | "growth" | "scale" | "trial";
export type SubscriptionStatus = "trial" | "active" | "expiring" | "cancelled" | "suspended";

export type SchoolRequest = {
  id: string;
  schoolName: string;
  schoolCode: string;
  logoInitials: string;
  address: string;
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  district: string;
  schoolType: string;
  studentBand: string;
  modulesRequested: string[];
  requestedAt: string;
  createdAt: string;
  status: SchoolRequestStatus;
  // Present once a school is approved and becomes a subscriber.
  plan: SubscriptionPlanKey | null;
  subscriptionStatus: SubscriptionStatus | null;
  expiryDate: string | null;
  storageUsedMb: number;
  storageLimitMb: number;
  lastLoginAt: string | null;
  version: string;
};

// --- API keys ----------------------------------------------------------------

export type ApiKeyStatus = "active" | "revoked";

export type ApiKey = {
  id: string;
  schoolRequestId: string;
  label: string;
  keyPreview: string;
  createdAt: string;
  lastUsedAt: string | null;
  status: ApiKeyStatus;
};

// --- Subscriptions & plans ---------------------------------------------------

export type SubscriptionPlan = {
  id: string;
  key: SubscriptionPlanKey;
  name: string;
  priceMonthlyUgx: number;
  studentRange: string;
  features: string[];
  schoolsOnPlan: number;
};

export type Invoice = {
  id: string;
  invoiceNo: string;
  schoolId: string;
  amountUgx: number;
  issuedAt: string;
  dueAt: string;
  status: "paid" | "pending" | "overdue" | "failed";
};

// --- Platform finance ---------------------------------------------------------

export type RevenuePoint = { label: string; revenueUgx: number };

// --- Platform / system -------------------------------------------------------

export type PlatformEventType =
  | "school_created"
  | "subscription_renewed"
  | "subscription_cancelled"
  | "admin_invited"
  | "backup_completed"
  | "feature_enabled"
  | "maintenance"
  | "deployment";

export type PlatformEvent = {
  id: string;
  type: PlatformEventType;
  message: string;
  timestamp: string;
  actor: string;
};

export type FeatureFlag = {
  id: string;
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  rolloutPercent: number;
};

export type PlatformAnnouncement = {
  id: string;
  title: string;
  body: string;
  audience: "all" | "trial" | "active";
  publishedAt: string;
  status: "published" | "scheduled" | "draft";
};

// --- Security -----------------------------------------------------------------

export type SecurityLogType = "failed_login" | "suspicious_activity" | "ip_blocked" | "session_revoked" | "2fa_change";

export type SecurityLogEntry = {
  id: string;
  type: SecurityLogType;
  detail: string;
  ipAddress: string;
  location: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
};

export type BlockedIp = {
  id: string;
  ipAddress: string;
  reason: string;
  blockedAt: string;
};

// --- Analytics (aggregate only, never identifiable) ---------------------------

export type PlatformAnalytics = {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  dailyUptimePct: number;
  loginsThisMonth: number;
  smsSentThisMonth: number;
  avgAttendancePct: number;
};

// --- Support tickets ------------------------------------------------------------

export type TicketStatus = "open" | "pending" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type SupportTicket = {
  id: string;
  schoolName: string;
  title: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
};

// --- Notifications --------------------------------------------------------------

export type PlatformNotification = {
  id: string;
  title: string;
  body: string;
  audience: "one" | "multiple" | "all";
  targetSchools: string[];
  sentAt: string;
  status: "sent" | "scheduled" | "draft";
};

// --- Integrations ------------------------------------------------------------

export type IntegrationCategory = "payments" | "email" | "sms" | "whatsapp" | "google";

export type Integration = {
  id: string;
  name: string;
  category: IntegrationCategory;
  status: "connected" | "not_connected" | "error";
  connectedSchools: number;
};

// --- Backups -------------------------------------------------------------------

export type BackupStatus = "completed" | "running" | "failed";

export type BackupRecord = {
  id: string;
  schoolName: string;
  triggeredBy: string;
  startedAt: string;
  completedAt: string | null;
  status: BackupStatus;
  sizeMb: number;
};

// --- Audit log -------------------------------------------------------------------

export type AuditLogEntry = PlatformEvent;

// --- School administrators (accounts only, not internal users) -------------------

export type SchoolAdminStatus = "active" | "disabled";

export type SchoolAdminAccount = {
  id: string;
  schoolId: string;
  schoolName: string;
  name: string;
  email: string;
  status: SchoolAdminStatus;
  lastLoginAt: string | null;
  twoFactorEnabled: boolean;
};

// --- Developer tools ---------------------------------------------------------

export type ErrorLogEntry = {
  id: string;
  message: string;
  service: string;
  level: "error" | "warning";
  occurredAt: string;
  count: number;
};

export type DeploymentRecord = {
  id: string;
  version: string;
  environment: "production" | "staging";
  status: "success" | "failed" | "in_progress";
  deployedAt: string;
  deployedBy: string;
};

export type QueueStatus = {
  id: string;
  name: string;
  pending: number;
  processing: number;
  failed: number;
};

// --- Temporary support access ---------------------------------------------------
// A time-boxed, school-approved, fully logged mechanism for staff to get
// read-only access into a school's data for support purposes - the only
// sanctioned way this console ever touches school-internal records.

export type SupportAccessStatus = "pending" | "approved" | "denied" | "expired" | "revoked";

export type SupportAccessAction = {
  id: string;
  action: string;
  timestamp: string;
};

export type SupportAccessRequest = {
  id: string;
  schoolId: string;
  schoolName: string;
  requestedBy: string;
  reason: string;
  ticketId: string | null;
  durationMinutes: 30 | 60;
  status: SupportAccessStatus;
  requestedAt: string;
  approvedAt: string | null;
  expiresAt: string | null;
  actions: SupportAccessAction[];
};
