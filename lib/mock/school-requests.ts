import type { SchoolRequest, SchoolRequestStatus, ApiKey } from "@/types/portal";
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
const STATUSES: SchoolRequestStatus[] = ["pending_review", "pending_review", "approved", "approved", "rejected", "more_info_requested", "suspended"];

const candidates = [...schools.map((s) => ({ name: s.name, district: s.district })), ...EXTRA_SCHOOLS];

export const schoolRequests: SchoolRequest[] = candidates.map((c, i) => {
  const contact = fullName(rng);
  return {
    id: `req_${i}`,
    schoolName: c.name,
    contactName: `${contact.first} ${contact.last}`,
    contactRole: rng.pick(["Head Teacher", "Director", "School Administrator", "Deputy Head Teacher"]),
    contactEmail: `${contact.first.toLowerCase()}.${contact.last.toLowerCase()}@${c.name.toLowerCase().replace(/[^a-z]+/g, "")}.co.ug`,
    contactPhone: `+256 7${rng.int(0, 9)}${rng.int(0, 9)} ${rng.int(100, 999)} ${rng.int(100, 999)}`,
    district: c.district,
    schoolType: rng.pick(SCHOOL_TYPES),
    studentBand: rng.pick(STUDENT_BANDS),
    modulesRequested: rng.pickMany(MODULES, rng.int(3, 6)),
    requestedAt: rng.dateWithinDays(75),
    status: rng.pick(STATUSES),
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
