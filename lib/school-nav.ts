import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  CalendarCheck,
  Siren,
  GraduationCap,
  CalendarClock,
  MessageSquare,
  Heart,
  UserSquare2,
  Wallet,
  Briefcase,
  PartyPopper,
  Bus,
  Stethoscope,
  ShieldAlert,
  Puzzle,
  BarChart3,
  Calendar,
  FileText,
  Sparkles,
  LineChart,
} from "lucide-react";

export type SchoolNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// Every module here maps 1:1 to a table (or set of tables) in the shared
// Supabase project - same schema the mobile app reads/writes, kept in sync
// via Realtime. See lib/school-modules.ts for build status per module.
export const schoolNav: SchoolNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Student Management", href: "/dashboard/students", icon: Users },
  { label: "Admissions", href: "/dashboard/admissions", icon: ClipboardList },
  { label: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  { label: "Behaviour", href: "/dashboard/behaviour", icon: Siren },
  { label: "Academic", href: "/dashboard/academic", icon: GraduationCap },
  { label: "Timetable", href: "/dashboard/timetable", icon: CalendarClock },
  { label: "Communication", href: "/dashboard/communication", icon: MessageSquare },
  { label: "Parents Portal", href: "/dashboard/parents-portal", icon: Heart },
  { label: "Student Portal", href: "/dashboard/student-portal", icon: UserSquare2 },
  { label: "Fees & Payments", href: "/dashboard/fees", icon: Wallet },
  { label: "Staff Management", href: "/dashboard/staff", icon: Briefcase },
  { label: "Clubs & Activities", href: "/dashboard/clubs", icon: PartyPopper },
  { label: "School Trips", href: "/dashboard/trips", icon: Bus },
  { label: "Medical", href: "/dashboard/medical", icon: Stethoscope },
  { label: "Safeguarding", href: "/dashboard/safeguarding", icon: ShieldAlert },
  { label: "SEND", href: "/dashboard/send", icon: Puzzle },
  { label: "Reporting", href: "/dashboard/reporting", icon: BarChart3 },
  { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { label: "Exams", href: "/dashboard/exams", icon: FileText },
  { label: "AI Features", href: "/dashboard/ai-features", icon: Sparkles },
  { label: "School Analytics", href: "/dashboard/school-analytics", icon: LineChart },
];
