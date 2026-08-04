"use client";

import { useCallback, useEffect, useState } from "react";
import { getSession, signInWithPassword, signOut, type PortalSession } from "@/lib/auth/mock-auth";

export function useMockAuth() {
  const [session, setSession] = useState<PortalSession | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setLoaded(true);
  }, []);

  const signIn = useCallback((username: string, password: string, schoolId: string) => {
    const result = signInWithPassword({ username, password, schoolId });
    if (result.session) setSession(result.session);
    return result;
  }, []);

  const logOut = useCallback(() => {
    signOut();
    setSession(null);
  }, []);

  return { session, loaded, signIn, logOut };
}
