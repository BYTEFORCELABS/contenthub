"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import * as T from "@radix-ui/react-tooltip";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV } from "@/components/nav";
import { BrandLogo } from "@/components/brand-logo";

export const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

/** Which nav item owns the current path. /content/[id] belongs to the board when it was opened from there; keep it simple and use All Content. */
export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <nav className="flex flex-col gap-1 px-3" aria-label="Main">
      {NAV.map((g) => (
        <div key={g.key} className={g.label ? "mt-3" : undefined}>
          {g.label && <div className="mb-1 px-2.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink/70">{g.label}</div>}
          <ul className="flex flex-col gap-0.5">
            {g.items.map((i) => {
              const active = isActive(path, i.href);
              return (
                <li key={i.href}>
                  <Link href={i.href} onClick={onNavigate} aria-current={active ? "page" : undefined}
                    className={cn("group flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] transition-colors", active ? "bg-deep font-bold text-cream shadow-sm" : "text-ink/85 hover:bg-wash-strong hover:text-ink")}>
                    <i.icon className={cn("size-4 shrink-0", active ? "text-cream" : "text-muted group-hover:text-deep")} />
                    <span className="truncate">{i.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Rail() {
  const path = usePathname();
  return (
    <T.Provider delayDuration={150}>
      <nav className="flex flex-col items-center gap-1 px-2" aria-label="Main">
        {NAV.map((g, gi) => (
          <div key={g.key} className="flex w-full flex-col items-center gap-1">
            {gi > 0 && <div className="my-2 h-px w-8 bg-hairline-strong" />}
            {g.items.map((i) => {
              const active = isActive(path, i.href);
              return (
                <T.Root key={i.href}>
                  <T.Trigger asChild>
                    <Link href={i.href} aria-label={i.label} aria-current={active ? "page" : undefined}
                      className={cn("grid size-10 place-items-center rounded-xl transition-colors", active ? "bg-deep text-cream shadow-sm" : "text-muted hover:bg-wash-strong hover:text-deep")}>
                      <i.icon className="size-[18px]" />
                    </Link>
                  </T.Trigger>
                  <T.Portal><T.Content side="right" sideOffset={10} className="cz-overlay z-50 rounded-lg bg-ink px-2.5 py-1.5 text-[12px] font-bold text-page shadow-lg">{i.label}</T.Content></T.Portal>
                </T.Root>
              );
            })}
          </div>
        ))}
      </nav>
    </T.Provider>
  );
}

export function ProductMark() {
  return <span className="mt-0.5 block pl-1 text-[10.5px] font-bold uppercase tracking-[0.28em] text-bronze">Content Hub</span>;
}

const NAV_KEY = "cz-hub-nav";
const navSubs = new Set<() => void>();
const subNav = (cb: () => void) => { navSubs.add(cb); return () => { navSubs.delete(cb); }; };

export function Sidebar() {
  const collapsed = useSyncExternalStore(subNav, () => { try { return localStorage.getItem(NAV_KEY) === "collapsed"; } catch { return false; } }, () => false);
  const toggle = () => { try { localStorage.setItem(NAV_KEY, collapsed ? "open" : "collapsed"); } catch { /* ignore */ } navSubs.forEach((f) => f()); };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b" && !(e.target as HTMLElement).closest("input,textarea,[contenteditable]")) { e.preventDefault(); toggle(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <aside className={cn("sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-hairline bg-wash transition-[width] duration-300 ease-out lg:flex", collapsed ? "w-[72px]" : "w-64")}>
      <div className={cn("flex items-center", collapsed ? "flex-col gap-1 px-2 pt-3" : "justify-between pl-3 pr-2 pt-2")}>
        <Link href="/" aria-label="Cyberzik Content Hub: Dashboard">
          {collapsed ? <BrandLogo width={36} /> : <div><BrandLogo width={132} priority /><ProductMark /></div>}
        </Link>
        <button type="button" onClick={toggle} title={`${collapsed ? "Expand" : "Collapse"} sidebar (⌘B)`} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-wash-strong hover:text-deep">
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>
      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pb-4">{collapsed ? <Rail /> : <NavList />}</div>
      {!collapsed && <div className="border-t border-hairline px-4 py-3 text-[11.5px] text-muted">Cyberzik Technologies · Internal</div>}
    </aside>
  );
}
