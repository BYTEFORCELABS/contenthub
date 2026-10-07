import { Check, CheckCheck, CircleDashed, CircleDot, Clock, Eye, Lightbulb, PencilLine, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { PRIORITY_META, STATUS_META } from "@/lib/meta";
import type { Pillar, Priority, Status } from "@/lib/types";

const STATUS_STYLE: Record<Status, { icon: LucideIcon; cls: string; dot: string }> = {
  idea: { icon: Lightbulb, cls: "text-status-draft bg-status-draft/8", dot: "bg-status-draft" },
  planned: { icon: CircleDashed, cls: "text-status-reconciled bg-status-reconciled/8", dot: "bg-status-reconciled" },
  production: { icon: Sparkles, cls: "text-status-pending bg-status-pending/8", dot: "bg-status-pending" },
  editing: { icon: PencilLine, cls: "text-status-flagged bg-status-flagged/8", dot: "bg-status-flagged" },
  review: { icon: Eye, cls: "text-bronze bg-bronze/8", dot: "bg-bronze" },
  approved: { icon: Check, cls: "text-status-paid bg-status-paid/8", dot: "bg-status-paid" },
  scheduled: { icon: Clock, cls: "text-deep bg-deep/8", dot: "bg-deep" },
  published: { icon: CheckCheck, cls: "text-page bg-status-paid", dot: "bg-status-paid" },
};
export const statusDot = (s: Status) => STATUS_STYLE[s].dot;

/** Status is always icon + text + colour, never colour alone. */
export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const { icon: Icon, cls } = STATUS_STYLE[status];
  return <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[12px] font-bold [&_svg]:size-3.5", cls, className)}><Icon />{STATUS_META[status].label}</span>;
}

const PRIORITY_STYLE: Record<Priority, string> = {
  high: "text-status-overdue bg-status-overdue/8",
  medium: "text-status-pending bg-status-pending/8",
  low: "text-status-draft bg-status-draft/8",
};
export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const bars = 3 - PRIORITY_META[priority].rank;
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[12px] font-bold", PRIORITY_STYLE[priority], className)}>
      <span className="flex items-end gap-px" aria-hidden>{[1, 2, 3].map((n) => <i key={n} className={cn("w-[3px] rounded-[1px] bg-current", n === 1 ? "h-1.5" : n === 2 ? "h-2" : "h-2.5", n > bars && "opacity-25")} />)}</span>
      {PRIORITY_META[priority].label}
    </span>
  );
}

const PILLAR_TONE: Record<Pillar["tone"], string> = {
  tech: "text-status-reconciled", edu: "text-status-paid", brand: "text-deep", biz: "text-status-pending", promo: "text-status-flagged",
};
export function PillarBadge({ pillar, className }: { pillar?: Pillar; className?: string }) {
  if (!pillar) return null;
  return <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-bold", PILLAR_TONE[pillar.tone], className)}><CircleDot className="size-3.5" />{pillar.name}</span>;
}
export const pillarTone = (t: Pillar["tone"]) => PILLAR_TONE[t];

export function TagChip({ children }: { children: string }) {
  return <span className="rounded-md bg-wash px-1.5 py-0.5 text-[11.5px] font-medium text-muted">#{children}</span>;
}
