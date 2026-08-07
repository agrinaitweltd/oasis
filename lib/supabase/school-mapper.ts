import type { Tables } from "@/types/database.types";
import type { SchoolRequest, SubscriptionPlanKey, SubscriptionStatus } from "@/types/portal";

type SchoolRow = Tables<"schools">;

function logoInitialsFrom(name: string) {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SC"
  );
}

/** Maps a live public.schools row to the SchoolRequest shape the admin
 * console UI already renders. Fields with no column yet (storage usage,
 * last login, module requests) are left honestly empty rather than
 * fabricated - they'll populate once that schema work lands. */
export function schoolRowToRequest(row: SchoolRow): SchoolRequest {
  return {
    id: row.id,
    schoolName: row.name,
    schoolCode: row.code ?? "—",
    logoInitials: logoInitialsFrom(row.name),
    address: row.address ?? "—",
    contactName: row.contact_name ?? "—",
    contactRole: "—",
    contactEmail: row.contact_email ?? "—",
    contactPhone: row.contact_phone ?? "—",
    district: row.district ?? "—",
    schoolType: row.school_type ?? "—",
    studentBand: row.student_band ?? "—",
    modulesRequested: [],
    requestedAt: row.created_at.slice(0, 10),
    createdAt: row.created_at.slice(0, 10),
    status: row.status,
    plan: (row.plan as SubscriptionPlanKey | null) ?? null,
    subscriptionStatus: (row.subscription_status as SubscriptionStatus | null) ?? null,
    expiryDate: null,
    storageUsedMb: 0,
    storageLimitMb: 0,
    lastLoginAt: null,
    version: "—",
  };
}
