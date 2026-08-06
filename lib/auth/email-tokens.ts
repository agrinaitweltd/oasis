import "server-only";
import { randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

type TokenType = "verify_email" | "reset_password";

const TTL_MS: Record<TokenType, number> = {
  verify_email: 24 * 60 * 60 * 1000,
  reset_password: 60 * 60 * 1000,
};

export async function issueToken(userId: string, type: TokenType): Promise<string> {
  const supabase = createAdminClient();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TTL_MS[type]).toISOString();

  const { error } = await supabase.from("email_action_tokens").insert({
    user_id: userId,
    token,
    type,
    expires_at: expiresAt,
  });
  if (error) throw new Error(error.message);

  return token;
}

export async function consumeToken(token: string, type: TokenType) {
  const supabase = createAdminClient();

  const { data: row, error } = await supabase
    .from("email_action_tokens")
    .select("id, user_id, expires_at, used_at")
    .eq("token", token)
    .eq("type", type)
    .maybeSingle();

  if (error || !row) return { userId: null as string | null, error: "This link is invalid." };
  if (row.used_at) return { userId: null as string | null, error: "This link has already been used." };
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { userId: null as string | null, error: "This link has expired." };
  }

  await supabase.from("email_action_tokens").update({ used_at: new Date().toISOString() }).eq("id", row.id);

  return { userId: row.user_id as string, error: null as string | null };
}
