"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Repeat2 } from "lucide-react";
import { PlatformGlyph } from "@/components/platform";
import { Panel } from "@/components/page-header";
import { StatusBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { FORMAT_META, PLATFORM_META } from "@/lib/meta";
import { hub } from "@/lib/store";
import type { ContentItem, Format, HubState, Platform } from "@/lib/types";

const SUGGEST: { platform: Platform; format: Format }[] = [
  { platform: "instagram", format: "carousel" }, { platform: "facebook", format: "image" }, { platform: "linkedin", format: "text" },
  { platform: "tiktok", format: "reel" }, { platform: "x", format: "thread" }, { platform: "website", format: "article" },
];

/** One idea, many pieces. Creates a linked draft per target; rewriting each for its platform is manual until AI assistance ships. */
export function RepurposePanel({ item, state }: { item: ContentItem; state: HubState }) {
  const kids = state.items.filter((c) => c.repurposedFromId === item.id);
  const parent = state.items.find((c) => c.id === item.repurposedFromId);
  const taken = (p: Platform, f: Format) => kids.some((k) => k.platforms[0] === p && k.format === f);
  const [picked, setPicked] = useState<string[]>([]);
  const key = (t: { platform: Platform; format: Format }) => `${t.platform}:${t.format}`;
  const create = () => {
    const made = hub.repurpose(item.id, SUGGEST.filter((t) => picked.includes(key(t))));
    setPicked([]);
    toast.success(`${made.length} draft${made.length === 1 ? "" : "s"} created`, { description: "Added to Planned on the board." });
  };
  return (
    <Panel title="Repurpose">
      {parent && <p className="mb-3 text-[12.5px] text-muted">Repurposed from <Link className="font-bold text-bronze hover:text-deep" href={`/content/${parent.id}`}>{parent.title}</Link></p>}
      <p className="mb-3 text-[12.5px] text-muted">Turn this into more pieces. Each becomes a linked draft in Planned, carrying over the brief.</p>
      <ul className="flex flex-col gap-1.5">
        {SUGGEST.map((t) => {
          const done = taken(t.platform, t.format); const on = picked.includes(key(t));
          return (
            <li key={key(t)}>
              <label className={cn("flex cursor-pointer items-center gap-2.5 rounded-lg border px-2.5 py-2 text-[13px] transition-colors", done ? "cursor-default border-hairline bg-wash/60 text-muted" : on ? "border-deep bg-wash" : "border-hairline hover:bg-wash/60")}>
                <input type="checkbox" className="size-4 accent-[var(--brand-deep)]" checked={on || done} disabled={done} onChange={() => setPicked(on ? picked.filter((k) => k !== key(t)) : [...picked, key(t)])} />
                <PlatformGlyph platform={t.platform} className="size-4 text-deep" />
                <span className="flex-1 font-bold">{PLATFORM_META[t.platform].label} <span className="font-normal text-muted">· {FORMAT_META[t.format].label}</span></span>
                {done && <span className="text-[11.5px]">Created</span>}
              </label>
            </li>
          );
        })}
      </ul>
      <Button className="mt-3 w-full" disabled={!picked.length} onClick={create}><Repeat2 />Create {picked.length || ""} draft{picked.length === 1 ? "" : "s"}</Button>
      {kids.length > 0 && (
        <div className="mt-4 border-t border-hairline pt-3">
          <div className="eyebrow mb-2">Derived content</div>
          <ul className="flex flex-col gap-1.5">{kids.map((k) => <li key={k.id}><Link href={`/content/${k.id}`} className="flex items-center justify-between gap-2 text-[13px] hover:text-deep"><span className="truncate font-bold">{k.title}</span><StatusBadge status={k.status} /></Link></li>)}</ul>
        </div>
      )}
    </Panel>
  );
}
