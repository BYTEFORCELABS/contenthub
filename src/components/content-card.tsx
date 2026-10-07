"use client";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { PillarBadge, PriorityBadge } from "@/components/badges";
import { PlatformStack } from "@/components/platform";
import { fmtShort } from "@/lib/dates";
import { FORMAT_META } from "@/lib/meta";
import { byId } from "@/lib/select";
import type { ContentItem, HubState } from "@/lib/types";

/** Compact card for the board. The whole card is a link to the workspace; dragging is wired by the parent. Kept to what matters at a glance: title, where, when. */
export function ContentCard({ item, state, dragging, onOpen, ...rest }: { item: ContentItem; state: HubState; dragging?: boolean; onOpen?: (id: string) => void } & React.HTMLAttributes<HTMLAnchorElement>) {
  const pillar = byId(state.pillars, item.pillarId);
  return (
    <Link href={`/content/${item.id}`} draggable={false} {...rest}
      onClick={(e) => { if (onOpen && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); onOpen(item.id); } }}
      className={cn("group block rounded-xl border border-hairline bg-page p-3.5 transition-[box-shadow,border-color,opacity,transform] duration-150 hover:border-hairline-strong hover:shadow-[0_6px_16px_-10px_rgb(31_27_24/0.25)]", dragging && "scale-[0.98] opacity-40", rest.className)}>
      <div className="line-clamp-2 text-[14px] font-bold leading-snug text-ink">{item.title}</div>
      <div className="mt-2 flex items-center gap-2 text-[12px] text-muted"><PlatformStack platforms={item.platforms} /><span>{FORMAT_META[item.format].label}</span></div>
      <div className="mt-3 flex items-center justify-between gap-2 text-[12px] text-muted">
        <div className="flex min-w-0 items-center gap-2"><PillarBadge pillar={pillar} className="truncate font-medium" />{item.priority === "high" && <PriorityBadge priority="high" />}</div>
        {item.publishDate && <span className="num shrink-0">{fmtShort(item.publishDate)}</span>}
      </div>
    </Link>
  );
}
