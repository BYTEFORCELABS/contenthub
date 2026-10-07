"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as D from "@radix-ui/react-dialog";
import { FileText, Lightbulb, Megaphone, Plus, Search, Tag } from "lucide-react";
import { PlatformGlyph } from "@/components/platform";
import { StatusBadge } from "@/components/badges";
import { NAV } from "@/components/nav";
import { PLATFORM_META } from "@/lib/meta";
import { matches } from "@/lib/select";
import { useHub } from "@/lib/store";
import { uiActions, useUi } from "@/lib/ui";
import { PLATFORMS } from "@/lib/types";

const row = "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] text-ink aria-selected:bg-wash-strong";

/** Global search (⌘K): content, ideas, campaigns, tags and platforms. We filter ourselves so tags and platforms match too. */
export function CommandSearch() {
  const { search } = useUi();
  const s = useHub();
  const router = useRouter();
  const [q, setQ] = useState("");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); uiActions.setSearch(!search); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [search]);
  const go = (href: string) => { uiActions.setSearch(false); router.push(href); };
  const items = s.items.filter((i) => matches(s, i, q));
  const ideas = items.filter((i) => i.status === "idea").slice(0, 5);
  const content = items.filter((i) => i.status !== "idea").slice(0, 7);
  const camps = s.campaigns.filter((c) => !q.trim() || (c.name + " " + c.description).toLowerCase().includes(q.trim().toLowerCase())).slice(0, 4);
  const tags = q.trim() ? [...new Set(s.items.flatMap((i) => i.tags))].filter((t) => t.includes(q.trim().toLowerCase().replace(/^#/, ""))).slice(0, 5) : [];
  const plats = q.trim() ? PLATFORMS.filter((p) => PLATFORM_META[p].label.toLowerCase().includes(q.trim().toLowerCase())) : [];
  const nav = NAV.flatMap((g) => g.items).filter((n) => !q.trim() || n.label.toLowerCase().includes(q.trim().toLowerCase()));
  const none = !items.length && !camps.length && !tags.length && !plats.length;

  return (
    <D.Root open={search} onOpenChange={(o) => { uiActions.setSearch(o); if (!o) setQ(""); }}>
      <D.Portal>
        <D.Overlay className="cz-overlay fixed inset-0 z-50 bg-overlay backdrop-blur-[2px]" />
        <D.Content aria-describedby={undefined} className="cz-dialog fixed left-1/2 top-[8vh] z-50 w-[calc(100vw-24px)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-hairline bg-page shadow-[0_24px_64px_-12px_rgb(36_26_18/0.3)] focus:outline-none">
          <D.Title className="sr-only">Search Content Hub</D.Title>
          <Command shouldFilter={false} label="Search" loop>
            <div className="flex items-center gap-2 border-b border-hairline px-4">
              <Search className="size-4 text-muted" />
              <Command.Input value={q} onValueChange={setQ} placeholder="Search content, ideas, campaigns, tags, platforms…" className="h-12 flex-1 bg-transparent text-[14.5px] outline-none placeholder:text-muted/70" />
              <kbd className="rounded border border-hairline-strong px-1.5 text-[11px] text-muted">esc</kbd>
            </div>
            <Command.List className="max-h-[60vh] overflow-y-auto p-2">
              {none && !nav.length && <div className="px-4 py-10 text-center text-[13.5px] text-muted">Nothing matches &ldquo;{q}&rdquo;.</div>}
              {!q.trim() && (
                <Command.Group heading="Create" className="mb-1 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted">
                  <Command.Item className={row} onSelect={() => { uiActions.setSearch(false); uiActions.openIdea(); }}><Plus className="size-4 text-bronze" />New idea</Command.Item>
                  <Command.Item className={row} onSelect={() => go("/campaigns?new=1")}><Plus className="size-4 text-bronze" />New campaign</Command.Item>
                </Command.Group>
              )}
              {ideas.length > 0 && <G heading="Ideas">{ideas.map((i) => <Command.Item key={i.id} value={i.id} className={row} onSelect={() => go(`/content/${i.id}`)}><Lightbulb className="size-4 text-bronze" /><span className="flex-1 truncate">{i.title}</span></Command.Item>)}</G>}
              {content.length > 0 && <G heading="Content">{content.map((i) => <Command.Item key={i.id} value={i.id} className={row} onSelect={() => go(`/content/${i.id}`)}><FileText className="size-4 text-bronze" /><span className="flex-1 truncate">{i.title}</span><StatusBadge status={i.status} /></Command.Item>)}</G>}
              {camps.length > 0 && <G heading="Campaigns">{camps.map((c) => <Command.Item key={c.id} value={c.id} className={row} onSelect={() => go(`/campaigns/${c.id}`)}><Megaphone className="size-4 text-bronze" /><span className="flex-1 truncate">{c.name}</span></Command.Item>)}</G>}
              {tags.length > 0 && <G heading="Tags">{tags.map((t) => <Command.Item key={t} value={`tag-${t}`} className={row} onSelect={() => go(`/content?q=${encodeURIComponent(t)}`)}><Tag className="size-4 text-bronze" />#{t}</Command.Item>)}</G>}
              {plats.length > 0 && <G heading="Platforms">{plats.map((p) => <Command.Item key={p} value={`plat-${p}`} className={row} onSelect={() => go(`/content?platform=${p}`)}><PlatformGlyph platform={p} className="size-4 text-bronze" />Content on {PLATFORM_META[p].label}</Command.Item>)}</G>}
              {nav.length > 0 && q.trim() && <G heading="Go to">{nav.map((n) => <Command.Item key={n.href} value={n.href} className={row} onSelect={() => go(n.href)}><n.icon className="size-4 text-bronze" />{n.label}</Command.Item>)}</G>}
            </Command.List>
          </Command>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

const G = ({ heading, children }: { heading: string; children: React.ReactNode }) => (
  <Command.Group heading={heading} className="mb-1 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted">{children}</Command.Group>
);
