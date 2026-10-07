"use client";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/badges";
import { PlatformStack } from "@/components/platform";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/field";
import { matches } from "@/lib/select";
import { hub, useHub } from "@/lib/store";
import type { Campaign } from "@/lib/types";
import { uiActions } from "@/lib/ui";

function List({ campaign }: { campaign: Campaign }) {
  const state = useHub();
  const [q, setQ] = useState("");
  const free = state.items.filter((i) => !i.campaignId);
  const list = free.filter((i) => matches(state, i, q));
  return (
    <>
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search content…" aria-label="Search content to add" className="pl-8" autoFocus />
      </div>
      {list.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-muted">{free.length === 0 ? "Every piece of content already belongs to a campaign." : "No content matches your search."}</p>
      ) : (
        <ul className="divide-y divide-hairline rounded-lg border border-hairline">
          {list.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2.5">
              <span className="min-w-0 flex-1 basis-40 truncate text-[13.5px] font-bold text-ink">{i.title}</span>
              <PlatformStack platforms={i.platforms} max={2} />
              <StatusBadge status={i.status} />
              <Button variant="subtle" className="h-7 px-2.5 text-[12px]" aria-label={`Add ${i.title} to ${campaign.name}`}
                onClick={() => { hub.updateItem(i.id, { campaignId: campaign.id }); toast.success("Added to campaign"); }}><Plus />Add</Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function AddContentDialog({ campaign, open, onOpenChange }: { campaign: Campaign; open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Add content to campaign" description={`Attach existing content to ${campaign.name}.`} className="max-w-xl"
      footer={<>
        <Button variant="outline" onClick={() => { onOpenChange(false); uiActions.openContent({ campaignId: campaign.id }); }}><Plus />New content</Button>
        <Button onClick={() => onOpenChange(false)}>Done</Button>
      </>}>
      <List campaign={campaign} />
    </Dialog>
  );
}
