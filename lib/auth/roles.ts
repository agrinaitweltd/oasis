import type { Enums } from "@/types/database.types";

export type UserRole = Enums<"user_role">;

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  school_admin: "School Admin",
  teacher: "Teacher",
  parent: "Parent",
  student: "Student",
  bursar: "Bursar",
  librarian: "Librarian",
};

/**
 * Where each role lands immediately after sign-in. Only Super Admin has a
 * built dashboard today (/portal/dashboard, the platform console) - every
 * other role lands on a shared authenticated home at /dashboard until
 * their dedicated dashboards are built. The redirect logic itself is
 * fully role-aware; only the destination for those five roles is a
 * placeholder pending that follow-up work.
 */
export const ROLE_REDIRECTS: Record<UserRole, string> = {
  super_admin: "/portal/dashboard",
  school_admin: "/dashboard",
  teacher: "/dashboard",
  parent: "/dashboard",
  student: "/dashboard",
  bursar: "/dashboard",
  librarian: "/dashboard",
};

export function redirectPathForRole(role: UserRole | null | undefined): string {
  if (!role) return "/dashboard";
  return ROLE_REDIRECTS[role] ?? "/dashboard";
}
