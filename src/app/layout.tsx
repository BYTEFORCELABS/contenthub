import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { AppShell } from "@/components/shell/app-shell";

export const metadata: Metadata = {
  title: { default: "Cyberzik Content Hub", template: "%s · Cyberzik Content Hub" },
  description: "Plan, produce, schedule and track Cyberzik's social media content.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB">
      <body className="min-h-dvh">
        <AppShell>{children}</AppShell>
        <Toaster position="bottom-right" toastOptions={{ classNames: {
          toast: "!rounded-xl !border-hairline !bg-page !text-ink !font-sans !shadow-[0_12px_32px_-8px_rgb(36_26_18/0.25)]",
          title: "!text-[13px] !font-bold", description: "!text-[12.5px] !text-muted",
          success: "[&_[data-icon]]:!text-status-paid", error: "[&_[data-icon]]:!text-status-overdue",
        } }} />
      </body>
    </html>
  );
}
