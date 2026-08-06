// Browser Supabase client - use in Client Components. Session is persisted
// to localStorage/cookies by @supabase/ssr and kept in sync with the
// server via middleware.ts.
"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
