import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

export function PageHeader({ title, subtitle, actions, eyebrow }: { title: string; subtitle?: ReactNode; actions?: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
        <h1 className="text-[26px] font-bold leading-tight text-deep sm:text-[30px]">{title}</h1>
        {subtitle && <p className="mt-1 text-[14px] text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, note, icon: Icon, href }: { label: string; value: ReactNode; note: string; icon: LucideIcon; href?: string }) {
  const body = (
    <>
      <div className="flex items-center justify-between"><span className="eyebrow">{label}</span><Icon className="size-4 text-bronze" /></div>
      <div className="num mt-2 text-[34px] font-bold leading-none text-deep">{value}</div>
      <div className="mt-2 text-[12.5px] text-muted">{note}</div>
    </>
  );
  const cls = "block rounded-xl border border-hairline bg-page p-4 transition-colors";
  return href ? <a href={href} className={cn(cls, "hover:border-deep/30 hover:bg-wash/60")}>{body}</a> : <div className={cls}>{body}</div>;
}

export function Panel({ title, action, children, className, pad = true }: { title?: string; action?: ReactNode; children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={cn("rounded-xl border border-hairline bg-page", className)}>
      {title && <header className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-3"><h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-deep">{title}</h2>{action}</header>}
      <div className={pad ? "p-4" : undefined}>{children}</div>
    </section>
  );
}

export function EmptyState({ icon: Icon, title, text, action, onAction, compact }: { icon: LucideIcon; title: string; text?: string; action?: string; onAction?: () => void; compact?: boolean }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed border-hairline-strong bg-wash/50 px-6 text-center", compact ? "py-8" : "py-16")}>
      <span className="grid size-11 place-items-center rounded-full bg-wash-strong text-deep"><Icon className="size-5" /></span>
      <h3 className="mt-4 text-[17px] font-bold text-deep">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-[13.5px] text-muted">{text}</p>}
      {action && onAction && <Button className="mt-4" onClick={onAction}>{action}</Button>}
    </div>
  );
}
