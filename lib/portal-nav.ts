import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Users,
  UserCog,
  ClipboardList,
  CalendarCheck,
  CalendarDays,
  BookOpenCheck,
  FileSpreadsheet,
  Wallet,
  MessagesSquare,
  BarChart3,
  Library,
  Bus,
  BedDouble,
  Settings,
  LifeBuoy,
} from "lucide-react";

export type PortalNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const portalNav: PortalNavItem[] = [
  { label: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
  { label: "Schools", href: "/portal/schools", icon: Building2 },
  { label: "Students", href: "/portal/students", icon: GraduationCap },
  { label: "Parents", href: "/portal/parents", icon: Users },
  { label: "Teachers", href: "/portal/teachers", icon: UserCog },
  { label: "Admissions", href: "/portal/admissions", icon: ClipboardList },
  { label: "Attendance", href: "/portal/attendance", icon: CalendarCheck },
  { label: "Timetable", href: "/portal/timetable", icon: CalendarDays },
  { label: "Homework", href: "/portal/homework", icon: BookOpenCheck },
  { label: "Examinations", href: "/portal/examinations", icon: FileSpreadsheet },
  { label: "Finance", href: "/portal/finance", icon: Wallet },
  { label: "Communication", href: "/portal/communication", icon: MessagesSquare },
  { label: "Reports", href: "/portal/reports", icon: BarChart3 },
  { label: "Library", href: "/portal/library", icon: Library },
  { label: "Transport", href: "/portal/transport", icon: Bus },
  { label: "Hostel", href: "/portal/hostel", icon: BedDouble },
  { label: "Settings", href: "/portal/settings", icon: Settings },
  { label: "Support", href: "/portal/support", icon: LifeBuoy },
];
