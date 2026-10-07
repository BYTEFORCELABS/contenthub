import Link from "next/link";
import { PillarBadge } from "@/components/badges";
import { PlatformBadge } from "@/components/platform";
import { fmtNum, fmtPct, type pillarStats, type platformStats, type topContent } from "@/lib/metrics";

const Bar = ({ pct, label }: { pct: number; label: string }) => (
  <div className="h-1.5 w-full rounded-full bg-wash-strong" role="img" aria-label={label}><div className="cz-hbar h-full rounded-full bg-chart-1" style={{ width: `${Math.max(2, Math.min(100, pct))}%` }} /></div>
);

export function PlatformTable({ rows }: { rows: ReturnType<typeof platformStats> }) {
  const max = Math.max(...rows.map((r) => r.reach), 1);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[460px] text-[13px]">
        <thead><tr className="text-[11px] text-muted"><th className="pb-2 text-left font-bold">Platform</th><th className="pb-2 text-right font-bold">Posts</th><th className="w-2/5 pb-2 pl-4 text-left font-bold">Reach</th><th className="pb-2 text-right font-bold">Engagement</th></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.platform} className="border-t border-hairline">
            <td className="py-2.5"><PlatformBadge platform={r.platform} /></td>
            <td className="num py-2.5 text-right">{r.posts}</td>
            <td className="py-2.5 pl-4"><div className="flex items-center gap-3"><span className="num w-12 shrink-0 text-right">{r.posts ? fmtNum(r.reach) : "–"}</span><Bar pct={(r.reach / max) * 100} label={`${r.reach} reach`} /></div></td>
            <td className="num py-2.5 text-right font-bold text-deep">{r.posts ? fmtPct(r.rate) : "–"}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

export function TopContent({ rows }: { rows: ReturnType<typeof topContent> }) {
  if (!rows.length) return <p className="py-6 text-center text-[13px] text-muted">No published content in this period.</p>;
  const max = Math.max(...rows.map((r) => r.rate), 1);
  return (
    <ol className="divide-y divide-hairline">
      {rows.map((r, i) => (
        <li key={r.item.id} className="flex items-center gap-3 py-2.5">
          <span className="num w-4 shrink-0 text-[12px] font-bold text-muted">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <Link href={`/content/${r.item.id}`} className="block truncate text-[13.5px] font-bold text-ink hover:text-deep hover:underline">{r.item.title}</Link>
            <div className="mt-1 flex items-center gap-2"><span className="flex shrink-0 gap-1">{r.item.platforms.map((p) => <PlatformBadge key={p} platform={p} label={false} />)}</span><Bar pct={(r.rate / max) * 100} label={`${fmtPct(r.rate)} engagement`} /></div>
          </div>
          <div className="shrink-0 text-right"><div className="num text-[14px] font-bold text-deep">{fmtPct(r.rate)}</div><div className="num text-[11.5px] text-muted">{fmtNum(r.reach)} reach</div></div>
        </li>
      ))}
    </ol>
  );
}

export function PillarPerformance({ rows }: { rows: ReturnType<typeof pillarStats> }) {
  const max = Math.max(...rows.map((r) => r.rate), 1);
  return (
    <ul className="space-y-3.5">
      {rows.map((r, i) => (
        <li key={r.pillar.id}>
          <div className="mb-1.5 flex items-center justify-between gap-3"><span className="flex items-center gap-2"><PillarBadge pillar={r.pillar} />{i === 0 && r.posts > 0 && <span className="rounded-md bg-wash px-1.5 text-[11px] font-bold text-bronze">Best</span>}</span>
            <span className="num text-[12.5px] text-muted">{r.posts} {r.posts === 1 ? "post" : "posts"} · <b className="text-deep">{r.posts ? fmtPct(r.rate) : "–"}</b></span></div>
          <Bar pct={r.posts ? (r.rate / max) * 100 : 0} label={`${r.pillar.name} engagement ${fmtPct(r.rate)}`} />
        </li>
      ))}
    </ul>
  );
}
