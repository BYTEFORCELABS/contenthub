import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createPlainClient } from "@supabase/supabase-js";

export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set in .env.local.");
  return { url, key };
}

/** Supabase Auth for the signed-in person, reading and writing the session cookies. */
export async function supabaseServer() {
  const { url, key } = supabaseEnv();
  const jar = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) jar.set(name, value, options);
        } catch {
          // Server Components cannot set cookies; the proxy refreshes them instead.
        }
      },
    },
  });
}

/** Full access to the database and to Auth. Needs the secret key; server only, never sent to the browser. */
export function supabaseAdmin() {
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SECRETE_KEY;
  if (!secret) throw new Error("The Supabase secret key is missing. Set SUPABASE_SECRET_KEY in .env.local.");
  return createPlainClient(supabaseEnv().url, secret, { auth: { autoRefreshToken: false, persistSession: false } });
}
