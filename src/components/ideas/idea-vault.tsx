"use client";
import { useState } from "react";
import { Lightbulb, Plus } from "lucide-react";
import { toast } from "sonner";
import { IdeaCard } from "@/components/ideas/idea-card";
import { FilterBar, applyFilters, useFilters } from "@/components/filters";
import { EmptyState, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { PRIORITY_META } from "@/lib/meta";
import { ideas } from "@/lib/select";
import { hub, useHub } from "@/lib/store";
import { uiActions } from "@/lib/ui";

export function IdeaVault() {
  const s = useHub();
  const f = useFilters();
  const [sort, setSort] = useState("newest");
  const [quick, setQuick] = useState("");
  const all = ideas(s.items);
  const list = applyFilters(s, all, f.filters).sort((a, b) => sort === "priority" ? PRIORITY_META[a.priority].rank - PRIORITY_META[b.priority].rank || b.createdAt.localeCompare(a.createdAt) : sort === "title" ? a.title.localeCompare(b.title) : b.createdAt.localeCompare(a.createdAt));

  const capture = () => {
    const title = quick.trim();
    if (!title) return;
    hub.addItem({ title, pillarId: f.filters.pillar || undefined });
    setQuick(""); toast.success("Idea captured", { description: title });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Content Ideas" subtitle="Capture ideas now. Turn them into content later."
        actions={<Button onClick={() => uiActions.openIdea()}><Plus />New Idea</Button>} />

      <form onSubmit={(e) => { e.preventDefault(); capture(); }} className="mb-5 flex items-center gap-2 rounded-xl border border-hairline bg-wash/60 p-2">
        <Lightbulb className="ml-2 size-4 shrink-0 text-bronze" />
        <Input value={quick} onChange={(e) => setQuick(e.target.value)} placeholder="Quick capture: type an idea and press Enter. Add the details later." aria-label="Quick capture an idea" className="border-transparent bg-transparent focus:border-transparent focus:ring-0" />
        <Button type="submit" variant="subtle" disabled={!quick.trim()}>Capture</Button>
      </form>

      <FilterBar state={s} {...f} hide={["status", "date", "assignee"]} placeholder="Search ideas…" count={`${list.length} of ${all.length} ideas`} />
      <div className="mb-4 -mt-1 flex items-center gap-2 text-[12.5px] text-muted"><label htmlFor="sort">Sort by</label>
        <Select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="h-8 w-auto py-0 text-[12.5px] font-bold"><option value="newest">Newest</option><option value="priority">Priority</option><option value="title">Title A–Z</option></Select></div>

      {all.length === 0 ? <EmptyState icon={Lightbulb} title="Your next great content idea starts here." text="Jot down anything. You can organise it later." action="+ Add Idea" onAction={() => uiActions.openIdea()} />
        : list.length === 0 ? <EmptyState compact icon={Lightbulb} title="No ideas match these filters" action="Clear filters" onAction={f.clear} />
        : <div className="cz-stagger grid gap-3 md:grid-cols-2 xl:grid-cols-3">{list.map((i) => <IdeaCard key={i.id} idea={i} state={s} />)}</div>}
    </div>
  );
}
