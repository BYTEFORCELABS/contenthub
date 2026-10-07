"use client";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Clapperboard, Lightbulb, Plus, Send, type LucideIcon } from "lucide-react";
import { StatusBadge, statusDot } from "@/components/badges";
import { Avatar } from "@/components/avatar";
import { PlatformStack } from "@/components/platform";
import { EmptyState, PageHeader, Panel, StatCard } from "@/components/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { parseISO, relative, timeAgo } from "@/lib/dates";
import { FORMAT_META, STATUS_META } from "@/lib/meta";
import { countByStatus, ideas, inProduction, publishedThisMonth, scheduledItems, upcoming } from "@/lib/select";
import { useHub } from "@/lib/store";
import { uiActions } from "@/lib/ui";
import { STATUSES } from "@/lib/types";
import { cn } from "@/lib/cn";

const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

export function Dashboard() {
  const s = useHub();
  const counts = countByStatus(s.items);
  const next = upcoming(s.items).slice(0, 6);
  const stats: { label: string; value: number; note: string; icon: LucideIcon; href: string }[] = [
    { label: "Content ideas", value: ideas(s.items).length, note: "Sitting in the idea vault.", icon: Lightbulb, href: "/ideas" },
    { label: "In production", value: inProduction(s.items).length, note: "Being written, edited or reviewed.", icon: Clapperboard, href: "/board" },
    { label: "Scheduled", value: scheduledItems(s.items).length, note: "Posts ready to be published.", icon: CalendarCheck, href: "/calendar" },
    { label: "Published this month", value: publishedThisMonth(s.items).length, note: "Already live this month.", icon: Send, href: "/content?status=published" },
  ];
  const max = Math.max(1, ...STATUSES.map((k) => counts[k]));
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title={`${greeting()}, Isaac`} subtitle="Here's what's happening with your content today."
        actions={<><Button variant="outline" onClick={() => uiActions.openContent()}>New content</Button><Button onClick={() => uiActions.openIdea()}><Plus />New idea</Button></>} />

      <div className="cz-stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map((c) => <StatCard key={c.label} {...c} />)}</div>

      <Panel title="Content pipeline" className="mt-5" action={<Link href="/board" className="inline-flex items-center gap-1 text-[12.5px] font-bold text-bronze hover:text-deep">Open board <ArrowRight className="size-3.5" /></Link>}>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {STATUSES.map((k, i) => (
            <li key={k} className="relative">
              <Link href={`/content?status=${k}`} className="group block rounded-lg border border-hairline p-3 transition-colors hover:border-deep/30 hover:bg-wash/60">
                <div className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-muted"><span className={cn("size-2 rounded-full", statusDot(k))} />{STATUS_META[k].short}</div>
                <div className="num mt-1.5 text-[26px] font-bold leading-none text-deep">{counts[k]}</div>
                <div className="mt-2.5 h-1 rounded-full bg-wash-strong"><div className={cn("cz-hbar h-full rounded-full", statusDot(k))} style={{ width: `${(counts[k] / max) * 100}%`, animationDelay: `${i * 50}ms` }} /></div>
              </Link>
            </li>
          ))}
        </ol>
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        <Panel title="Upcoming content" className="lg:col-span-3" pad={false} action={<Link href="/calendar" className="inline-flex items-center gap-1 text-[12.5px] font-bold text-bronze hover:text-deep">Calendar <ArrowRight className="size-3.5" /></Link>}>
          {next.length === 0 ? <div className="p-4"><EmptyState compact icon={CalendarCheck} title="Your calendar is clear." text="Nothing is scheduled yet." action="Schedule Content" onAction={() => uiActions.openContent({ status: "planned" })} /></div> : (
            <ul className="divide-y divide-hairline">
              {next.map((i) => {
                const d = parseISO(i.publishDate!);
                return (
                  <li key={i.id}>
                    <Link href={`/content/${i.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-wash/60">
                      <div className="w-12 shrink-0 rounded-lg bg-wash py-1 text-center"><div className="text-[10.5px] font-bold uppercase tracking-wider text-bronze">{d.toLocaleDateString("en-GB", { month: "short" })}</div><div className="num text-[18px] font-bold leading-tight text-deep">{d.getDate()}</div></div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-bold text-ink">{i.title}</div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12px] text-muted"><span>{relative(i.publishDate!)}</span><span aria-hidden>·</span><span>{FORMAT_META[i.format].label}</span></div>
                      </div>
                      <PlatformStack platforms={i.platforms} max={2} />
                      <span className="hidden sm:block"><StatusBadge status={i.status} /></span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Recent activity" className="lg:col-span-2" pad={false}>
          <ul className="divide-y divide-hairline">
            {s.activity.slice(0, 7).map((a) => {
              const [head, ...rest] = a.text.split(": ");
              const inner = (
                <div className="flex gap-3 px-4 py-3">
                  <Avatar name="Isaac" size={24} />
                  <div className="min-w-0"><div className="text-[13px] font-bold text-ink">{head}</div>{rest.length > 0 && <div className="truncate text-[12.5px] text-muted">{rest.join(": ")}</div>}<div className="mt-0.5 text-[11.5px] text-muted/80">{timeAgo(a.at)}</div></div>
                </div>
              );
              const href = a.itemId ? `/content/${a.itemId}` : a.campaignId ? `/campaigns/${a.campaignId}` : null;
              return <li key={a.id}>{href ? <Link href={href} className="block transition-colors hover:bg-wash/60">{inner}</Link> : inner}</li>;
            })}
            {s.activity.length === 0 && <li className="px-4 py-8 text-center text-[13px] text-muted">Activity will appear as you work.</li>}
          </ul>
        </Panel>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <ButtonLink href="/ideas" variant="outline" className="h-11 justify-between"><span className="inline-flex items-center gap-2"><Lightbulb />Review ideas</span><ArrowRight /></ButtonLink>
        <ButtonLink href="/board" variant="outline" className="h-11 justify-between"><span className="inline-flex items-center gap-2"><Clapperboard />Work the board</span><ArrowRight /></ButtonLink>
        <ButtonLink href="/calendar" variant="outline" className="h-11 justify-between"><span className="inline-flex items-center gap-2"><CalendarCheck />Plan the week</span><ArrowRight /></ButtonLink>
      </div>
    </div>
  );
}
