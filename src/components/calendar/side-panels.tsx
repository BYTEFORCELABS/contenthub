"use client";
import Link from "next/link";
import { CalendarClock, CalendarPlus } from "lucide-react";
import { cn } from "@/lib/cn";
import { Panel } from "@/components/page-header";
import { statusDot } from "@/components/badges";
import { PlatformStack } from "@/components/platform";
import { Input } from "@/components/ui/field";
import { fmtShort, relative } from "@/lib/dates";
import { STATUS_META } from "@/lib/meta";
import type { ContentItem } from "@/lib/types";
import { CalChip } from "./chip";

/** Work that has no date yet. Drag onto a day, or pick a date for keyboard and touch use. */
export function UnscheduledPanel({ items, dragId, onDragStart, onDragEnd, onSchedule }: {
  items: ContentItem[]; dragId: string | null; onDragStart: (id: string) => void; onDragEnd: () => void; onSchedule: (id: string, day: string) => void;
}) {
  return (
    <Panel title="Unscheduled" action={<span className="num text-[12px] text-muted">{items.length}</span>} pad={false}>
      {items.length === 0 ? (
        <p className="flex items-center gap-2 p-4 text-[13px] text-muted"><CalendarPlus className="size-4 text-bronze" />Everything in the pipeline has a date.</p>
      ) : (
        <>
          <p className="px-4 pt-3 text-[12px] text-muted">Drag onto a day, or pick a date.</p>
          <ul className="flex max-h-[360px] flex-col gap-2 overflow-y-auto p-3">
            {items.map((i) => (
              <li key={i.id} className="flex flex-col gap-1.5">
                <CalChip item={i} detail dragging={dragId === i.id} onDragStart={onDragStart} onDragEnd={onDragEnd} />
                <Input type="date" aria-label={`Schedule date for ${i.title}`} value="" onChange={(e) => e.target.value && onSchedule(i.id, e.target.value)} className="h-7 text-[12px]" />
              </li>
            ))}
          </ul>
        </>
      )}
    </Panel>
  );
}

export function UpcomingPanel({ items }: { items: ContentItem[] }) {
  return (
    <Panel title="Upcoming" action={<span className="text-[12px] text-muted">Next 7 days</span>} pad={false}>
      {items.length === 0 ? (
        <p className="flex items-center gap-2 p-4 text-[13px] text-muted"><CalendarClock className="size-4 text-bronze" />Nothing due this week.</p>
      ) : (
        <ul className="divide-y divide-hairline">
          {items.map((i) => (
            <li key={i.id}>
              <Link href={`/content/${i.id}`} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-wash/60">
                <span className={cn("size-2 shrink-0 rounded-full", statusDot(i.status))} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-ink">{i.title}</span>
                  <span className="text-[12px] text-muted">{STATUS_META[i.status].label} · <span className="num">{fmtShort(i.publishDate!)}</span> · {relative(i.publishDate!)}</span>
                </span>
                <PlatformStack platforms={i.platforms} max={2} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
