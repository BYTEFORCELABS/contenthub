"use client";
import { useMemo, useState } from "react";
import { FlaskConical, Link2 } from "lucide-react";
import { KpiRow } from "@/components/analytics/kpi-row";
import { PillarPerformance, PlatformTable, TopContent } from "@/components/analytics/performance";
import { TrendChart } from "@/components/analytics/trend-chart";
import { Panel, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { RANGES, pillarStats, platformStats, summary, timeSeries, topContent, type Range } from "@/lib/metrics";
import { useHub } from "@/lib/store";

export default function AnalyticsPage() {
  const s = useHub();
  const [range, setRange] = useState<Range>(30);
  const d = useMemo(() => ({
    kpi: summary(s.items, range), series: timeSeries(s.items, range), platforms: platformStats(s.items, range),
    top: topContent(s.items, range), pillars: pillarStats(s.pillars, s.items, range),
  }), [s.items, s.pillars, range]);

  return (
    <div className="cz-page">
      <PageHeader title="Analytics" subtitle="How published content is performing across platforms."
        actions={
          <div className="flex rounded-lg bg-wash p-0.5 text-[12.5px] font-bold" role="group" aria-label="Date range">
            {RANGES.map((r) => <button key={r} aria-pressed={range === r} onClick={() => setRange(r)} className={cn("rounded-md px-3 py-1.5 transition-colors", range === r ? "bg-page text-deep shadow-sm" : "text-muted hover:text-ink")}>{r} days</button>)}
          </div>
        } />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-wash px-4 py-3" role="note">
        <p className="flex items-center gap-2 text-[13px] text-ink"><FlaskConical className="size-4 shrink-0 text-bronze" aria-hidden /><span><b className="text-deep">Sample data:</b> connect your accounts to see real numbers.</span></p>
        <Button variant="outline" disabled title="Account integrations arrive in a later phase"><Link2 />Connect accounts</Button>
      </div>

      <div className="space-y-4">
        <KpiRow data={d.kpi} range={range} />
        {d.kpi.posts === 0 ? (
          <Panel><p className="py-8 text-center text-[13.5px] text-muted">Nothing has been published in the last {range} days, so there is nothing to measure yet.</p></Panel>
        ) : (
          <>
            <Panel title={range === 90 ? "Over time (weekly)" : "Over time (daily)"}><TrendChart data={d.series} /></Panel>
            <div className="grid gap-4 lg:grid-cols-5">
              <Panel title="Platform performance" className="lg:col-span-3"><PlatformTable rows={d.platforms} /></Panel>
              <Panel title="Pillar performance" className="lg:col-span-2">
                <p className="mb-3 text-[12.5px] text-muted">Engagement rate by content pillar</p><PillarPerformance rows={d.pillars} />
              </Panel>
            </div>
            <Panel title="Top performing content"><TopContent rows={d.top} /></Panel>
          </>
        )}
      </div>
    </div>
  );
}
