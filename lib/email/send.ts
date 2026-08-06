import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

function getClient() {
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export async function sendEmail(to: string, subject: string, html: string) {
  const { error } = await getClient().emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "OASIS <noreply@oasis.co.ug>",
    to,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
}
