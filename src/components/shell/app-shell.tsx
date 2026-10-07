"use client";
import { useEffect } from "react";
import { Header } from "@/components/shell/header";
import { Sidebar } from "@/components/shell/sidebar";
import { CommandSearch } from "@/components/shell/command-search";
import { ContentDialogHost } from "@/components/content-dialog";
import { uiActions } from "@/lib/ui";

export function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key.toLowerCase() === "n" && !e.metaKey && !e.ctrlKey && !e.altKey && !el.closest("input,textarea,select,[contenteditable],[role=dialog]")) { e.preventDefault(); uiActions.openIdea(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="flex min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-deep focus:px-3 focus:py-2 focus:text-cream">Skip to content</a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main id="main" className="cz-page min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <CommandSearch />
      <ContentDialogHost />
    </div>
  );
}
