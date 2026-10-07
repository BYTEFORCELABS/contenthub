"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Trash2 } from "lucide-react";
import { PlatformGlyph } from "@/components/platform";
import { StatusBadge, TagChip } from "@/components/badges";
import { ConfirmDialog } from "@/components/confirm";
import { MediaUploader } from "@/components/media-uploader";
import { Panel } from "@/components/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { DraftInput, DraftTextarea } from "@/components/workspace/draft";
import { RepurposePanel } from "@/components/workspace/repurpose-panel";
import { cn } from "@/lib/cn";
import { fmtShort, timeAgo } from "@/lib/dates";
import { FORMAT_META, PLATFORM_META, PRIORITY_META, STATUS_META } from "@/lib/meta";
import { hub, useHub } from "@/lib/store";
import { FORMATS, PLATFORMS, PRIORITIES, STATUSES, type Brief, type ContentItem, type Status } from "@/lib/types";

const LIMITS: Partial<Record<(typeof PLATFORMS)[number], number>> = { x: 280, instagram: 2200, linkedin: 3000, facebook: 63206, tiktok: 2200 };
const BRIEF: { key: keyof Brief; label: string; hint: string; rows: number }[] = [
  { key: "objective", label: "Objective", hint: "What should this achieve?", rows: 2 },
  { key: "audience", label: "Target audience", hint: "Who is it for?", rows: 2 },
  { key: "keyMessage", label: "Key message", hint: "The one thing to remember.", rows: 2 },
  { key: "hook", label: "Hook", hint: "The first line or the first three seconds.", rows: 2 },
  { key: "cta", label: "Call to action", hint: "What should people do next?", rows: 2 },
  { key: "notes", label: "Brief notes", hint: "References, constraints, tone.", rows: 3 },
];

/** Full page at /content/[id], or `modal` inside the board's dialog (then onClose replaces navigation). */
export function ContentWorkspace({ id, modal, onClose }: { id: string; modal?: boolean; onClose?: () => void }) {
  const s = useHub();
  const router = useRouter();
  const [del, setDel] = useState(false);
  const item = s.items.find((c) => c.id === id);
  if (!item) return modal ? null : <Gone />;

  const set = (patch: Partial<ContentItem>) => hub.updateItem(item.id, patch);
  const nextStatus = STATUSES[STATUSES.indexOf(item.status) + 1] as Status | undefined;
  const done = item.checklist.filter((k) => k.done).length;
  const move = (to: Status) => {
    const { dateAssigned } = hub.moveItem(item.id, to);
    toast.success(`Moved to ${STATUS_META[to].label}`, { description: dateAssigned ? `Date set to ${fmtShort(dateAssigned)}. Change it below.` : undefined });
  };
  const limit = item.platforms.map((p) => LIMITS[p]).filter((n): n is number => !!n).reduce((a, b) => Math.min(a, b), Infinity);

  return (
    <div className={modal ? undefined : "mx-auto max-w-7xl"}>
      {modal ? <Link href={`/content/${item.id}`} className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-bronze hover:text-deep"><ExternalLink className="size-4" />Open as full page</Link>
        : <Link href="/board" className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-bronze hover:text-deep"><ArrowLeft className="size-4" />Content board</Link>}

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 basis-96">
          <div className="mb-2 flex flex-wrap items-center gap-2"><StatusBadge status={item.status} /><span className="text-[12px] text-muted">Updated {timeAgo(item.updatedAt)} · saved automatically</span></div>
          <DraftInput value={item.title} onCommit={(v) => v.trim() && set({ title: v.trim() })} aria-label="Title" className="h-auto border-transparent px-0 py-1 text-[26px] font-bold text-deep hover:border-hairline focus:px-3 sm:text-[30px]" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="danger-ghost" onClick={() => setDel(true)}><Trash2 />Delete</Button>
          {nextStatus && <Button onClick={() => move(nextStatus)}>Move to {STATUS_META[nextStatus].label}<ArrowRight /></Button>}
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-5">
          <Panel title="Basic information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Description" className="sm:col-span-2"><DraftTextarea value={item.description} onCommit={(v) => set({ description: v })} placeholder="What is this piece about?" /></Field>
              <Field label="Status"><Select value={item.status} onChange={(e) => move(e.target.value as Status)}>{STATUSES.map((st) => <option key={st} value={st}>{STATUS_META[st].label}</option>)}</Select></Field>
              <Field label="Priority"><Select value={item.priority} onChange={(e) => set({ priority: e.target.value as ContentItem["priority"] })}>{PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_META[p].label}</option>)}</Select></Field>
              <Field label="Content pillar"><Select value={item.pillarId} onChange={(e) => set({ pillarId: e.target.value })}>{s.pillars.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field>
              <Field label="Campaign"><Select value={item.campaignId ?? ""} onChange={(e) => set({ campaignId: e.target.value || null })}><option value="">No campaign</option>{s.campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
              <Field label="Content format"><Select value={item.format} onChange={(e) => set({ format: e.target.value as ContentItem["format"] })}>{FORMATS.map((f) => <option key={f} value={f}>{FORMAT_META[f].label}</option>)}</Select></Field>
              <Field label="Publish date"><Input type="date" value={item.publishDate ?? ""} onChange={(e) => set({ publishDate: e.target.value || null })} /></Field>
              <Field label="Assignee"><Select value={item.assignee ?? ""} onChange={(e) => set({ assignee: e.target.value || null })}><option value="">Unassigned</option>{s.people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field>
              <Field label="Tags" hint="Comma separated."><DraftInput value={item.tags.join(", ")} onCommit={(v) => set({ tags: [...new Set(v.split(",").map((t) => t.trim().replace(/^#/, "").toLowerCase()).filter(Boolean))] })} placeholder="website, tips" /></Field>
              {item.tags.length > 0 && <div className="flex flex-wrap gap-1 sm:col-span-2">{item.tags.map((t) => <TagChip key={t}>{t}</TagChip>)}</div>}
            </div>
          </Panel>

          <Panel title="Content brief">
            <div className="grid gap-4 sm:grid-cols-2">
              {BRIEF.map((b) => (
                <Field key={b.key} label={b.label} className={b.key === "notes" ? "sm:col-span-2" : undefined}>
                  <DraftTextarea value={item.brief[b.key]} rows={b.rows} placeholder={b.hint} onCommit={(v) => set({ brief: { ...item.brief, [b.key]: v } })} />
                </Field>
              ))}
            </div>
          </Panel>

          <Panel title="Caption" action={<span className={cn("num text-[12px]", Number.isFinite(limit) && item.caption.length > limit ? "font-bold text-status-overdue" : "text-muted")}>{item.caption.length}{Number.isFinite(limit) && ` / ${limit}`}</span>}>
            <DraftTextarea value={item.caption} onCommit={(v) => set({ caption: v })} rows={9} aria-label="Caption" placeholder="Write the caption here…" className="leading-relaxed" />
            {Number.isFinite(limit) && item.caption.length > limit && <p className="mt-2 text-[12.5px] font-bold text-status-overdue">Too long for {item.platforms.filter((p) => LIMITS[p] === limit).map((p) => PLATFORM_META[p].label).join(" / ")} (limit {limit}).</p>}
          </Panel>

          <Panel title="Creative / media"><MediaUploader media={item.media} onChange={(media) => set({ media })} /></Panel>
        </div>

        <aside className="flex min-w-0 flex-col gap-5">
          <Panel title="Production checklist" action={<span className="num text-[12px] font-bold text-muted">{done}/{item.checklist.length}</span>}>
            <div className="mb-3 h-1.5 rounded-full bg-wash-strong"><div className="h-full rounded-full bg-deep transition-[width] duration-300" style={{ width: `${(done / Math.max(1, item.checklist.length)) * 100}%` }} /></div>
            <ul className="flex flex-col gap-0.5">
              {item.checklist.map((k) => (
                <li key={k.id}>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] hover:bg-wash">
                    <input type="checkbox" checked={k.done} onChange={() => hub.toggleCheck(item.id, k.id)} className="size-4 accent-[var(--brand-deep)]" />
                    <span className={cn(k.done && "text-muted line-through")}>{k.label}</span>
                    {k.done && <Check className="ml-auto size-3.5 text-status-paid" />}
                  </label>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Platforms">
            <div className="grid grid-cols-2 gap-1.5">
              {PLATFORMS.map((p) => {
                const on = item.platforms.includes(p);
                return (
                  <button key={p} type="button" aria-pressed={on} onClick={() => set({ platforms: on ? item.platforms.filter((x) => x !== p) : [...item.platforms, p] })}
                    className={cn("inline-flex h-9 items-center gap-2 rounded-lg border px-2.5 text-[13px] font-bold transition-colors", on ? "border-deep bg-deep text-cream" : "border-hairline-strong bg-page text-ink hover:bg-wash")}>
                    <PlatformGlyph platform={p} className="size-4" />{PLATFORM_META[p].label}
                  </button>
                );
              })}
            </div>
            {item.platforms.length === 0 && <p className="mt-2 text-[12.5px] text-muted">Choose where this will be published.</p>}
          </Panel>

          <RepurposePanel item={item} state={s} />
        </aside>
      </div>

      <ConfirmDialog open={del} onOpenChange={setDel} title="Delete this content?" description={`"${item.title}" and its brief, caption and checklist will be removed permanently.`}
        onConfirm={() => { if (modal) { onClose?.(); hub.deleteItem(item.id); toast.success("Content deleted"); return; } router.push("/content"); setTimeout(() => { hub.deleteItem(item.id); toast.success("Content deleted"); }, 50); }} />
    </div>
  );
}

/** Bad link, or the item was just deleted while navigation finishes. */
function Gone() {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-[22px] font-bold text-deep">This content no longer exists</h1>
      <p className="mt-2 text-[14px] text-muted">It may have been deleted, or the link is wrong.</p>
      <ButtonLink href="/content" className="mt-5">Back to all content</ButtonLink>
    </div>
  );
}
