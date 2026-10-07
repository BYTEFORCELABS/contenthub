"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { fmtNum, type Bucket } from "@/lib/metrics";

const METRICS = [
  { key: "reach" as const, label: "Reach", color: "var(--chart-1)" },
  { key: "engagements" as const, label: "Engagements", color: "var(--chart-2)" },
];
const nice = (max: number) => { const p = 10 ** Math.floor(Math.log10(Math.max(max, 1))); const s = [1, 2, 2.5, 5, 10].map((m) => m * p).find((v) => v * 4 >= max) ?? p * 10; return s; };

/** One measure at a time on a single axis (no dual axis). Bars are focusable; a table view carries the same numbers. */
export function TrendChart({ data }: { data: Bucket[] }) {
  const [metric, setMetric] = useState<(typeof METRICS)[number]["key"]>("reach");
  const [table, setTable] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const m = METRICS.find((x) => x.key === metric)!;
  const step = nice(Math.max(...data.map((d) => d[metric]))), top = step * 4;
  const every = Math.ceil(data.length / 7);
  const cur = hover !== null ? data[hover] : null;
  const seg = (on: boolean) => cn("rounded-md px-2.5 py-1 transition-colors", on ? "bg-page text-deep shadow-sm" : "text-muted hover:text-ink");
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg bg-wash p-0.5 text-[12px] font-bold" role="group" aria-label="Measure">
          {METRICS.map((x) => <button key={x.key} aria-pressed={metric === x.key} onClick={() => setMetric(x.key)} className={seg(metric === x.key)}><span className="mr-1.5 inline-block size-2 rounded-[2px] align-middle" style={{ background: x.color }} />{x.label}</button>)}
        </div>
        <div className="flex rounded-lg bg-wash p-0.5 text-[12px] font-bold" role="group" aria-label="View">
          {["Chart", "Table"].map((v, i) => <button key={v} aria-pressed={table === (i === 1)} onClick={() => setTable(i === 1)} className={seg(table === (i === 1))}>{v}</button>)}
        </div>
      </div>
      {table ? (
        <div className="max-h-[260px] overflow-auto">
          <table className="w-full text-[13px]">
            <thead className="sticky top-0 bg-page"><tr className="text-[11px] uppercase tracking-[0.12em] text-muted"><th className="py-2 text-left">Period</th><th className="py-2 text-right">Reach</th><th className="py-2 text-right">Engagements</th></tr></thead>
            <tbody>{data.map((d) => <tr key={d.label} className="border-t border-hairline"><td className="py-2">{d.label}</td><td className="num py-2 text-right">{d.reach.toLocaleString("en-GB")}</td><td className="num py-2 text-right">{d.engagements.toLocaleString("en-GB")}</td></tr>)}</tbody>
          </table>
        </div>
      ) : (
        <>
          <p className="num mb-2 h-5 text-[13px] text-ink" aria-live="polite">{cur ? <><b className="text-deep">{cur[metric].toLocaleString("en-GB")}</b> {m.label.toLowerCase()} <span className="text-muted">· {cur.label}</span></> : <span className="text-muted">Hover or focus a bar for its value</span>}</p>
          <div className="flex gap-2">
            <div className="num flex h-44 flex-col-reverse justify-between pb-0 text-[11px] text-muted" aria-hidden>{[0, 1, 2, 3, 4].map((i) => <span key={i} className="leading-none">{fmtNum(step * i)}</span>)}</div>
            <div className="min-w-0 flex-1">
              <div className="relative h-44 border-b border-hairline-strong">
                {[1, 2, 3, 4].map((i) => <div key={i} className="absolute inset-x-0 border-t border-hairline" style={{ bottom: `${i * 25}%` }} />)}
                <div className="absolute inset-0 flex items-end gap-[2px]" onMouseLeave={() => setHover(null)}>
                  {data.map((d, i) => (
                    <button key={d.label} type="button" aria-label={`${d.label}: ${d[metric].toLocaleString("en-GB")} ${m.label.toLowerCase()}`} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                      className="group flex h-full min-w-0 flex-1 items-end">
                      <span key={metric} className={cn("cz-bar block w-full rounded-t-[4px] transition-opacity", hover !== null && hover !== i && "opacity-60")} style={{ height: `${(d[metric] / top) * 100}%`, background: m.color }} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-1.5 flex gap-[2px] text-[11px] text-muted" aria-hidden>
                {data.map((d, i) => <span key={d.label} className="relative min-w-0 flex-1"><span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">{i % every === 0 ? d.label.replace("Week of ", "") : ""}</span>&nbsp;</span>)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
