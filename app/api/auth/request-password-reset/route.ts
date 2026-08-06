import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { issueToken } from "@/lib/auth/email-tokens";
import { sendEmail } from "@/lib/email/send";
import { resetPasswordTemplate } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  const { email } = (await request.json()) as { email?: string };
  if (!email) return NextResponse.json({ error: "Enter your email address." }, { status: 400 });

  const supabase = createAdminClient();
  const { data: profile } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();

  // Always return success - never reveal whether an account exists.
  if (profile) {
    try {
      const token = await issueToken(profile.id, "reset_password");
      const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;
      const { subject, html } = resetPasswordTemplate(resetUrl);
      await sendEmail(email, subject, html);
    } catch (err) {
      console.error("Failed to send password reset email:", err);
    }
  }

  return NextResponse.json({ success: true });
}
