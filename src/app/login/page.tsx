import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./form";

export const metadata: Metadata = { title: "Sign in" };
export default function Page() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm">
        <Image src="/brand/cyberzik_full_colour.png" alt="Cyberzik" width={140} height={65} priority className="h-auto w-[140px]" />
        <h1 className="mt-8 text-[26px] font-bold text-ink">Sign in</h1>
        <p className="mt-1 text-[14px] text-muted">We&apos;ll email you a one-time code.</p>
        <LoginForm />
      </div>
    </main>
  );
}
