"use client";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { StatusBadge, statusDot } from "@/components/badges";
import { PlatformGlyph, PlatformStack } from "@/components/platform";
import { FORMAT_META, STATUS_META } from "@/lib/meta";
import type { ContentItem } from "@/lib/types";

export const DRAG_TYPE = "text/hub-item";

/** Draggable link to the content workspace. `detail` adds format and a full status badge (week view). */
export function CalChip({ item, detail, dragging, onDragStart, onDragEnd }: {
  item: ContentItem; detail?: boolean; dragging?: boolean; onDragStart: (id: string) => void; onDragEnd: () => void;
}) {
  const tip = `${item.title} · ${FORMAT_META[item.format].label} · ${STATUS_META[item.status].label}`;
  return (
    <Link href={`/content/${item.id}`} title={tip} draggable
      onDragStart={(e) => { e.dataTransfer.setData(DRAG_TYPE, item.id); e.dataTransfer.setData("text/plain", item.id); e.dataTransfer.effectAllowed = "move"; onDragStart(item.id); }}
      onDragEnd={onDragEnd}
      className={cn("group/chip block min-w-0 cursor-grab rounded-md border border-hairline bg-page px-1.5 py-1 text-[12px] leading-tight transition-[border-color,opacity] hover:border-deep/30 active:cursor-grabbing", dragging && "opacity-40")}>
      <span className="flex min-w-0 items-center gap-1.5">
        {item.platforms[0] && <PlatformGlyph platform={item.platforms[0]} className="size-3.5 shrink-0 text-deep" />}
        <span className={cn("min-w-0 flex-1 font-bold text-ink group-hover/chip:text-deep", detail ? "line-clamp-2" : "truncate")}>{item.title}</span>
        {!detail && <><span className={cn("size-2 shrink-0 rounded-full", statusDot(item.status))} aria-hidden /><span className="sr-only">{STATUS_META[item.status].label}</span></>}
      </span>
      {detail && (
        <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
          <PlatformStack platforms={item.platforms} max={2} />
          <span>{FORMAT_META[item.format].label}</span>
          <StatusBadge status={item.status} />
        </span>
      )}
    </Link>
  );
}
