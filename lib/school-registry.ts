// The real (non-mock) school directory. A school enters this registry only
// when someone actually completes the registration wizard at /register -
// there is no fabricated seed data. Persisted to localStorage since there
// is no backend yet; shaped to move to a Supabase table with minimal
// change later.

import type { ApiKey, SchoolRequest, SchoolRequestStatus } from "@/types/portal";
import type { SchoolApplication } from "./onboarding-types";
import { appendToCollection, getCollection, setCollection, updateInCollection } from "./store";

const SCHOOLS_KEY = "oasis_school_registry";
const KEYS_KEY = "oasis_api_keys_registry";

function schoolCodeFrom(name: string, existingCount: number) {
  const letters =
    name
      .replace(/[^A-Za-z ]/g, "")
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 4)
      .toUpperCase() || "SCH";
  return `${letters}-${String(100 + existingCount)}`;
}

export function listSchools(): SchoolRequest[] {
  return getCollection<SchoolRequest>(SCHOOLS_KEY);
}

export function getSchoolById(id: string): SchoolRequest | undefined {
  return listSchools().find((s) => s.id === id);
}

/** Called when a school completes the registration wizard - the only way a
 * record enters this registry. */
export function registerSchoolFromApplication(app: SchoolApplication): SchoolRequest {
  const existing = listSchools();
  const org = app.data.organisation;
  const record: SchoolRequest = {
    id: app.id,
    schoolName: org.schoolName || "Untitled School",
    schoolCode: schoolCodeFrom(org.schoolName || "school", existing.length),
    logoInitials:
      (org.schoolName || "SC")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "SC",
    address: [app.data.location.physicalAddress, app.data.location.cityTown, app.data.location.district]
      .filter(Boolean)
      .join(", "),
    contactName: org.headTeacherName || org.directorName || "—",
    contactRole: org.headTeacherName ? "Head Teacher" : "Director",
    contactEmail: org.schoolEmail || "—",
    contactPhone: org.schoolPhone || "—",
    district: app.data.location.district || "—",
    schoolType: app.data.schoolType.schoolType || "—",
    studentBand: app.data.studentNumbers.currentPopulation || "—",
    modulesRequested: app.data.modules.modules,
    requestedAt: app.submittedAt?.slice(0, 10) ?? app.updatedAt.slice(0, 10),
    createdAt: app.updatedAt.slice(0, 10),
    status: "pending_review",
    plan: null,
    subscriptionStatus: null,
    expiryDate: null,
    storageUsedMb: 0,
    storageLimitMb: 0,
    lastLoginAt: null,
    version: "2.4.1",
  };

  const next = existing.some((s) => s.id === record.id)
    ? existing.map((s) => (s.id === record.id ? record : s))
    : [record, ...existing];
  setCollection(SCHOOLS_KEY, next);
  return record;
}

export function updateSchoolStatus(id: string, status: SchoolRequestStatus) {
  const patch: Partial<SchoolRequest> =
    status === "approved"
      ? { status, plan: "starter", subscriptionStatus: "trial", storageLimitMb: 5000 }
      : { status };
  return updateInCollection<SchoolRequest>(SCHOOLS_KEY, id, patch);
}

export function setSchoolPlan(id: string, plan: SchoolRequest["plan"], subscriptionStatus: SchoolRequest["subscriptionStatus"]) {
  return updateInCollection<SchoolRequest>(SCHOOLS_KEY, id, { plan, subscriptionStatus });
}

// --- API keys, per school ------------------------------------------------

export function listApiKeys(): ApiKey[] {
  return getCollection<ApiKey>(KEYS_KEY);
}
export function apiKeysForSchool(schoolId: string): ApiKey[] {
  return listApiKeys().filter((k) => k.schoolRequestId === schoolId);
}
export function addApiKey(schoolId: string, label: string): { key: ApiKey; full: string } {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let full = "oas_live_";
  for (let i = 0; i < 24; i++) full += chars[Math.floor(Math.random() * chars.length)];
  const key: ApiKey = {
    id: `key_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    schoolRequestId: schoolId,
    label: label || "Untitled key",
    keyPreview: `${full.slice(0, 12)}••••••••${full.slice(-4)}`,
    createdAt: new Date().toISOString().slice(0, 10),
    lastUsedAt: null,
    status: "active",
  };
  appendToCollection(KEYS_KEY, key);
  return { key, full };
}
export function revokeApiKey(keyId: string) {
  return updateInCollection<ApiKey>(KEYS_KEY, keyId, { status: "revoked" });
}
