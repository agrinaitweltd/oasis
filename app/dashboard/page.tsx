"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { AuthWordmark } from "@/components/auth/AuthLogo";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, role, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-oasis-200 border-t-oasis-500" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24, textAlign: "center" }}>
      <AuthWordmark href="/" />
      <div>
        <h1>Welcome, {profile?.full_name || user.email}</h1>
        <p className="auth-subtitle">
          {role ? ROLE_LABELS[role] : "Your"} dashboard is being built and will be available here soon.
        </p>
      </div>
      <button
        type="button"
        onClick={async () => {
          await signOut();
          router.push("/login");
        }}
        className="auth-btn auth-btn-secondary"
        style={{ maxWidth: 240 }}
      >
        Sign out
      </button>
    </div>
  );
}
