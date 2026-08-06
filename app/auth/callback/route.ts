import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase sends users here after clicking an email confirmation or
// password reset link (a `code` query param, PKCE flow). Exchanging it
// sets the session cookie, then we forward to wherever the link should
// ultimately land (?next=), or to a friendly error page if the link was
// already used or has expired.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/portal/login?error=link_expired`);
}
