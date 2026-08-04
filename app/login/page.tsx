import { redirect } from "next/navigation";

// There is now a single login page for the whole platform, at
// /portal/login. This route is kept only so existing links/bookmarks to
// /login still land somewhere sensible.
export default function LoginRedirectPage() {
  redirect("/portal/login");
}
