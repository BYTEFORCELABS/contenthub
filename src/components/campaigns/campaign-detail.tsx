"use client";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { CheckCheck, ChevronLeft, Clock, Layers, Lightbulb, Pencil, Plus, Sparkles, Target, Trash2, Unlink, CalendarDays, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Panel, StatCard } from "@/components/page-header";
import { StatusBadge } from "@/components/badges";
import { PlatformStack } from "@/components/platform";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { fmtShort } from "@/lib/dates";
import { byId, campaignStats } from "@/lib/select";
import { hub, useHub } from "@/lib/store";
import { uiActions } from "@/lib/ui";
import { AddContentDialog } from "./add-content-dialog";
import { StageBar, STAT_FIELDS, dateRange } from "./bits";
import { CampaignFormDialog } from "./campaign-form";

const ICONS: Record<string, LucideIcon> = { total: Layers, published: CheckCheck, scheduled: Clock, inProduction: Sparkles, idea: Lightbulb };
const noop = () => () => {};

export function CampaignDetail({ id }: { id: string }) {
  const state = useHub();
  const router = useRouter();
  // The server renders the seed; wait for the stored data before deciding a campaign is missing.
  const ready = useSyncExternalStore(noop, () => true, () => false);
  const [dlg, setDlg] = useState<null | "edit" | "delete" | "add">(null);
  const [leaving, setLeaving] = useState(false);
  const [withContent, setWithContent] = useState(false);
  const campaign = byId(state.campaigns, id);

  if (leaving) return null;
  if (!ready) return <div className="skeleton h-64" aria-busy="true" aria-label="Loading campaign" />;
  if (!campaign) notFound();

  const items = state.items.filter((i) => i.campaignId === id).sort((a, b) => (a.publishDate ?? "9999").localeCompare(b.publishDate ?? "9999") || a.title.localeCompare(b.title));
  const stats = campaignStats(state.items, id);

  return (
    <div className="cz-page">
      <Link href="/campaigns" className="mb-3 inline-flex items-center gap-1 text-[13px] font-bold text-bronze hover:text-deep"><ChevronLeft className="size-4" />Campaigns</Link>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 max-w-3xl">
          <h1 className="text-[26px] font-bold leading-tight text-deep sm:text-[30px]">{campaign.name}</h1>
          {campaign.description && <p className="mt-1.5 text-[14px] text-muted">{campaign.description}</p>}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-muted">
            <span className="num inline-flex items-center gap-1.5"><CalendarDays className="size-4 text-bronze" />{dateRange(campaign)}</span>
            {campaign.goal && <span className="inline-flex items-center gap-1.5"><Target className="size-4 text-bronze" />Goal: <b className="text-ink">{campaign.goal}</b></span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setDlg("edit")}><Pencil />Edit</Button>
          <Button variant="danger-ghost" onClick={() => setDlg("delete")}><Trash2 />Delete</Button>
        </div>
      </div>

      <div className="cz-stagger grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {STAT_FIELDS.map((f) => <StatCard key={f.key} label={f.label} value={stats[f.key]} note={f.note} icon={ICONS[f.key]} />)}
      </div>

      <Panel title="Stage breakdown" className="mt-5"><StageBar stats={stats} legend /></Panel>

      <Panel title="Content" className="mt-5" pad={false}
        action={<div className="flex gap-2"><Button variant="outline" className="h-8 px-3 text-[12.5px]" onClick={() => uiActions.openContent({ campaignId: id })}><Plus />New content</Button><Button className="h-8 px-3 text-[12.5px]" onClick={() => setDlg("add")}><Plus />Add content to campaign</Button></div>}>
        {items.length === 0 ? (
          <p className="p-6 text-center text-[13.5px] text-muted">No content in this campaign yet. Add existing content or create something new.</p>
        ) : (
          <div className="p-4">
            <div className="mb-1 text-[14px] font-bold text-deep">{campaign.name}</div>
            <ul>
              {items.map((i, k) => (
                <li key={i.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg py-1.5 pr-1 hover:bg-wash/60">
                  <span className="whitespace-pre font-mono text-[13px] leading-none text-hairline-strong" aria-hidden>{k === items.length - 1 ? "└──" : "├──"}</span>
                  <Link href={`/content/${i.id}`} className="min-w-0 flex-1 basis-40 truncate text-[13.5px] font-bold text-ink hover:text-deep">{i.title}</Link>
                  <PlatformStack platforms={i.platforms} max={3} />
                  <StatusBadge status={i.status} />
                  <span className="num w-14 text-[12.5px] text-muted">{i.publishDate ? fmtShort(i.publishDate) : "No date"}</span>
                  <Button variant="ghost" className="h-7 px-2 text-[12px] text-muted" aria-label={`Remove ${i.title} from campaign`}
                    onClick={() => { hub.updateItem(i.id, { campaignId: null }); toast.success("Removed from campaign"); }}><Unlink />Remove</Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Panel>

      <CampaignFormDialog open={dlg === "edit"} onOpenChange={(o) => setDlg(o ? "edit" : null)} initial={campaign} title="Edit campaign" submitLabel="Save changes"
        onSubmit={(d) => { hub.updateCampaign(id, d); toast.success("Campaign updated"); setDlg(null); }} />
      <AddContentDialog campaign={campaign} open={dlg === "add"} onOpenChange={(o) => setDlg(o ? "add" : null)} />
      <Dialog open={dlg === "delete"} onOpenChange={(o) => { setDlg(o ? "delete" : null); if (!o) setWithContent(false); }} title="Delete this campaign?"
        description={withContent ? `"${campaign.name}" and its ${items.length} piece${items.length === 1 ? "" : "s"} of content will be removed permanently.` : `"${campaign.name}" will be removed. Its ${items.length} piece${items.length === 1 ? "" : "s"} of content stay in the hub, just without a campaign.`}
        footer={<><Button variant="ghost" onClick={() => setDlg(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => { setLeaving(true); router.push("/campaigns"); hub.deleteCampaign(id, withContent); toast.success(withContent ? "Campaign and its content deleted" : "Campaign deleted"); }}><Trash2 />{withContent ? "Delete everything" : "Delete campaign"}</Button></>}>
        {items.length > 0 && (
          <label className="flex cursor-pointer items-start gap-2.5 text-[13.5px] text-ink">
            <input type="checkbox" checked={withContent} onChange={(e) => setWithContent(e.target.checked)} className="mt-0.5 size-4 accent-[var(--brand-deep)]" />
            <span>Also delete its {items.length} piece{items.length === 1 ? "" : "s"} of content<span className="block text-[12.5px] text-muted">This can&apos;t be undone.</span></span>
          </label>
        )}
      </Dialog>
    </div>
  );
}
