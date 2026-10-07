"use client";
import Link from "next/link";
import { useState } from "react";
import * as P from "@radix-ui/react-popover";
import { AlarmClock, Bell, CalendarX2, CheckCircle2, Eye } from "lucide-react";
import { cn } from "@/lib/cn";
import { diffDays, today, relative } from "@/lib/dates";
import { useHub } from "@/lib/store";

/** Derived from the content itself, so it always reflects what actually needs attention. */
export function Notifications() {
  const s = useHub();
  const [open, setOpen] = useState(false);
  const t = today();
  const list = [
    ...s.items.filter((i) => i.publishDate && i.publishDate < t && i.status !== "published").map((i) => ({ id: i.id, icon: CalendarX2, tone: "text-status-overdue", title: `Overdue: ${i.title}`, note: `Was due ${relative(i.publishDate!).toLowerCase()}; not yet published` })),
    ...s.items.filter((i) => i.status === "scheduled" && i.publishDate && diffDays(i.publishDate, t) >= 0 && diffDays(i.publishDate, t) <= 2).map((i) => ({ id: i.id, icon: AlarmClock, tone: "text-status-pending", title: `Going out ${relative(i.publishDate!).toLowerCase()}: ${i.title}`, note: "Scheduled" })),
    ...s.items.filter((i) => i.status === "review").map((i) => ({ id: i.id, icon: Eye, tone: "text-bronze", title: `Waiting for review: ${i.title}`, note: "Needs sign-off" })),
    ...s.items.filter((i) => i.status === "approved" && !i.publishDate).map((i) => ({ id: i.id, icon: CheckCircle2, tone: "text-status-paid", title: `Approved, no date: ${i.title}`, note: "Ready to schedule" })),
  ];
  return (
    <P.Root open={open} onOpenChange={setOpen}>
      <P.Trigger aria-label={`Notifications${list.length ? `, ${list.length} need attention` : ""}`} className="relative grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-wash-strong hover:text-deep">
        <Bell className="size-[18px]" />
        {list.length > 0 && <span className="num absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-status-overdue px-1 text-[10px] font-bold leading-4 text-page">{list.length}</span>}
      </P.Trigger>
      <P.Portal>
        <P.Content align="end" sideOffset={8} className="cz-dialog z-50 w-[min(24rem,calc(100vw-24px))] rounded-xl border border-hairline bg-page shadow-[0_16px_40px_-12px_rgb(36_26_18/0.3)] outline-none">
          <div className="border-b border-hairline px-4 py-3 text-[13px] font-bold text-deep">Needs your attention</div>
          <ul className="max-h-96 overflow-y-auto py-1">
            {list.length === 0 && <li className="px-4 py-8 text-center text-[13px] text-muted">You&apos;re all caught up.</li>}
            {list.map((n, k) => (
              <li key={n.id + k}>
                <Link href={`/content/${n.id}`} onClick={() => setOpen(false)} className="flex gap-3 px-4 py-2.5 hover:bg-wash">
                  <n.icon className={cn("mt-0.5 size-4 shrink-0", n.tone)} />
                  <span className="min-w-0"><span className="line-clamp-2 block text-[13px] font-bold text-ink">{n.title}</span><span className="text-[12px] text-muted">{n.note}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}
