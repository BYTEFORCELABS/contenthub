import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { AppShell } from "@/components/shell/app-shell";
import { THEME_SCRIPT } from "@/components/shell/theme";
import { HubProvider } from "@/lib/store";
import { loadState } from "@/lib/persist";

export const metadata: Metadata = {
  title: { default: "Cyberzik Content Hub", template: "%s · Cyberzik Content Hub" },
  description: "Plan, produce, schedule and track Cyberzik's social media content.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const initial = await loadState();
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} /></head>
      <body className="min-h-dvh">
        {initial ? <HubProvider initial={initial}><AppShell>{children}</AppShell></HubProvider> : children}
        <Toaster position="bottom-right" toastOptions={{ classNames: {
          toast: "!rounded-xl !border-hairline !bg-page !text-ink !font-sans !shadow-[0_12px_32px_-8px_rgb(36_26_18/0.25)]",
          title: "!text-[13px] !font-bold", description: "!text-[12.5px] !text-muted",
          success: "[&_[data-icon]]:!text-status-paid", error: "[&_[data-icon]]:!text-status-overdue",
        } }} />
      </body>
    </html>
  );
}
