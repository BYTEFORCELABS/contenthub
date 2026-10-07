"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Trash2 } from "lucide-react";
import { PillarBadge, PriorityBadge, TagChip } from "@/components/badges";
import { PlatformStack } from "@/components/platform";
import { ConfirmDialog } from "@/components/confirm";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/dates";
import { FORMAT_META } from "@/lib/meta";
import { byId } from "@/lib/select";
import { hub } from "@/lib/store";
import type { ContentItem, HubState } from "@/lib/types";

/** One idea in the vault. "Develop" promotes it to Planned, which is where it appears on the content board. */
export function IdeaCard({ idea, state }: { idea: ContentItem; state: HubState }) {
  const router = useRouter();
  const [del, setDel] = useState(false);
  const campaign = byId(state.campaigns, idea.campaignId);
  return (
    <article className="flex flex-col rounded-xl border border-hairline bg-page p-4 transition-[border-color,box-shadow] hover:border-deep/30 hover:shadow-[0_6px_16px_-8px_rgb(36_26_18/0.2)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-bold leading-snug text-ink"><Link href={`/content/${idea.id}`} className="hover:text-deep">{idea.title}</Link></h3>
        <PriorityBadge priority={idea.priority} />
      </div>
      {idea.description && <p className="mt-1.5 line-clamp-3 text-[13px] text-muted">{idea.description}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-muted">
        <PillarBadge pillar={byId(state.pillars, idea.pillarId)} />
        <PlatformStack platforms={idea.platforms} />
        <span>{FORMAT_META[idea.format].label}</span>
      </div>
      {idea.tags.length > 0 && <div className="mt-2.5 flex flex-wrap gap-1">{idea.tags.slice(0, 4).map((t) => <TagChip key={t}>{t}</TagChip>)}</div>}
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="text-[11.5px] text-muted">{campaign ? `${campaign.name} · ` : ""}{timeAgo(idea.createdAt)}</span>
        <div className="flex items-center gap-1">
          <Button variant="danger-ghost" className="size-8 px-0" aria-label={`Delete idea ${idea.title}`} onClick={() => setDel(true)}><Trash2 /></Button>
          <Button variant="subtle" className="h-8" onClick={() => { hub.moveItem(idea.id, "planned"); toast.success("Moved to Planned", { description: idea.title, action: { label: "Open", onClick: () => router.push(`/content/${idea.id}`) } }); }}>Develop<ArrowRight /></Button>
        </div>
      </div>
      <ConfirmDialog open={del} onOpenChange={setDel} title="Delete this idea?" description={`"${idea.title}" will be removed permanently.`} onConfirm={() => { hub.deleteItem(idea.id); toast.success("Idea deleted"); }} />
    </article>
  );
}
