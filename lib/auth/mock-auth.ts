// Client-side only mock authentication for the OASIS admin portal. There is
// no backend yet - this exists purely so the UI/UX (guarded routes, signed
// in state, sign out) is fully wired ahead of a real auth provider.
//
// The function shapes intentionally mirror what a Supabase Auth client call
// would look like (signInWithPassword / getSession / signOut), so swapping
// this module for `@supabase/supabase-js` later means changing this file
// only - no consuming component should need to change.

export type PortalSession = {
  username: string;
  schoolId: string;
  signedInAt: string;
};

const SESSION_KEY = "oasis_portal_session";

// Not surfaced anywhere in the UI (no labels, placeholders, hints, or
// visible copy reference these) - this is a temporary stand-in for real
// credential verification against a backend.
function checkCredentials(username: string, password: string) {
  return username === "admin" && password === "admin123";
}

export function signInWithPassword(input: {
  username: string;
  password: string;
  schoolId: string;
}): { session: PortalSession | null; error: string | null } {
  if (!checkCredentials(input.username, input.password)) {
    return { session: null, error: "Incorrect username or password." };
  }
  const session: PortalSession = {
    username: input.username,
    schoolId: input.schoolId,
    signedInAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return { session, error: null };
}

export function getSession(): PortalSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as PortalSession) : null;
  } catch {
    return null;
  }
}

export function signOut() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}
