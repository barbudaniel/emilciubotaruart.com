import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("[middleware] Processing request:", pathname);

  // Skip auth check for login page
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    console.log("[middleware] Skipping auth check for:", pathname);
    return NextResponse.next();
  }

  console.log("[middleware] Checking auth for admin route:", pathname);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.log("[middleware] Missing Supabase config, redirecting to login");
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        const cookies = request.cookies.getAll();
        console.log("[middleware] Getting cookies:", cookies.length, "cookies");
        return cookies;
      },
      setAll(cookiesToSet) {
        console.log("[middleware] Setting cookies:", cookiesToSet.length, "cookies");
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("[middleware] User check result:", user ? user.email : "no user");

  if (!user) {
    console.log("[middleware] No user found, redirecting to login");
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  console.log("[middleware] User authenticated, allowing access");
  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
