import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = ["/portal", "/dashboard"];
// /portal/admin is the staff sign-in page itself - the one part of /portal/*
// that must stay reachable while signed out.
const PORTAL_PUBLIC_PATHS = ["/portal/admin"];

function isProtected(pathname: string) {
  if (PORTAL_PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) return false;
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (isProtected(pathname) && !user) {
    // /portal/* is the staff/developer console (gated on the super_admin
    // role in app/portal/admin/page.tsx); everything else lands on the
    // customer sign-in page.
    const loginPath = pathname.startsWith("/portal") ? "/portal/admin" : "/login";
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
