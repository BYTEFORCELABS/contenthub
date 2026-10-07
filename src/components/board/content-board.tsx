"use client";
import { useState } from "react";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ContentWorkspace } from "@/components/workspace/content-workspace";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { KanbanColumn } from "@/components/board/kanban-column";
import { FilterBar, applyFilters, useFilters } from "@/components/filters";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { fmtShort } from "@/lib/dates";
import { PRIORITY_META, STATUS_META } from "@/lib/meta";
import { hub, useHub } from "@/lib/store";
import { uiActions } from "@/lib/ui";
import { STATUSES, type Status } from "@/lib/types";

export function ContentBoard() {
  const s = useHub();
  const f = useFilters();
  const [dragId, setDragId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const shown = applyFilters(s, s.items, f.filters);

  const move = (id: string, to: Status) => {
    const item = s.items.find((i) => i.id === id);
    setDragId(null);
    if (!item || item.status === to) return;
    const { dateAssigned } = hub.moveItem(id, to);
    toast.success(`Moved to ${STATUS_META[to].label}`, { description: dateAssigned ? `${item.title}. Date set to ${fmtShort(dateAssigned)}; change it in the workspace.` : item.title });
  };
  const sorted = (st: Status) => shown.filter((i) => i.status === st).sort((a, b) => PRIORITY_META[a.priority].rank - PRIORITY_META[b.priority].rank || (a.publishDate ?? "9999").localeCompare(b.publishDate ?? "9999"));

  return (
    <div className="mx-auto max-w-[1800px]">
      <PageHeader title="Content Board" subtitle="Drag content through the workflow, from idea to published."
        actions={<Button onClick={() => uiActions.openContent({ status: "planned" })}><Plus />New content</Button>} />
      <FilterBar state={s} {...f} hide={["status"]} collapsible count={`${shown.length} of ${s.items.length} items`} />
      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8" tabIndex={0} aria-label="Content board, scrolls horizontally">
        <div className="flex h-[calc(100dvh-15rem)] min-h-[26rem] items-stretch gap-3">
          {STATUSES.map((st) => (
            <KanbanColumn key={st} status={st} items={sorted(st)} state={s} dragId={dragId} onDragStart={setDragId} onDragEnd={() => setDragId(null)} onDropItem={move} onMove={move} onOpen={setOpenId} />
          ))}
        </div>
      </div>
      <D.Root open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <D.Portal>
          <D.Overlay className="cz-overlay fixed inset-0 z-40 bg-ink/35 backdrop-blur-[2px]" />
          <D.Content aria-describedby={undefined} className="cz-dialog fixed inset-x-2 bottom-2 top-2 z-40 mx-auto flex max-w-6xl flex-col overflow-hidden rounded-2xl border border-hairline bg-page shadow-[0_24px_64px_-12px_rgb(36_26_18/0.35)] focus:outline-none sm:inset-y-5">
            <D.Title className="sr-only">Content workspace</D.Title>
            <D.Close aria-label="Close" className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-lg text-muted hover:bg-wash hover:text-ink"><X className="size-4" /></D.Close>
            <div className="min-h-0 flex-1 overflow-y-auto bg-wash/30 p-4 sm:p-6">{openId && <ContentWorkspace id={openId} modal onClose={() => setOpenId(null)} />}</div>
          </D.Content>
        </D.Portal>
      </D.Root>
    </div>
  );
}
