import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // If Supabase is not configured, allow public access but protect special routes by redirecting to a setup or login page
    // For now, just allow access to everything so the landing page works.
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  const url = new URL(request.url);
  const userRole = session?.user?.user_metadata?.role;

  // Protect routes
  if (!session) {
    if (url.pathname.startsWith("/buyer") || url.pathname.startsWith("/owner") || url.pathname.startsWith("/admin")) {
        // Special case for admin login
        if (url.pathname.startsWith("/admin") && !url.pathname.startsWith("/admin/login")) {
             return NextResponse.redirect(new URL("/admin/login", request.url));
        }
        if (!url.pathname.startsWith("/admin") && !url.pathname.startsWith("/login")) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
  } else {
    // Session exists - handle role-based redirection
    // Prevent logged-in users from hitting /login or /register
    if (url.pathname === "/login" || url.pathname === "/register") {
      const redirectPath = userRole === 'admin' ? '/admin' : userRole === 'owner' ? '/owner/dashboard' : '/home';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // Role-based access control
    if (url.pathname.startsWith("/owner") && userRole !== "owner" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    
    if (url.pathname.startsWith("/admin") && userRole !== "admin" && !url.pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    if (url.pathname.startsWith("/buyer") && userRole !== "buyer" && userRole !== "admin") {
      // If an owner tries to access buyer pages... maybe allowed? 
      // But usually, we want to keep them separate for now.
      // Let's allow owner to see buyer pages for now, but not vice-versa.
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
