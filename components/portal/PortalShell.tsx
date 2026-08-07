"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { FirstRunTutorial } from "@/components/school/FirstRunTutorial";

export function PortalShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, role, loading, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || role !== "super_admin") router.replace("/portal/admin");
  }, [loading, user, role, router]);

  if (loading || !user || role !== "super_admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-oasis-200 border-t-oasis-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <FirstRunTutorial />
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        schoolName="Platform Admin"
        onLogout={async () => {
          await signOut();
          router.replace("/portal/admin");
        }}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMobileMenu={() => setMobileOpen(true)} username={profile?.full_name || user.email || "Admin"} />
        <main key={pathname} className="animate-fade-up flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
