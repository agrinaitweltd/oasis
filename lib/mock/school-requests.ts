import type { ApiKey, SchoolRequest, SchoolRequestStatus, SubscriptionPlanKey, SubscriptionStatus } from "@/types/portal";
import { makeRng, fullName } from "./rand";
import { schools } from "./schools";

const rng = makeRng(9911);

const EXTRA_SCHOOLS = [
  { name: "Nakivubo Blue Primary School", district: "Kampala" },
  { name: "Buddo Junior School", district: "Wakiso" },
  { name: "Ntinda View College", district: "Kampala" },
  { name: "Mengo Senior School", district: "Kampala" },
  { name: "Jinja Progressive School", district: "Jinja" },
  { name: "Mbarara Modern Academy", district: "Mbarara" },
  { name: "Lira Excel High School", district: "Lira" },
  { name: "Masaka Green Hills School", district: "Masaka" },
];

const SCHOOL_TYPES = ["Primary", "Secondary", "Primary & Secondary", "International School", "Nursery & Primary"];
const STUDENT_BANDS = ["50 – 250", "250 – 500", "500 – 1,000", "1,000 – 2,500"];
const MODULES = ["Student Management", "Attendance", "Finance", "Parent Portal", "Timetable", "Exams", "SMS", "Library", "Transport"];
const STATUSES: SchoolRequestStatus[] = ["pending_review", "pending_review", "approved", "approved", "approved", "approved", "approved", "rejected", "more_info_requested", "suspended"];
const PLANS: SubscriptionPlanKey[] = ["starter", "growth", "scale"];
const SUB_STATUSES: SubscriptionStatus[] = ["active", "active", "active", "trial", "expiring", "cancelled"];
const VERSIONS = ["2.4.1", "2.4.0", "2.3.6", "2.3.5"];

function schoolCode(name: string, i: number) {
  const letters = name
    .replace(/[^A-Za-z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 4)
    .toUpperCase();
  return `${letters || "SCH"}-${String(100 + i)}`;
}

const candidates = [...schools.map((s) => ({ name: s.name, district: s.district })), ...EXTRA_SCHOOLS];

export const schoolRequests: SchoolRequest[] = candidates.map((c, i) => {
  const contact = fullName(rng);
  const status = rng.pick(STATUSES);
  const isApproved = status === "approved";
  const initials = c.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    id: `req_${i}`,
    schoolName: c.name,
    schoolCode: schoolCode(c.name, i),
    logoInitials: initials,
    address: `Plot ${rng.int(1, 240)}, ${c.district} Road, ${c.district}`,
    contactName: `${contact.first} ${contact.last}`,
    contactRole: rng.pick(["Head Teacher", "Director", "School Administrator", "Deputy Head Teacher"]),
    contactEmail: `${contact.first.toLowerCase()}.${contact.last.toLowerCase()}@${c.name.toLowerCase().replace(/[^a-z]+/g, "")}.co.ug`,
    contactPhone: `+256 7${rng.int(0, 9)}${rng.int(0, 9)} ${rng.int(100, 999)} ${rng.int(100, 999)}`,
    district: c.district,
    schoolType: rng.pick(SCHOOL_TYPES),
    studentBand: rng.pick(STUDENT_BANDS),
    modulesRequested: rng.pickMany(MODULES, rng.int(3, 6)),
    requestedAt: rng.dateWithinDays(75),
    createdAt: rng.dateWithinDays(75),
    status,
    plan: isApproved ? rng.pick(PLANS) : null,
    subscriptionStatus: isApproved ? rng.pick(SUB_STATUSES) : null,
    expiryDate: isApproved ? rng.dateWithinDays(-90) : null,
    storageUsedMb: isApproved ? rng.int(120, 4800) : 0,
    storageLimitMb: isApproved ? rng.pick([5000, 10000, 25000]) : 0,
    lastLoginAt: isApproved && rng.bool(0.8) ? rng.dateWithinDays(14) : null,
    version: isApproved ? rng.pick(VERSIONS) : VERSIONS[0],
  };
});

function fakeKey(rngLocal: ReturnType<typeof makeRng>) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 24; i++) s += chars[rngLocal.int(0, chars.length - 1)];
  return s;
}

const keyRng = makeRng(4477);
export const apiKeys: ApiKey[] = schoolRequests
  .filter((r) => r.status === "approved")
  .flatMap((r, i) => {
    const count = keyRng.int(1, 2);
    return Array.from({ length: count }, (_, k) => {
      const full = fakeKey(keyRng);
      return {
        id: `key_${i}_${k}`,
        schoolRequestId: r.id,
        label: k === 0 ? "Production" : "Sandbox",
        keyPreview: `oas_live_${full.slice(0, 4)}••••••••${full.slice(-4)}`,
        createdAt: keyRng.dateWithinDays(60),
        lastUsedAt: keyRng.bool(0.6) ? keyRng.dateWithinDays(10) : null,
        status: "active" as const,
      };
    });
  });

export function getSchoolRequestById(id: string) {
  return schoolRequests.find((r) => r.id === id);
}
export function apiKeysForRequest(requestId: string) {
  return apiKeys.filter((k) => k.schoolRequestId === requestId);
}
