"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, FileText, Plus } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { PillarBadge, PriorityBadge, StatusBadge } from "@/components/badges";
import { FilterBar, applyFilters, useFilters } from "@/components/filters";
import { EmptyState, PageHeader } from "@/components/page-header";
import { PlatformStack } from "@/components/platform";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { fmtShort } from "@/lib/dates";
import { FORMAT_META, PRIORITY_META } from "@/lib/meta";
import { byId } from "@/lib/select";
import { useHub } from "@/lib/store";
import { uiActions } from "@/lib/ui";
import { STATUSES, type ContentItem } from "@/lib/types";

type Key = "title" | "status" | "priority" | "date";
const cmp: Record<Key, (a: ContentItem, b: ContentItem) => number> = {
  title: (a, b) => a.title.localeCompare(b.title),
  status: (a, b) => STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status),
  priority: (a, b) => PRIORITY_META[a.priority].rank - PRIORITY_META[b.priority].rank,
  date: (a, b) => (a.publishDate ?? "9999").localeCompare(b.publishDate ?? "9999"),
};
const cols = "lg:grid-cols-[minmax(0,2.6fr)_8.5rem_7rem_minmax(0,1.2fr)_5.5rem_5rem_2rem]";

export function AllContent() {
  const s = useHub();
  const sp = useSearchParams();
  const f = useFilters({ q: sp.get("q") ?? "", status: sp.get("status") ?? "", platform: sp.get("platform") ?? "" });
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: "date", dir: 1 });
  const list = applyFilters(s, s.items, f.filters).sort((a, b) => cmp[sort.key](a, b) * sort.dir);
  const th = (key: Key, label: string) => (
    <button type="button" onClick={() => setSort((p) => ({ key, dir: p.key === key ? (p.dir === 1 ? -1 : 1) : 1 }))} className={cn("inline-flex items-center gap-1 text-left hover:text-deep", sort.key === key && "text-deep")}>
      {label}{sort.key === key && (sort.dir === 1 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />)}
    </button>
  );
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="All Content" subtitle="Every idea and post in one list." actions={<Button onClick={() => uiActions.openContent()}><Plus />New content</Button>} />
      <FilterBar state={s} {...f} count={`${list.length} of ${s.items.length} items`} />
      {list.length === 0 ? (
        <EmptyState icon={FileText} title={s.items.length ? "Nothing matches these filters" : "No content yet"} text={s.items.length ? "Try removing a filter." : "Start with an idea, or create content directly."}
          action={s.items.length ? "Clear filters" : "+ Add Idea"} onAction={s.items.length ? f.clear : () => uiActions.openIdea()} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-hairline bg-page">
          <div className={cn("hidden gap-3 border-b border-hairline bg-wash/70 px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.12em] text-muted lg:grid", cols)}>
            {th("title", "Title")}{th("status", "Status")}<span>Platforms</span><span>Pillar</span>{th("priority", "Priority")}{th("date", "Date")}<span className="sr-only">Assignee</span>
          </div>
          <ul className="divide-y divide-hairline">
            {list.map((i) => (
              <li key={i.id}>
                <Link href={`/content/${i.id}`} className={cn("grid items-center gap-x-3 gap-y-1.5 px-4 py-3 transition-colors hover:bg-wash/60", cols)}>
                  <div className="min-w-0"><div className="truncate text-[14px] font-bold text-ink">{i.title}</div><div className="truncate text-[12px] text-muted">{FORMAT_META[i.format].label}{byId(s.campaigns, i.campaignId) && ` · ${byId(s.campaigns, i.campaignId)!.name}`}</div></div>
                  <div><StatusBadge status={i.status} /></div>
                  <div><PlatformStack platforms={i.platforms} /></div>
                  <div className="truncate"><PillarBadge pillar={byId(s.pillars, i.pillarId)} /></div>
                  <div><PriorityBadge priority={i.priority} /></div>
                  <div className="num text-[12.5px] text-muted">{i.publishDate ? fmtShort(i.publishDate) : "—"}</div>
                  <div className="hidden lg:block"><Avatar name={i.assignee} size={22} /></div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
