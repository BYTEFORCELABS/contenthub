"use client";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { addDays, today } from "@/lib/dates";
import { FORMAT_META, PLATFORM_META, PRIORITY_META, STATUS_META } from "@/lib/meta";
import { matches } from "@/lib/select";
import { FORMATS, PLATFORMS, PRIORITIES, STATUSES, type ContentItem, type HubState } from "@/lib/types";

export type Filters = { q: string; status: string; platform: string; pillar: string; campaign: string; priority: string; date: string; format: string; assignee: string };
export const NO_FILTERS: Filters = { q: "", status: "", platform: "", pillar: "", campaign: "", priority: "", date: "", format: "", assignee: "" };

const DATES = [["week", "This week"], ["next7", "Next 7 days"], ["month", "This month"], ["scheduled", "Has a date"], ["none", "No date"]] as const;

export function applyFilters(s: HubState, items: ContentItem[], f: Filters) {
  const t = today();
  return items.filter((i) => {
    if (f.q && !matches(s, i, f.q)) return false;
    if (f.status && i.status !== f.status) return false;
    if (f.platform && !i.platforms.includes(f.platform as never)) return false;
    if (f.pillar && i.pillarId !== f.pillar) return false;
    if (f.campaign && (f.campaign === "none" ? i.campaignId !== null : i.campaignId !== f.campaign)) return false;
    if (f.priority && i.priority !== f.priority) return false;
    if (f.format && i.format !== f.format) return false;
    if (f.assignee && (f.assignee === "none" ? i.assignee !== null : i.assignee !== f.assignee)) return false;
    if (f.date) {
      const d = i.publishDate;
      if (f.date === "none") return !d;
      if (!d) return false;
      if (f.date === "next7") return d >= t && d <= addDays(t, 7);
      if (f.date === "month") return d.slice(0, 7) === t.slice(0, 7);
      if (f.date === "week") { const dow = (new Date().getDay() + 6) % 7; return d >= addDays(t, -dow) && d <= addDays(t, 6 - dow); }
    }
    return true;
  });
}

export function useFilters(initial: Partial<Filters> = {}) {
  const [f, setF] = useState<Filters>({ ...NO_FILTERS, ...initial });
  const active = useMemo(() => Object.entries(f).filter(([k, v]) => k !== "q" && v).length, [f]);
  return { filters: f, set: (patch: Partial<Filters>) => setF((p) => ({ ...p, ...patch })), clear: () => setF({ ...NO_FILTERS, ...initial }), active };
}

const sel = "h-8 w-auto min-w-0 max-w-[10.5rem] py-0 text-[12.5px] font-bold";

/** Search box plus the eight filters. `hide` drops filters that a page already fixes (for example status on the Ideas page). */
export function FilterBar({ state, filters, set, clear, active, hide = [], placeholder = "Search title, tag, platform…", count }: {
  state: HubState; filters: Filters; set: (p: Partial<Filters>) => void; clear: () => void; active: number; hide?: (keyof Filters)[]; placeholder?: string; count?: string;
}) {
  const show = (k: keyof Filters) => !hide.includes(k);
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative min-w-52 flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <Input value={filters.q} onChange={(e) => set({ q: e.target.value })} placeholder={placeholder} aria-label="Filter by text" className="h-8 pl-8 text-[13px]" />
      </div>
      <Button variant="outline" className="h-8 px-2.5 text-[12.5px] sm:hidden" aria-expanded={open} onClick={() => setOpen(!open)}><SlidersHorizontal />Filters{active > 0 && ` (${active})`}</Button>
      <div className={cn("w-full flex-wrap items-center gap-2 sm:contents", open ? "flex" : "hidden sm:contents")}>
      {show("status") && <Select aria-label="Status" className={sel} value={filters.status} onChange={(e) => set({ status: e.target.value })}><option value="">Status</option>{STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}</Select>}
      {show("platform") && <Select aria-label="Platform" className={sel} value={filters.platform} onChange={(e) => set({ platform: e.target.value })}><option value="">Platform</option>{PLATFORMS.map((p) => <option key={p} value={p}>{PLATFORM_META[p].label}</option>)}</Select>}
      {show("pillar") && <Select aria-label="Content pillar" className={sel} value={filters.pillar} onChange={(e) => set({ pillar: e.target.value })}><option value="">Pillar</option>{state.pillars.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select>}
      {show("campaign") && <Select aria-label="Campaign" className={sel} value={filters.campaign} onChange={(e) => set({ campaign: e.target.value })}><option value="">Campaign</option><option value="none">No campaign</option>{state.campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>}
      {show("priority") && <Select aria-label="Priority" className={sel} value={filters.priority} onChange={(e) => set({ priority: e.target.value })}><option value="">Priority</option>{PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_META[p].label}</option>)}</Select>}
      {show("format") && <Select aria-label="Content format" className={sel} value={filters.format} onChange={(e) => set({ format: e.target.value })}><option value="">Format</option>{FORMATS.map((p) => <option key={p} value={p}>{FORMAT_META[p].label}</option>)}</Select>}
      {show("date") && <Select aria-label="Date" className={sel} value={filters.date} onChange={(e) => set({ date: e.target.value })}><option value="">Date</option>{DATES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select>}
      {show("assignee") && <Select aria-label="Assignee" className={sel} value={filters.assignee} onChange={(e) => set({ assignee: e.target.value })}><option value="">Assignee</option><option value="none">Unassigned</option>{state.people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select>}
      </div>
      {(active > 0 || filters.q) && <Button variant="ghost" className="h-8 px-2.5 text-[12.5px]" onClick={clear}><X />Clear{active > 0 && ` (${active})`}</Button>}
      {count && <span className="num ml-auto text-[12.5px] text-muted">{count}</span>}
    </div>
  );
}
