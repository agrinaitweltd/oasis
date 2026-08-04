import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Wallet,
  Cog,
  ShieldCheck,
  BarChart3,
  LifeBuoy,
  Megaphone,
  Plug,
  DatabaseBackup,
  ScrollText,
  UserCog,
  Terminal,
} from "lucide-react";

export type PortalNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const portalNav: PortalNavItem[] = [
  { label: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
  { label: "Schools", href: "/portal/schools", icon: Building2 },
  { label: "Subscriptions", href: "/portal/subscriptions", icon: CreditCard },
  { label: "Finance", href: "/portal/finance", icon: Wallet },
  { label: "Platform", href: "/portal/platform", icon: Cog },
  { label: "Security", href: "/portal/security", icon: ShieldCheck },
  { label: "Analytics", href: "/portal/analytics", icon: BarChart3 },
  { label: "Support", href: "/portal/support", icon: LifeBuoy },
  { label: "Notifications", href: "/portal/notifications", icon: Megaphone },
  { label: "Integrations", href: "/portal/integrations", icon: Plug },
  { label: "Backups", href: "/portal/backups", icon: DatabaseBackup },
  { label: "Audit Logs", href: "/portal/audit-logs", icon: ScrollText },
  { label: "School Administrators", href: "/portal/school-admins", icon: UserCog },
  { label: "Developer Tools", href: "/portal/developer-tools", icon: Terminal },
];
