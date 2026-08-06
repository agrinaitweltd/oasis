import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = ["/portal/dashboard", "/dashboard"];
// /portal/schools etc. all live under app/portal/(dashboard)/*, which all
// resolve to /portal/<segment> - protect the whole /portal/* surface
// except the two auth entry points.
const PORTAL_PUBLIC_PATHS = ["/portal/login", "/portal/admin"];

function isProtected(pathname: string) {
  if (pathname.startsWith("/portal/")) {
    return !PORTAL_PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  }
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (isProtected(pathname) && !user) {
    const loginPath = pathname.startsWith("/portal/") ? "/portal/admin" : "/portal/login";
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets, images, and Next internals -
     * cheap to run, and updateSession() needs to see every navigation to
     * keep the refresh token alive.
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|fonts/|wp-content/).*)",
  ],
};
