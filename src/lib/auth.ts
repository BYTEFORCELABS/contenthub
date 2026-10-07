import "server-only";
import { cache } from "react";
import { supabaseAdmin, supabaseServer } from "./supabase/server";

export const normaliseEmail = (e: string) => e.trim().toLowerCase();

export async function isMember(email: string) {
  const { data } = await supabaseAdmin().from("members").select("active").eq("email", normaliseEmail(email)).maybeSingle();
  return !!data?.active;
}

/** The signed-in email if Supabase vouches for it AND it is on the members list; otherwise null. Cached per request. */
export const currentEmail = cache(async (): Promise<string | null> => {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email : null;
  return email && (await isMember(email)) ? normaliseEmail(email) : null;
});
