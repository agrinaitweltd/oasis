"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useMockAuth } from "@/hooks/useMockAuth";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function PortalShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { session, loaded, logOut } = useMockAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loaded && !session) router.replace("/portal/login");
  }, [loaded, session, router]);

  if (!loaded || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-oasis-200 border-t-oasis-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        schoolName="Internal Console"
        onLogout={() => {
          logOut();
          router.replace("/portal/login");
        }}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMobileMenu={() => setMobileOpen(true)} username={session.username} />
        <main className="animate-fade-up flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
