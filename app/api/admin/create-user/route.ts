import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

const ALLOWED_ROLES = ["school_admin", "teacher", "parent", "student", "bursar", "librarian"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

function admin() {
  return createServiceClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Lets a super_admin (via the platform console) provision a login for a
// specific school and role, without the recipient needing to complete the
// OTP self-signup flow themselves. Requires SUPABASE_SERVICE_ROLE_KEY -
// server-only, never sent to the browser.
export async function POST(request: NextRequest) {
  const caller = await createServerClient();
  const {
    data: { user: callerUser },
  } = await caller.auth.getUser();
  if (!callerUser) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { data: callerProfile } = await caller.from("profiles").select("role").eq("id", callerUser.id).maybeSingle();
  if (callerProfile?.role !== "super_admin") {
    return NextResponse.json({ error: "You don't have permission to create accounts." }, { status: 403 });
  }

  const body = (await request.json()) as {
    schoolId?: string;
    fullName?: string;
    email?: string;
    password?: string;
    role?: string;
  };
  const { schoolId, fullName, email, password, role } = body;

  if (!schoolId || !fullName?.trim() || !email?.trim() || !password || !role) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!ALLOWED_ROLES.includes(role as AllowedRole)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Choose a password with at least 8 characters." }, { status: 400 });
  }

  const supabase = admin();

  const { data: school } = await supabase.from("schools").select("id").eq("id", schoolId).maybeSingle();
  if (!school) return NextResponse.json({ error: "That school couldn't be found." }, { status: 400 });

  const { data: created, error } = await supabase.auth.admin.createUser({
    email: email.trim(),
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName.trim(), role, school_id: schoolId },
  });

  if (error || !created.user) {
    const message = error?.message.toLowerCase().includes("already")
      ? "An account with that email already exists."
      : (error?.message ?? "Could not create the account.");
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Belt and suspenders - make sure the profile row is linked even if the
  // handle_new_user trigger's metadata read ever changes shape.
  await supabase.from("profiles").update({ school_id: schoolId, role: role as AllowedRole, full_name: fullName.trim() }).eq("id", created.user.id);

  return NextResponse.json({ success: true, userId: created.user.id });
}
