import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { consumeToken } from "@/lib/auth/email-tokens";
import { sendEmail } from "@/lib/email/send";
import { welcomeEmailTemplate } from "@/lib/email/templates";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${origin}/portal/login?verify_error=missing_token`);
  }

  const { userId, error } = await consumeToken(token, "verify_email");
  if (!userId) {
    return NextResponse.redirect(`${origin}/portal/login?verify_error=${encodeURIComponent(error ?? "invalid")}`);
  }

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .update({ email_verified: true })
    .eq("id", userId)
    .select("full_name, email")
    .maybeSingle();

  if (profile?.email) {
    try {
      const { subject, html } = welcomeEmailTemplate(
        profile.full_name || profile.email.split("@")[0],
        `${origin}/portal/login`
      );
      await sendEmail(profile.email, subject, html);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }
  }

  return NextResponse.redirect(`${origin}/portal/login?verified=1`);
}
