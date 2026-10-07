"use client";
import { useState } from "react";
import { Lightbulb, Search } from "lucide-react";
import { Capture } from "@/components/ideas/capture";
import { IdeaRow } from "@/components/ideas/idea-card";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/cn";
import { ideas } from "@/lib/select";
import { useHub } from "@/lib/store";

const TABS = [["all", "All"], ["idea", "Ideas"], ["hook", "Hooks"]] as const;

/** Newest first. Used on Home (a short stream) and on the Ideas page (everything, searchable). */
export function IdeaStream({ limit, showTools }: { limit?: number; showTools?: boolean }) {
  const s = useHub();
  const [tab, setTab] = useState<"all" | "idea" | "hook">("all");
  const [q, setQ] = useState("");
  const all = ideas(s.items);
  const needle = q.trim().toLowerCase();
  const list = all
    .filter((i) => tab === "all" || (tab === "hook") === i.tags.includes("hook"))
    .filter((i) => !needle || `${i.title} ${i.description}`.toLowerCase().includes(needle))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b border-hairline">
        <div className="flex gap-5">
          {TABS.map(([k, label]) => (
            <button key={k} type="button" onClick={() => setTab(k)} className={cn("-mb-px border-b-2 pb-2.5 text-[14px] font-bold transition-colors", tab === k ? "border-deep text-deep" : "border-transparent text-muted hover:text-ink")}>{label}</button>
          ))}
        </div>
        {showTools && <label className="mb-2 flex h-9 items-center gap-2 rounded-lg bg-wash px-3 text-muted"><Search className="size-4" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search ideas" className="w-32 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-muted sm:w-48" /></label>}
      </div>
      {list.length === 0
        ? <div className="flex flex-col items-center py-14 text-center text-muted"><Lightbulb className="size-6" /><p className="mt-3 text-[14px]">{all.length === 0 ? "Nothing yet. Type something above." : "Nothing matches."}</p></div>
        : <ul className="divide-y divide-hairline">{list.map((i) => <IdeaRow key={i.id} idea={i} />)}</ul>}
    </div>
  );
}

export function IdeaVault() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Ideas & hooks" subtitle="Everything you've jotted down." />
      <div className="mb-8"><Capture /></div>
      <IdeaStream showTools />
    </div>
  );
}
