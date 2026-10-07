"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Capture } from "@/components/ideas/capture";
import { IdeaStream } from "@/components/ideas/idea-vault";
import { parseISO, relative } from "@/lib/dates";
import { upcoming } from "@/lib/select";
import { useHub } from "@/lib/store";

const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

export function Dashboard() {
  const s = useHub();
  const next = upcoming(s.items).slice(0, 3);
  return (
    <div className="mx-auto max-w-2xl pt-4 sm:pt-10">
      <h1 className="mb-6 text-[30px] font-bold leading-tight text-ink">{greeting()}, Isaac</h1>
      <Capture autoFocus />

      <div className="mt-10"><IdeaStream limit={8} /></div>
      <Link href="/ideas" className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-muted hover:text-deep">See everything <ArrowRight className="size-3.5" /></Link>

      {next.length > 0 && (
        <section className="mt-12" aria-label="Coming up">
          <h2 className="mb-1 text-[15px] font-bold text-ink">Coming up</h2>
          <ul className="divide-y divide-hairline">
            {next.map((i) => (
              <li key={i.id}><Link href={`/content/${i.id}`} className="flex items-baseline justify-between gap-4 py-3 hover:text-deep"><span className="truncate text-[14.5px] font-bold">{i.title}</span><span className="shrink-0 text-[12.5px] text-muted">{relative(i.publishDate!)} · {parseISO(i.publishDate!).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span></Link></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
