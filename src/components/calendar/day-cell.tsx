"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { statusDot } from "@/components/badges";
import { fmtLong, fmtShort, fmtWeekday } from "@/lib/dates";
import type { ContentItem } from "@/lib/types";
import { CalChip, DRAG_TYPE } from "./chip";

const MAX = 3;

/** One day: a drop target, a tap target on phones (dots only) and an add button. */
export function DayCell({ day, items, week, muted, isToday, selected, expanded, dragId, onSelect, onToggle, onAdd, onDropItem, onDragStart, onDragEnd }: {
  day: string; items: ContentItem[]; week: boolean; muted?: boolean; isToday: boolean; selected: boolean; expanded: boolean; dragId: string | null;
  onSelect: () => void; onToggle: () => void; onAdd: () => void; onDropItem: (id: string, day: string) => void; onDragStart: (id: string) => void; onDragEnd: () => void;
}) {
  const [over, setOver] = useState(false);
  const shown = week || expanded ? items : items.slice(0, MAX);
  const hidden = items.length - shown.length;
  const num = Number(day.slice(8));
  return (
    <div
      onDragOver={(e) => { if (e.dataTransfer.types.includes(DRAG_TYPE)) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setOver(true); } }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false); }}
      onDrop={(e) => { e.preventDefault(); setOver(false); const id = e.dataTransfer.getData(DRAG_TYPE); if (id) onDropItem(id, day); }}
      className={cn("group flex min-w-0 flex-col gap-1 bg-page p-1.5 transition-colors sm:p-2", week ? "sm:min-h-[280px]" : "min-h-14 sm:min-h-[112px]", muted && "bg-wash/60", over && "bg-wash-strong ring-2 ring-inset ring-deep/40", selected && "ring-1 ring-inset ring-deep/30 sm:ring-0")}>
      <div className="flex items-center justify-between gap-1">
        <button type="button" onClick={onSelect} aria-pressed={selected} aria-label={fmtLong(day)}
          className={cn("grid h-6 min-w-6 place-items-center rounded-full px-1 text-[12px] font-bold hover:bg-wash-strong", week && "sm:hidden", isToday ? "bg-deep text-cream hover:bg-deep" : muted ? "text-muted/60" : "text-ink")}>
          <span className="num">{week ? `${fmtWeekday(day)} ${num}` : num}</span>
        </button>
        {week && <span className={cn("num hidden h-6 min-w-6 place-items-center rounded-full px-1.5 text-[12px] font-bold sm:grid", isToday ? "bg-deep text-cream" : "text-ink")}>{fmtShort(day)}</span>}
        <button type="button" onClick={onAdd} aria-label={`Schedule content on ${fmtLong(day)}`} title="Schedule content"
          className={cn("hidden size-6 place-items-center rounded-md text-muted transition-opacity hover:bg-wash-strong hover:text-deep focus-visible:opacity-100 sm:grid sm:opacity-0 sm:group-hover:opacity-100", week && "grid opacity-100 sm:opacity-0")}>
          <Plus className="size-4" />
        </button>
      </div>
      {/* Phones, month view: dots only. The selected day's list is rendered below the grid. */}
      {!week && items.length > 0 && (
        <div className="flex flex-wrap gap-0.5 sm:hidden" aria-hidden>
          {items.slice(0, 4).map((i) => <i key={i.id} className={cn("size-1.5 rounded-full", statusDot(i.status))} />)}
          {items.length > 4 && <span className="text-[9px] leading-[6px] text-muted">+</span>}
        </div>
      )}
      <div className={cn("flex-col gap-1", week ? "flex" : "hidden sm:flex")}>
        {shown.map((i) => <CalChip key={i.id} item={i} detail={week} dragging={dragId === i.id} onDragStart={onDragStart} onDragEnd={onDragEnd} />)}
        {!week && (hidden > 0 || (expanded && items.length > MAX)) && (
          <button type="button" onClick={onToggle} aria-expanded={expanded} className="rounded-md px-1 py-0.5 text-left text-[11.5px] font-bold text-bronze hover:bg-wash-strong">
            {expanded ? "Show less" : `+${hidden} more`}
          </button>
        )}
      </div>
    </div>
  );
}
