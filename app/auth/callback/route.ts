import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if user is blocked or if profile exists
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_blocked, role")
          .eq("id", user.id)
          .single() as { data: any };

        if (profile?.is_blocked) {
          await supabase.auth.signOut();
          return NextResponse.redirect(`${origin}/blocked`);
        }

        // Rule 6: Handle redirect after login
        const authCookies = request.headers.get("cookie") || "";
        const redirectCookie = authCookies.split("; ").find(row => row.startsWith("redirect_after_login="))
        let redirectPath = next;

        if (redirectCookie) {
          redirectPath = decodeURIComponent(redirectCookie.split("=")[1])
        }

        // If no profile, redirect to role-selection
        if (!profile) {
          const roleSelectionUrl = new URL("/role-selection", origin);
          roleSelectionUrl.searchParams.set("redirect", redirectPath);
          return NextResponse.redirect(roleSelectionUrl.toString());
        }

        const response = NextResponse.redirect(`${origin}${redirectPath}`);
        
        // Clear the cookie
        if (redirectCookie) {
          response.cookies.set("redirect_after_login", "", { maxAge: 0 });
        }
        
        return response;
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
