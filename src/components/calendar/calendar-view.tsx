"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { EmptyState, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { StatusBadge } from "@/components/badges";
import { PlatformStack } from "@/components/platform";
import { addDays, addMonths, fmtLong, fmtMonth, fmtShort, fmtWeekday, monthGrid, startOfMonth, startOfWeek, today } from "@/lib/dates";
import { PLATFORM_META, STATUS_META } from "@/lib/meta";
import { upcoming } from "@/lib/select";
import { hub, useHub } from "@/lib/store";
import { PLATFORMS, STATUSES, type ContentItem } from "@/lib/types";
import { uiActions } from "@/lib/ui";
import { DayCell } from "./day-cell";
import { UnscheduledPanel, UpcomingPanel } from "./side-panels";

type View = "month" | "week";
const SCHEDULABLE = ["planned", "production", "editing", "review", "approved"];
const sel = "h-8 w-auto min-w-0 max-w-[10.5rem] py-0 text-[12.5px] font-bold";

export function CalendarView() {
  const state = useHub();
  const [view, setView] = useState<View>("month");
  const [anchor, setAnchor] = useState(today());
  const [selected, setSelected] = useState(today());
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const filtered = useMemo(() => state.items.filter((i) => (!platform || i.platforms.includes(platform as never)) && (!status || i.status === status)), [state.items, platform, status]);
  const byDay = useMemo(() => {
    const m = new Map<string, ContentItem[]>();
    for (const i of filtered) if (i.publishDate) m.set(i.publishDate, [...(m.get(i.publishDate) ?? []), i]);
    m.forEach((l) => l.sort((a, b) => a.title.localeCompare(b.title)));
    return m;
  }, [filtered]);
  const unscheduled = useMemo(() => filtered.filter((i) => !i.publishDate && SCHEDULABLE.includes(i.status)), [filtered]);
  const soon = useMemo(() => upcoming(filtered).filter((i) => i.publishDate! <= addDays(today(), 7)).slice(0, 8), [filtered]);

  const t = today();
  const days = view === "month" ? monthGrid(anchor) : Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(anchor), i));
  const title = view === "month" ? fmtMonth(anchor) : `${fmtShort(days[0])} – ${fmtShort(days[6])}`;
  const step = (n: number) => setAnchor((a) => (view === "month" ? addMonths(startOfMonth(a), n) : addDays(a, 7 * n)));
  const empty = byDay.size === 0 && unscheduled.length === 0;

  const schedule = (id: string, day: string) => {
    setDragId(null);
    const item = state.items.find((c) => c.id === id);
    if (!item || item.publishDate === day) return;
    hub.updateItem(id, { publishDate: day });
    if (item.status === "approved") hub.moveItem(id, "scheduled");
    toast.success(`Moved to ${fmtShort(day)}`);
  };
  const dnd = { dragId, onDragStart: setDragId, onDragEnd: () => setDragId(null) };
  const switchView = (v: View) => { setView(v); setAnchor(v === "week" ? selected : anchor); };
  const dayItems = byDay.get(selected) ?? [];

  return (
    <div className="cz-page">
      <PageHeader title="Content Calendar" subtitle="Plan, move and schedule what goes live."
        actions={
          <>
            <div role="group" aria-label="Calendar view" className="inline-flex rounded-lg border border-hairline-strong bg-page p-0.5">
              {(["month", "week"] as const).map((v) => (
                <button key={v} type="button" aria-pressed={view === v} onClick={() => switchView(v)}
                  className={cn("h-8 rounded-md px-3 text-[13px] font-bold capitalize transition-colors", view === v ? "bg-deep text-cream" : "text-ink hover:bg-wash")}>{v}</button>
              ))}
            </div>
            <Button onClick={() => uiActions.openContent({ publishDate: selected, status: "planned" })}><Plus />Schedule content</Button>
          </>
        } />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <Button variant="outline" className="size-8 px-0" aria-label={view === "month" ? "Previous month" : "Previous week"} onClick={() => step(-1)}><ChevronLeft /></Button>
          <Button variant="outline" className="h-8 px-3" onClick={() => { setAnchor(t); setSelected(t); }}>Today</Button>
          <Button variant="outline" className="size-8 px-0" aria-label={view === "month" ? "Next month" : "Next week"} onClick={() => step(1)}><ChevronRight /></Button>
        </div>
        <h2 className="num min-w-0 text-[17px] font-bold text-deep" aria-live="polite">{title}</h2>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Select aria-label="Platform" className={sel} value={platform} onChange={(e) => setPlatform(e.target.value)}><option value="">All platforms</option>{PLATFORMS.map((p) => <option key={p} value={p}>{PLATFORM_META[p].label}</option>)}</Select>
          <Select aria-label="Status" className={sel} value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}</Select>
        </div>
      </div>

      {empty ? (
        <EmptyState icon={CalendarDays} title="Your calendar is clear." text={platform || status ? "Nothing matches these filters." : "Schedule your first piece of content to see it here."} action="Schedule Content" onAction={() => uiActions.openContent()} />
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-xl border border-hairline">
              {view === "month" && (
                <div className="grid grid-cols-7 border-b border-hairline bg-wash">
                  {days.slice(0, 7).map((d) => <div key={d} className="eyebrow px-2 py-2 text-center sm:text-left">{fmtWeekday(d)}</div>)}
                </div>
              )}
              <div className={cn("grid gap-px bg-hairline", view === "month" ? "grid-cols-7" : "grid-cols-1 sm:grid-cols-7")}>
                {days.map((d) => (
                  <DayCell key={d} day={d} items={byDay.get(d) ?? []} week={view === "week"} muted={view === "month" && d.slice(0, 7) !== anchor.slice(0, 7)} isToday={d === t} selected={d === selected}
                    expanded={expanded === d} onSelect={() => setSelected(d)} onToggle={() => setExpanded((e) => (e === d ? null : d))} onAdd={() => uiActions.openContent({ publishDate: d, status: "planned" })}
                    onDropItem={schedule} {...dnd} />
                ))}
              </div>
            </div>
            {view === "month" && (
              <section className="mt-3 rounded-xl border border-hairline p-3 sm:hidden" aria-label={`Content on ${fmtLong(selected)}`}>
                <div className="mb-2 flex items-center justify-between"><h3 className="text-[13px] font-bold text-deep">{fmtLong(selected)}</h3>
                  <Button variant="subtle" className="h-7 px-2.5 text-[12px]" onClick={() => uiActions.openContent({ publishDate: selected, status: "planned" })}><Plus />Add</Button></div>
                {dayItems.length === 0 ? <p className="text-[13px] text-muted">Nothing scheduled.</p> : (
                  <ul className="flex flex-col gap-2">{dayItems.map((i) => (
                    <li key={i.id}><Link href={`/content/${i.id}`} className="flex items-center gap-2 rounded-lg border border-hairline px-2.5 py-2">
                      <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-ink">{i.title}</span><PlatformStack platforms={i.platforms} max={2} /><StatusBadge status={i.status} />
                    </Link></li>))}</ul>
                )}
              </section>
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <UnscheduledPanel items={unscheduled} onSchedule={schedule} {...dnd} />
            <UpcomingPanel items={soon} />
          </div>
        </div>
      )}
    </div>
  );
}
