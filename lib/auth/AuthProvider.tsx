"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database.types";
import type { UserRole } from "./roles";

type Profile = Tables<"profiles">;

type AuthResult = { error: string | null };
type SignInResult = AuthResult & { role: UserRole | null };

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  signUp: (input: { email: string; password: string; fullName: string; role: UserRole; schoolId?: string | null }) => Promise<AuthResult>;
  signIn: (input: { email: string; password: string; rememberMe?: boolean }) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  resendVerificationEmail: (email: string) => Promise<AuthResult>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Friendly copies for the Supabase Auth error messages we're most likely
// to hit, so the UI never shows a raw API error string.
function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "That email and password don't match. Please try again.";
  if (m.includes("email not confirmed")) return "Please verify your email address before signing in - check your inbox for the confirmation link.";
  if (m.includes("user already registered") || m.includes("already been registered")) return "An account with that email already exists. Try signing in instead.";
  if (m.includes("password should be at least") || m.includes("password is too short")) return "Choose a password with at least 8 characters.";
  if (m.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
  if (m.includes("expired") || m.includes("invalid") ) return "That link has expired or was already used. Request a new one and try again.";
  if (m.includes("network") || m.includes("fetch")) return "We couldn't reach the server. Check your connection and try again.";
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      setProfile(data ?? null);
    },
    [supabase]
  );

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user.id);
  }, [user, loadProfile]);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signUp: AuthContextValue["signUp"] = useCallback(
    async ({ email, password, fullName, role, schoolId }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`,
          data: { full_name: fullName, role, school_id: schoolId ?? null },
        },
      });
      return { error: error ? friendlyAuthError(error.message) : null };
    },
    [supabase]
  );

  const signIn: AuthContextValue["signIn"] = useCallback(
    async ({ email, password, rememberMe }) => {
      // "Remember me" controls whether the session persists across browser
      // restarts vs. only for the current tab session.
      if (typeof window !== "undefined") {
        window.localStorage.setItem("oasis_remember_me", rememberMe ? "1" : "0");
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        return { error: friendlyAuthError(error?.message ?? "Sign in failed."), role: null };
      }
      const { data: profileRow } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
      return { error: null, role: (profileRow?.role as UserRole | undefined) ?? null };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  const requestPasswordReset: AuthContextValue["requestPasswordReset"] = useCallback(
    async (email) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
      });
      return { error: error ? friendlyAuthError(error.message) : null };
    },
    [supabase]
  );

  const updatePassword: AuthContextValue["updatePassword"] = useCallback(
    async (newPassword) => {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return { error: error ? friendlyAuthError(error.message) : null };
    },
    [supabase]
  );

  const resendVerificationEmail: AuthContextValue["resendVerificationEmail"] = useCallback(
    async (email) => {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}` },
      });
      return { error: error ? friendlyAuthError(error.message) : null };
    },
    [supabase]
  );

  const value: AuthContextValue = {
    user,
    session,
    profile,
    role: (profile?.role as UserRole | undefined) ?? null,
    loading,
    signUp,
    signIn,
    signOut,
    requestPasswordReset,
    updatePassword,
    resendVerificationEmail,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
