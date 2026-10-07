"use client";
import Link from "next/link";
import { CalendarDays, Image as ImageIcon, Paperclip } from "lucide-react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/avatar";
import { PillarBadge, PriorityBadge } from "@/components/badges";
import { PlatformStack } from "@/components/platform";
import { fmtShort } from "@/lib/dates";
import { FORMAT_META } from "@/lib/meta";
import { byId } from "@/lib/select";
import type { ContentItem, HubState } from "@/lib/types";

/** Compact card for the board. The whole card is a link to the workspace; dragging is wired by the parent. */
export function ContentCard({ item, state, dragging, ...rest }: { item: ContentItem; state: HubState; dragging?: boolean } & React.HTMLAttributes<HTMLAnchorElement>) {
  const pillar = byId(state.pillars, item.pillarId);
  const thumb = item.media.find((m) => m.kind === "image" || m.kind === "graphic" || m.kind === "thumbnail");
  return (
    <Link href={`/content/${item.id}`} draggable={false} {...rest}
      className={cn("group block rounded-xl border border-hairline bg-page p-3 shadow-[0_1px_0_rgb(36_26_18/0.04)] transition-[box-shadow,border-color,opacity,transform] duration-150 hover:border-deep/30 hover:shadow-[0_6px_16px_-8px_rgb(36_26_18/0.25)]", dragging && "scale-[0.98] opacity-40", rest.className)}>
      {thumb && <div className="mb-2 flex h-14 items-center justify-center rounded-lg bg-wash-strong text-bronze"><ImageIcon className="size-5" /></div>}
      <div className="line-clamp-2 text-[13.5px] font-bold leading-snug text-ink group-hover:text-deep">{item.title}</div>
      <div className="mt-1.5 flex items-center gap-2 text-[12px] text-muted"><PlatformStack platforms={item.platforms} /><span>{FORMAT_META[item.format].label}</span></div>
      <div className="mt-2"><PillarBadge pillar={pillar} /></div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <PriorityBadge priority={item.priority} />
        <div className="flex items-center gap-2 text-[12px] text-muted">
          {item.media.length > 0 && <span className="inline-flex items-center gap-0.5"><Paperclip className="size-3.5" />{item.media.length}</span>}
          {item.publishDate && <span className="num inline-flex items-center gap-1"><CalendarDays className="size-3.5" />{fmtShort(item.publishDate)}</span>}
          <Avatar name={item.assignee} size={20} />
        </div>
      </div>
    </Link>
  );
}
