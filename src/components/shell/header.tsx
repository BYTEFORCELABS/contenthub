"use client";
import Link from "next/link";
import { useState } from "react";
import * as D from "@radix-ui/react-dialog";
import * as P from "@radix-ui/react-popover";
import { LogOut, Menu, Search, Settings, X } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { BrandLogo } from "@/components/brand-logo";
import { NavList, ProductMark } from "@/components/shell/sidebar";
import { ThemeToggle } from "@/components/shell/theme";
import { uiActions } from "@/lib/ui";
import { signOut } from "@/app/login/actions";

function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <D.Root open={open} onOpenChange={setOpen}>
      <D.Trigger aria-label="Open menu" className="grid size-9 place-items-center rounded-lg text-ink hover:bg-wash-strong lg:hidden"><Menu className="size-5" /></D.Trigger>
      <D.Portal>
        <D.Overlay className="cz-overlay fixed inset-0 z-50 bg-overlay backdrop-blur-[2px]" />
        <D.Content aria-describedby={undefined} className="cz-drawer fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-page shadow-xl focus:outline-none">
          <D.Title className="sr-only">Navigation</D.Title>
          <div className="flex items-start justify-between pl-3 pr-2 pt-2"><div><BrandLogo width={132} /><ProductMark /></div><D.Close aria-label="Close menu" className="grid size-8 place-items-center rounded-lg text-muted hover:bg-wash-strong"><X className="size-4" /></D.Close></div>
          <div className="mt-4 flex-1 overflow-y-auto pb-6"><NavList onNavigate={() => setOpen(false)} /></div>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

const item = "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] text-ink hover:bg-wash-strong";

function Profile() {
  const [open, setOpen] = useState(false);
  return (
    <P.Root open={open} onOpenChange={setOpen}>
      <P.Trigger aria-label="Profile" className="rounded-full ring-offset-2 transition-shadow hover:ring-2 hover:ring-deep/20"><Avatar name="Isaac" size={32} /></P.Trigger>
      <P.Portal>
        <P.Content align="end" sideOffset={8} className="cz-dialog z-50 w-60 rounded-xl border border-hairline bg-page p-1.5 shadow-[0_16px_40px_-12px_rgb(36_26_18/0.3)] outline-none">
          <div className="px-2.5 py-2"><div className="text-[13.5px] font-bold text-deep">Isaac</div><div className="text-[12px] text-muted">Cyberzik Technologies</div></div>
          <div className="my-1 h-px bg-hairline" />
          <Link href="/settings" className={item} onClick={() => setOpen(false)}><Settings className="size-4 text-bronze" />Settings</Link>
          <button className={item} onClick={async () => { await signOut(); window.location.replace("/login"); }}><LogOut className="size-4 text-bronze" />Sign out</button>
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 bg-page/90 px-3 backdrop-blur sm:px-6">
      <MobileNav />
      <button type="button" onClick={() => uiActions.setSearch(true)} aria-label="Search" className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg bg-wash px-3 text-left text-[13.5px] text-muted transition-colors hover:bg-wash-strong sm:max-w-md sm:flex-none sm:basis-96">
        <Search className="size-4 shrink-0" /><span className="flex-1 truncate">Search content, ideas, campaigns…</span><kbd className="hidden rounded border border-hairline-strong px-1.5 text-[11px] sm:block">⌘K</kbd>
      </button>
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2"><ThemeToggle /><Profile /></div>
    </header>
  );
}
