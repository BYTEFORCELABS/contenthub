import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Keeps the Supabase session fresh and sends anyone without one to /login.
 * This is the optimistic check; every data call checks again against the members list.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) return response;
  const to = NextResponse.redirect(new URL("/login", request.url));
  for (const c of response.cookies.getAll()) to.cookies.set(c);
  return to;
}

export const config = {
  matcher: ["/((?!login|fonts/|_next/static|_next/image|brand/|icon.png|favicon.ico).*)"],
};
