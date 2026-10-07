import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { Campaign } from "@/lib/types";
import { StageBar, StatChips, dateRange, type Stats } from "./bits";

export function CampaignCard({ campaign, stats }: { campaign: Campaign; stats: Stats }) {
  return (
    <Link href={`/campaigns/${campaign.id}`} className="group flex flex-col gap-3 rounded-xl border border-hairline bg-page p-4 transition-[border-color,box-shadow] hover:border-deep/30 hover:shadow-[0_6px_16px_-8px_rgb(36_26_18/0.25)]">
      <div className="min-w-0">
        <h2 className="truncate text-[16px] font-bold text-deep group-hover:text-bronze">{campaign.name}</h2>
        <p className="mt-1 line-clamp-2 min-h-[2.6em] text-[13.5px] leading-snug text-muted">{campaign.description || "No description yet."}</p>
      </div>
      <div className="num flex items-center gap-1.5 text-[12.5px] text-muted"><CalendarDays className="size-3.5 text-bronze" />{dateRange(campaign)}</div>
      <StageBar stats={stats} />
      <StatChips stats={stats} />
    </Link>
  );
}
