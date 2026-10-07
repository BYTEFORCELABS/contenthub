"use client";
import { useActionState } from "react";
import { sendCode, verifyCode, type LoginState } from "./actions";

const input = "h-11 w-full rounded-lg border border-hairline-strong bg-page px-3 text-[15px] text-ink outline-none focus:border-deep/50";
const primary = "h-11 w-full rounded-lg bg-deep text-[14px] font-bold text-cream disabled:opacity-50";

export function LoginForm() {
  const [s, action, pending] = useActionState(
    (prev: LoginState, form: FormData) => (prev.step === "email" ? sendCode(prev, form) : verifyCode(prev, form)),
    { step: "email", email: "", error: null, info: null } as LoginState,
  );
  return (
    <div className="mt-6">
      {s.step === "email" ? (
        <form action={action} className="space-y-3">
          <input name="email" type="email" required autoFocus autoComplete="email" defaultValue={s.email} placeholder="you@example.com" aria-label="Email" className={input} />
          <button className={primary} disabled={pending}>{pending ? "Sending…" : "Email me a code"}</button>
        </form>
      ) : (
        <form action={action} className="space-y-3">
          <input name="code" inputMode="numeric" autoComplete="one-time-code" required autoFocus placeholder="Code" aria-label="Sign-in code" className={`${input} tracking-[0.3em]`} />
          <button className={primary} disabled={pending} name="intent" value="verify">{pending ? "Checking…" : "Sign in"}</button>
          <div className="flex justify-between text-[13px] text-muted">
            <button name="intent" value="back" formNoValidate className="hover:text-deep">Use a different email</button>
            <button name="intent" value="resend" formNoValidate className="hover:text-deep">Send a new code</button>
          </div>
        </form>
      )}
      {s.info && <p className="mt-4 text-[13px] text-muted">{s.info}</p>}
      {s.error && <p role="alert" className="mt-4 text-[13px] font-bold text-status-overdue">{s.error}</p>}
    </div>
  );
}
