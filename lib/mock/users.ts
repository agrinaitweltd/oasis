import type { PortalUser, Role } from "@/types/portal";

export const portalUsers: PortalUser[] = [
  { id: "usr_0", name: "Admin User", email: "admin@oasis-demo.co.ug", role: "Super Admin", status: "Active" },
  { id: "usr_1", name: "Grace Namuli", email: "grace.namuli@oasis-demo.co.ug", role: "Registrar", status: "Active" },
  { id: "usr_2", name: "David Okello", email: "david.okello@oasis-demo.co.ug", role: "Accountant", status: "Active" },
  { id: "usr_3", name: "Ruth Kirabo", email: "ruth.kirabo@oasis-demo.co.ug", role: "Admin", status: "Active" },
  { id: "usr_4", name: "Peter Ssewanyana", email: "peter.ssewanyana@oasis-demo.co.ug", role: "Teacher", status: "Suspended" },
];

export const roles: Role[] = [
  { id: "role_0", name: "Super Admin", usersCount: 1, permissions: ["Full system access", "Manage users & roles", "Manage billing"] },
  { id: "role_1", name: "Admin", usersCount: 3, permissions: ["Manage students & staff", "Manage academics", "View finance"] },
  { id: "role_2", name: "Accountant", usersCount: 2, permissions: ["Manage invoices & payments", "View finance reports"] },
  { id: "role_3", name: "Registrar", usersCount: 2, permissions: ["Manage admissions", "Manage student records"] },
  { id: "role_4", name: "Teacher", usersCount: 22, permissions: ["Mark attendance", "Enter exam results", "View own classes"] },
];
