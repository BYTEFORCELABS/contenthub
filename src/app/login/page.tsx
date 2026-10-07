import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { LoginForm } from "./form";

export const metadata: Metadata = { title: "Sign in" };
export default function Page() {
  return (
    <main className="grid min-h-dvh place-items-center bg-wash px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="rounded-3xl border border-hairline bg-page px-7 pb-8 pt-9 shadow-[0_24px_60px_-28px_rgb(31_27_24/0.28)] sm:px-10">
          <div className="flex justify-center"><BrandLogo width={132} priority /></div>
          <div className="mt-8 text-center">
            <h1 className="text-[26px] font-bold leading-tight text-ink">Welcome back</h1>
            <p className="mt-1.5 text-[14px] text-muted">Sign in to the Content Hub. We&apos;ll email you a one-time code.</p>
          </div>
          <LoginForm />
        </div>
        <p className="mt-5 text-center text-[12px] text-muted">Cyberzik Technologies · Content Hub</p>
      </div>
    </main>
  );
}
