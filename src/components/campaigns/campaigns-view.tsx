"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Megaphone, Plus } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { campaignStats } from "@/lib/select";
import { hub, useHub } from "@/lib/store";
import { CampaignCard } from "./campaign-card";
import { CampaignFormDialog } from "./campaign-form";

export function CampaignsView() {
  const state = useHub();
  const router = useRouter();
  const params = useSearchParams();
  const [local, setLocal] = useState(false);
  const open = local || params.get("new") === "1";
  const setOpen = (o: boolean) => {
    setLocal(o);
    if (!o && params.get("new")) router.replace("/campaigns");
  };

  return (
    <div className="cz-page">
      <PageHeader title="Campaigns" subtitle="Group content into focused pushes with a goal and a window."
        actions={<Button onClick={() => setOpen(true)}><Plus />Create campaign</Button>} />
      {state.campaigns.length === 0 ? (
        <EmptyState icon={Megaphone} title="Organize your content into focused campaigns." text="A campaign groups related content under one goal, so you can track it from idea to published." action="Create Campaign" onAction={() => setOpen(true)} />
      ) : (
        <div className="cz-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {state.campaigns.map((c) => <CampaignCard key={c.id} campaign={c} stats={campaignStats(state.items, c.id)} />)}
        </div>
      )}
      <CampaignFormDialog open={open} onOpenChange={setOpen} title="Create campaign" submitLabel="Create campaign"
        onSubmit={(d) => { const c = hub.addCampaign(d); toast.success(`Campaign created: ${c.name}`); setLocal(false); router.push(`/campaigns/${c.id}`); }} />
    </div>
  );
}
