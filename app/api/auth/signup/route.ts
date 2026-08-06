import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { issueToken } from "@/lib/auth/email-tokens";
import { sendEmail } from "@/lib/email/send";
import { verifyEmailTemplate } from "@/lib/email/templates";
import type { Enums } from "@/types/database.types";

type Body = {
  email: string;
  password: string;
  fullName: string;
  role: Enums<"user_role">;
  schoolId?: string | null;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Body>;
  const { email, password, fullName, role, schoolId } = body;

  if (!email || !password || !fullName || !role) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Choose a password with at least 8 characters." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // We confirm the user immediately via the admin API - Supabase never sends
  // its own confirmation email or OTP. Our own token + Resend email below is
  // the real verification gate, tracked via profiles.email_verified.
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role, school_id: schoolId ?? null },
  });

  if (error || !data.user) {
    const message = error?.message ?? "Could not create account.";
    const friendly = message.toLowerCase().includes("already registered")
      ? "An account with that email already exists. Try signing in instead."
      : message;
    return NextResponse.json({ error: friendly }, { status: 400 });
  }

  try {
    const token = await issueToken(data.user.id, "verify_email");
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verify-email?token=${token}`;
    const { subject, html } = verifyEmailTemplate(verifyUrl);
    await sendEmail(email, subject, html);
  } catch (err) {
    console.error("Failed to send verification email:", err);
    // The account exists either way; don't block signup on email delivery.
  }

  return NextResponse.json({ success: true });
}
