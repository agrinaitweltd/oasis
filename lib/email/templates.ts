function shell(heading: string, body: string, cta: string, url: string): string {
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

export function verifyEmailTemplate(verifyUrl: string) {
  return {
    subject: "Confirm your OASIS account",
    html: shell(
      "Confirm your email",
      "Thanks for signing up for OASIS. Click below to confirm your email address and activate your account. This link expires in 24 hours.",
      "Confirm email",
      verifyUrl
    ),
  };
}

export function resetPasswordTemplate(resetUrl: string) {
  return {
    subject: "Reset your OASIS password",
    html: shell(
      "Reset your password",
      "We received a request to reset your OASIS password. Click below to choose a new one. This link expires in 1 hour. If you didn't request this, you can safely ignore this email.",
      "Reset password",
      resetUrl
    ),
  };
}

export function welcomeEmailTemplate(name: string, loginUrl: string) {
  return {
    subject: "Welcome to OASIS",
    html: shell(
      `Welcome to OASIS, ${name}!`,
      "Your email is confirmed and your account is ready. Sign in any time to pick up right where you left off.",
      "Go to sign in",
      loginUrl
    ),
  };
}
