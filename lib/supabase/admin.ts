import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Service-role client for server-only auth operations (creating users,
// confirming them, resetting passwords) that must bypass RLS. Never import
// this from client components - the "server-only" import throws a build
// error if it's ever bundled into client code.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
