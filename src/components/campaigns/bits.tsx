import { cn } from "@/lib/cn";
import { statusDot } from "@/components/badges";
import { fmtShort } from "@/lib/dates";
import { STATUS_META } from "@/lib/meta";
import { campaignStats } from "@/lib/select";
import { STATUSES, type Campaign, type Status } from "@/lib/types";

export type Stats = ReturnType<typeof campaignStats>;

export const dateRange = (c: Pick<Campaign, "startDate" | "endDate">) =>
  c.startDate && c.endDate ? `${fmtShort(c.startDate)} – ${fmtShort(c.endDate)}` : c.startDate ? `From ${fmtShort(c.startDate)}` : c.endDate ? `Until ${fmtShort(c.endDate)}` : "No dates set";

/** Segmented bar: one segment per stage, widths proportional to counts. Legend adds the text the colours stand for. */
export function StageBar({ stats, legend, className }: { stats: Stats; legend?: boolean; className?: string }) {
  const parts = STATUSES.filter((s) => stats[s] > 0);
  const label = parts.length ? parts.map((s) => `${stats[s]} ${STATUS_META[s].label}`).join(", ") : "No content yet";
  return (
    <div className={className}>
      <div role="img" aria-label={label} className="flex h-2 gap-px overflow-hidden rounded-full bg-wash-strong">
        {parts.map((s) => <span key={s} title={`${STATUS_META[s].label}: ${stats[s]}`} className={cn("h-full", statusDot(s))} style={{ width: `${(stats[s] / stats.total) * 100}%` }} />)}
      </div>
      {legend && (
        <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-muted">
          {parts.length === 0 ? <li>No content yet</li> : parts.map((s: Status) => (
            <li key={s} className="inline-flex items-center gap-1.5"><i className={cn("size-2 rounded-full", statusDot(s))} aria-hidden />{STATUS_META[s].label} <b className="num text-ink">{stats[s]}</b></li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const STAT_FIELDS: { key: "total" | "published" | "scheduled" | "inProduction" | "idea"; label: string; note: string }[] = [
  { key: "total", label: "Total content", note: "pieces in this campaign" },
  { key: "published", label: "Published", note: "live" },
  { key: "scheduled", label: "Scheduled", note: "queued to go live" },
  { key: "inProduction", label: "In production", note: "in production, editing or review" },
  { key: "idea", label: "Ideas", note: "not yet committed to" },
];

export function StatChips({ stats }: { stats: Stats }) {
  return (
    <dl className="flex flex-wrap gap-1.5">
      {STAT_FIELDS.map((f) => (
        <div key={f.key} className="inline-flex items-baseline gap-1.5 rounded-md bg-wash px-2 py-1">
          <dd className="num text-[13px] font-bold text-deep">{stats[f.key]}</dd><dt className="text-[11.5px] text-muted">{f.label}</dt>
        </div>
      ))}
    </dl>
  );
}
