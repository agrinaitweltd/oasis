import { PortalShell } from "@/components/portal/PortalShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
