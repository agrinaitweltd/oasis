import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// This function has two callers, each authenticated a different way:
//  1. Supabase Auth's "Send Email" hook (signup / recovery / email_change / magiclink),
//     which signs requests per the Standard Webhooks spec using SEND_EMAIL_HOOK_SECRET
//     (the "whsec_..." value shown when the hook is enabled in the dashboard).
//  2. Our own Postgres trigger (private.notify_welcome_email), which sends a plain
//     shared-secret header (WELCOME_EMAIL_SECRET) instead, since it isn't a webhook.
// verify_jwt is disabled on this function because neither caller carries a Supabase
// user JWT - both are verified above via their own secret instead.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "OASIS <noreply@oasis.co.ug>";
const SEND_EMAIL_HOOK_SECRET = Deno.env.get("SEND_EMAIL_HOOK_SECRET") ?? "";
const WELCOME_EMAIL_SECRET = Deno.env.get("WELCOME_EMAIL_SECRET") ?? "";

type AuthEmailAction = "signup" | "recovery" | "email_change" | "magiclink" | "invite" | "reauthentication";

type AuthHookPayload = {
  user: { email: string };
  email_data: {
    token_hash: string;
    redirect_to: string;
    email_action_type: AuthEmailAction;
    site_url: string;
  };
};

type DirectEmailPayload = { to: string; subject: string; html: string };

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Verifies a Standard Webhooks signature (used by Supabase Auth Hooks).
// Header format: "webhook-id", "webhook-timestamp", "webhook-signature: v1,<base64>"
// Secret format: "whsec_<base64>"
async function verifyStandardWebhook(req: Request, body: string): Promise<boolean> {
  if (!SEND_EMAIL_HOOK_SECRET.startsWith("whsec_")) return false;

  const id = req.headers.get("webhook-id");
  const timestamp = req.headers.get("webhook-timestamp");
  const signatureHeader = req.headers.get("webhook-signature");
  if (!id || !timestamp || !signatureHeader) return false;

  const secretBytes = Uint8Array.from(atob(SEND_EMAIL_HOOK_SECRET.slice("whsec_".length)), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("raw", secretBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signedContent = `${id}.${timestamp}.${body}`;
  const signatureBytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedContent));
  const expected = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)));

  return signatureHeader
    .split(" ")
    .map((part) => part.split(",")[1])
    .filter(Boolean)
    .some((sig) => timingSafeEqual(sig, expected));
}

function renderTemplate(heading: string, body: string, cta: string, url: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f6f5f2;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" style="padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="480" style="max-width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr><td style="padding:32px 32px 0;text-align:center;">
            <span style="font-size:20px;font-weight:700;color:#1a1a1a;">OASIS</span>
          </td></tr>
          <tr><td style="padding:24px 32px 8px;">
            <h1 style="margin:0 0 12px;font-size:20px;color:#1a1a1a;">${heading}</h1>
            <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5c5850;">${body}</p>
          </td></tr>
          <tr><td style="padding:0 32px 32px;">
            <a href="${url}" style="display:inline-block;background:#2f6b3a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:10px;">${cta}</a>
          </td></tr>
          <tr><td style="padding:0 32px 32px;">
            <p style="margin:0;font-size:12px;color:#a19d95;">If the button doesn't work, copy and paste this link into your browser:<br /><span style="word-break:break-all;">${url}</span></p>
          </td></tr>
        </table>
        <p style="margin:20px 0 0;font-size:12px;color:#a19d95;">OASIS by Swivel Technologies &middot; Uganda</p>
      </td></tr>
    </table>
  </body>
</html>`;
}

const AUTH_EMAIL_TEMPLATES: Record<AuthEmailAction, { subject: string; heading: string; body: string; cta: string }> = {
  signup: {
    subject: "Confirm your OASIS account",
    heading: "Confirm your email",
    body: "Thanks for signing up for OASIS. Click below to confirm your email address and activate your account.",
    cta: "Confirm email",
  },
  recovery: {
    subject: "Reset your OASIS password",
    heading: "Reset your password",
    body: "We received a request to reset your OASIS password. Click below to choose a new one. If you didn't request this, you can safely ignore this email.",
    cta: "Reset password",
  },
  email_change: {
    subject: "Confirm your new email address",
    heading: "Confirm your new email",
    body: "Click below to confirm your new email address for your OASIS account.",
    cta: "Confirm new email",
  },
  magiclink: {
    subject: "Your OASIS sign-in link",
    heading: "Sign in to OASIS",
    body: "Click below to sign in to your OASIS account.",
    cta: "Sign in",
  },
  invite: {
    subject: "You've been invited to OASIS",
    heading: "You're invited",
    body: "You've been invited to join OASIS. Click below to set up your account.",
    cta: "Accept invite",
  },
  reauthentication: {
    subject: "Confirm it's you",
    heading: "Confirm your identity",
    body: "Click below to confirm your identity and continue.",
    cta: "Confirm",
  },
};

function buildAuthEmail(payload: AuthHookPayload): { to: string; subject: string; html: string } {
  const { email_data } = payload;
  const confirmUrl = `${email_data.site_url}/auth/callback?token_hash=${email_data.token_hash}&type=${email_data.email_action_type}&next=${encodeURIComponent(email_data.redirect_to || "/dashboard")}`;
  const t = AUTH_EMAIL_TEMPLATES[email_data.email_action_type] ?? AUTH_EMAIL_TEMPLATES.signup;
  return { to: payload.user.email, subject: t.subject, html: renderTemplate(t.heading, t.body, t.cta, confirmUrl) };
}

async function sendViaResend(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: RESEND_FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) {
    throw new Error(`Resend error ${res.status}: ${await res.text()}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const rawBody = await req.text();

  const isVerifiedAuthHook = await verifyStandardWebhook(req, rawBody);
  const isVerifiedDirectCall =
    !!WELCOME_EMAIL_SECRET && timingSafeEqual(req.headers.get("x-oasis-webhook-secret") ?? "", WELCOME_EMAIL_SECRET);

  if (!isVerifiedAuthHook && !isVerifiedDirectCall) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  try {
    if (isVerifiedAuthHook) {
      const { to, subject, html } = buildAuthEmail(payload as AuthHookPayload);
      await sendViaResend(to, subject, html);
    } else {
      const { to, subject, html } = payload as DirectEmailPayload;
      if (!to || !subject || !html) return new Response("Missing to/subject/html", { status: 400 });
      await sendViaResend(to, subject, html);
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
});
