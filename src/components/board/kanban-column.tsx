"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { statusDot } from "@/components/badges";
import { ContentCard } from "@/components/content-card";
import { Select } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { STATUS_META } from "@/lib/meta";
import { uiActions } from "@/lib/ui";
import { STATUSES, type ContentItem, type HubState, type Status } from "@/lib/types";

export function KanbanColumn({ status, items, state, dragId, onDragStart, onDragEnd, onDropItem, onMove }: {
  status: Status; items: ContentItem[]; state: HubState; dragId: string | null;
  onDragStart: (id: string) => void; onDragEnd: () => void; onDropItem: (id: string, to: Status) => void; onMove: (id: string, to: Status) => void;
}) {
  const [over, setOver] = useState(false);
  const dragging = dragId ? state.items.find((i) => i.id === dragId) : null;
  const canDrop = !!dragging && dragging.status !== status;
  return (
    <section aria-label={`${STATUS_META[status].label}, ${items.length} items`}
      onDragOver={(e) => { if (!dragId) return; e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (!over) setOver(true); }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false); }}
      onDrop={(e) => { e.preventDefault(); setOver(false); const id = e.dataTransfer.getData("text/plain") || dragId; if (id) onDropItem(id, status); }}
      className={cn("flex w-72 shrink-0 flex-col rounded-xl border bg-wash/60 transition-colors duration-150", over && canDrop ? "border-deep bg-wash-strong" : "border-hairline")}>
      <header className="flex items-center gap-2 px-3 pb-2 pt-3" title={STATUS_META[status].hint}>
        <span className={cn("size-2 rounded-full", statusDot(status))} />
        <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-deep">{STATUS_META[status].label}</h2>
        <span className="num rounded-full bg-page px-1.5 text-[11.5px] font-bold text-muted ring-1 ring-hairline">{items.length}</span>
        <button type="button" aria-label={`Add to ${STATUS_META[status].label}`} onClick={() => uiActions.openContent({ status })} className="ml-auto grid size-6 place-items-center rounded-md text-muted transition-colors hover:bg-page hover:text-deep"><Plus className="size-4" /></button>
      </header>
      <ul className="flex min-h-24 flex-1 flex-col gap-2 px-2 pb-2">
        {items.map((i) => (
          <li key={i.id} draggable onDragStart={(e) => { e.dataTransfer.setData("text/plain", i.id); e.dataTransfer.effectAllowed = "move"; onDragStart(i.id); }} onDragEnd={onDragEnd} className="cursor-grab active:cursor-grabbing">
            <ContentCard item={i} state={state} dragging={dragId === i.id} />
            <Select aria-label={`Move ${i.title}`} value={i.status} onChange={(e) => onMove(i.id, e.target.value as Status)} className="mt-1 hidden h-8 text-[12px] pointer-coarse:block">
              {STATUSES.map((s) => <option key={s} value={s}>Move to: {STATUS_META[s].label}</option>)}
            </Select>
          </li>
        ))}
        {items.length === 0 && (
          <li className={cn("grid flex-1 place-items-center rounded-lg border border-dashed px-3 py-6 text-center text-[12px] transition-colors", over && canDrop ? "border-deep text-deep" : "border-hairline-strong text-muted")}>
            {over && canDrop ? "Drop to move here" : "Nothing here yet"}
          </li>
        )}
      </ul>
    </section>
  );
}
