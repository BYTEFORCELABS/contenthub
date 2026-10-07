"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PlatformStack } from "@/components/platform";
import { Capture } from "@/components/ideas/capture";
import { IdeaRow } from "@/components/ideas/idea-card";
import { parseISO, relative } from "@/lib/dates";
import { FORMAT_META } from "@/lib/meta";
import { dueThisWeek, dueToday, ideas, needsAttention, postTime, upcoming } from "@/lib/select";
import { useHub } from "@/lib/store";
import { cn } from "@/lib/cn";
import type { ContentItem } from "@/lib/types";

const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
const seeAll = "inline-flex items-center gap-1 text-[13px] font-medium text-muted hover:text-deep";

function DateTile({ iso }: { iso: string }) {
  const d = parseISO(iso);
  return <div className="w-10 shrink-0 text-center"><div className="text-[11px] font-medium uppercase text-muted">{d.toLocaleDateString("en-GB", { month: "short" })}</div><div className="num text-[20px] font-bold leading-tight text-ink">{d.getDate()}</div></div>;
}

function Row({ item, note, tone }: { item: ContentItem; note: string; tone?: "late" }) {
  return (
    <li>
      <Link href={`/content/${item.id}`} className="-mx-3 flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-wash">
        {item.publishDate ? <DateTile iso={item.publishDate} /> : <div className="w-10" />}
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14.5px] font-bold text-ink">{item.title}</div>
          <div className={cn("mt-0.5 truncate text-[12.5px]", tone === "late" ? "font-medium text-status-overdue" : "text-muted")}>{note}</div>
        </div>
        <span className="hidden sm:block"><PlatformStack platforms={item.platforms} max={2} /></span>
      </Link>
    </li>
  );
}

export function Dashboard() {
  const s = useHub();
  const attention = needsAttention(s.items);
  const next = upcoming(s.items).filter((i) => i.status !== "idea").slice(0, 5);
  const latest = ideas(s.items).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const stats = [
    { label: "Needs attention", value: attention.length, href: "#attention", alert: attention.length > 0 },
    { label: "Due today", value: dueToday(s.items).length, href: "/calendar" },
    { label: "Next 7 days", value: dueThisWeek(s.items).length, href: "/calendar" },
    { label: "Ideas & hooks", value: ideas(s.items).length, href: "/ideas" },
  ];
  const published = s.items.filter((i) => i.status === "published").length;
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold leading-tight text-ink">{greeting()}, Isaac</h1>
        <p className="mt-1 text-[14px] text-muted">{s.items.length} piece{s.items.length === 1 ? "" : "s"} of content in the hub · {published} published</p>
      </div>

      <Capture />

      <div className="cz-stagger mt-8 grid grid-cols-2 gap-y-6 rounded-xl border border-hairline py-5 lg:grid-cols-4 lg:divide-x lg:divide-hairline">
        {stats.map((c) => (
          <Link key={c.label} href={c.href} className="group px-6">
            <div className="eyebrow">{c.label}</div>
            <div className={cn("num mt-1 text-[36px] font-bold leading-none", c.alert ? "text-status-overdue" : "text-ink group-hover:text-deep")}>{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <section className="lg:col-span-3" aria-label="Coming up">
          <div className="mb-1 flex items-center justify-between"><h2 className="text-[15px] font-bold text-ink">Coming up</h2><Link href="/calendar" className={seeAll}>Calendar <ArrowRight className="size-3.5" /></Link></div>
          {next.length === 0 ? <p className="py-8 text-[13.5px] text-muted">Nothing is scheduled. Your calendar is clear.</p> : (
            <ul className="divide-y divide-hairline">
              {next.map((i) => <Row key={i.id} item={i} note={[relative(i.publishDate!), postTime(i), FORMAT_META[i.format].label].filter(Boolean).join(" · ")} />)}
            </ul>
          )}
        </section>

        <section id="attention" className="scroll-mt-20 lg:col-span-2" aria-label="Needs attention">
          <div className="mb-1 flex items-center justify-between"><h2 className="text-[15px] font-bold text-ink">Needs attention</h2>{attention.length > 4 && <Link href="/content" className={seeAll}>All {attention.length} <ArrowRight className="size-3.5" /></Link>}</div>
          {attention.length === 0 ? (
            <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-wash px-4 py-4 text-[13.5px] text-muted"><CheckCircle2 className="size-5 text-status-paid" />You&apos;re all caught up.</div>
          ) : (
            <ul className="divide-y divide-hairline">
              {attention.slice(0, 4).map((a) => <Row key={a.item.id} item={a.item} note={a.reason} tone={a.late > 0 ? "late" : undefined} />)}
            </ul>
          )}
        </section>
      </div>

      {latest.length > 0 && (
        <section className="mt-10" aria-label="Latest ideas">
          <div className="mb-1 flex items-center justify-between"><h2 className="text-[15px] font-bold text-ink">Latest ideas</h2><Link href="/ideas" className={seeAll}>See all <ArrowRight className="size-3.5" /></Link></div>
          <ul className="divide-y divide-hairline">{latest.map((i) => <IdeaRow key={i.id} idea={i} />)}</ul>
        </section>
      )}
    </div>
  );
}
