import { SchoolShell } from "@/components/school/SchoolShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <SchoolShell>{children}</SchoolShell>;
}
