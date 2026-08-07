import { redirect } from "next/navigation";

// Staff login lives at /portal/admin. Kept only so bookmarks/links to
// /admin from the brief window it lived here still land somewhere sensible.
export default function AdminRedirectPage() {
  redirect("/portal/admin");
}
