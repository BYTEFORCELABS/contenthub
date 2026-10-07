"use server";
import { redirect } from "next/navigation";
import { isMember, normaliseEmail } from "@/lib/auth";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";

export interface LoginState { step: "email" | "code"; email: string; error: string | null; info: string | null }

const NOT_MEMBER = "This email isn't set up for the Content Hub. Ask Isaac to add it.";

/** Step 1: email a one-time code, but only to members. */
export async function sendCode(_: LoginState, form: FormData): Promise<LoginState> {
  const email = normaliseEmail(String(form.get("email") ?? ""));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { step: "email", email, error: "Enter a valid email address.", info: null };
  try {
    if (!(await isMember(email))) return { step: "email", email, error: NOT_MEMBER, info: null };
    // Logins are created here, so public sign-ups can stay switched off in Supabase.
    const { error: made } = await supabaseAdmin().auth.admin.createUser({ email, email_confirm: true });
    if (made && made.code !== "email_exists" && !/already/i.test(made.message)) return { step: "email", email, error: `Could not prepare your login: ${made.message}`, info: null };
  } catch (e) {
    console.error(e);
    return { step: "email", email, error: "The database could not be reached. Check the Supabase keys in .env.local.", info: null };
  }
  const { error } = await (await supabaseServer()).auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
  if (error) {
    const wait = /rate|seconds|too many/i.test(error.message);
    return { step: "email", email, error: wait ? "A code was sent very recently. Wait a minute, then try again." : `Could not send the code: ${error.message}`, info: null };
  }
  return { step: "code", email, error: null, info: `We sent a sign-in code to ${email}. It expires in a few minutes.` };
}

/** Step 2: check the code. */
export async function verifyCode(prev: LoginState, form: FormData): Promise<LoginState> {
  if (form.get("intent") === "back") return { step: "email", email: prev.email, error: null, info: null };
  if (form.get("intent") === "resend") { const f = new FormData(); f.set("email", prev.email); return sendCode(prev, f); }
  const token = String(form.get("code") ?? "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(token)) return { ...prev, error: "Enter the 6-digit code from the email.", info: null };
  const { data, error } = await (await supabaseServer()).auth.verifyOtp({ email: prev.email, token, type: "email" });
  if (error || !data.user) return { ...prev, error: "That code is wrong or has expired. Check the latest email, or send a new code.", info: null };
  redirect("/");
}

/** The browser then does a full page load to /login, so no signed-in data stays in memory. */
export async function signOut() {
  await (await supabaseServer()).auth.signOut();
}
