import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { consumeToken } from "@/lib/auth/email-tokens";

export async function POST(request: NextRequest) {
  const { token, password } = (await request.json()) as { token?: string; password?: string };

  if (!token) return NextResponse.json({ error: "This link is invalid." }, { status: 400 });
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Choose a password with at least 8 characters." }, { status: 400 });
  }

  const { userId, error } = await consumeToken(token, "reset_password");
  if (!userId) {
    return NextResponse.json({ error: error ?? "This link is invalid or has expired." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, { password });
  if (updateError) {
    return NextResponse.json({ error: "Could not update your password. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
