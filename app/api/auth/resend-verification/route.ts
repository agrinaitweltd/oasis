import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { issueToken } from "@/lib/auth/email-tokens";
import { sendEmail } from "@/lib/email/send";
import { verifyEmailTemplate } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  const { email } = (await request.json()) as { email?: string };
  if (!email) return NextResponse.json({ error: "Enter your email address." }, { status: 400 });

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email_verified")
    .eq("email", email)
    .maybeSingle();

  // Always return success - never reveal whether an account exists or is
  // already verified to an unauthenticated caller.
  if (profile && !profile.email_verified) {
    try {
      const token = await issueToken(profile.id, "verify_email");
      const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verify-email?token=${token}`;
      const { subject, html } = verifyEmailTemplate(verifyUrl);
      await sendEmail(email, subject, html);
    } catch (err) {
      console.error("Failed to resend verification email:", err);
    }
  }

  return NextResponse.json({ success: true });
}
