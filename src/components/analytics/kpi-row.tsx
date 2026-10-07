import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { deltaFor, fmtNum, fmtPct, summary, type Range } from "@/lib/metrics";

export function Delta({ id, range }: { id: string; range: Range }) {
  const d = deltaFor(id, range);
  const up = d >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return <span className={cn("inline-flex items-center gap-0.5 text-[12px] font-bold", up ? "text-status-paid" : "text-status-overdue")}><Icon className="size-3.5" aria-hidden />{up ? "+" : "−"}{Math.abs(d).toFixed(1)}%<span className="sr-only"> versus previous period</span></span>;
}

export function KpiRow({ data, range }: { data: ReturnType<typeof summary>; range: Range }) {
  const cells = [
    ["posts", "Posts published", String(data.posts)], ["reach", "Total reach", fmtNum(data.reach)], ["rate", "Engagement rate", fmtPct(data.rate)], ["likes", "Likes", fmtNum(data.likes)],
    ["comments", "Comments", fmtNum(data.comments)], ["shares", "Shares", fmtNum(data.shares)], ["saves", "Saves", fmtNum(data.saves)], ["clicks", "Clicks", fmtNum(data.clicks)],
  ];
  return (
    <div className="cz-stagger grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cells.map(([id, label, value]) => (
        <div key={id} className="rounded-xl border border-hairline bg-page p-4">
          <div className="eyebrow">{label}</div>
          <div className="num mt-2 text-[28px] font-bold leading-none text-deep">{value}</div>
          <div className="mt-2 flex items-center gap-1.5"><Delta id={id} range={range} /><span className="text-[12px] text-muted">vs previous</span></div>
        </div>
      ))}
    </div>
  );
}
