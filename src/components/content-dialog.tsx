"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { PlatformGlyph } from "@/components/platform";
import { cn } from "@/lib/cn";
import { FORMAT_META, PLATFORM_META, PRIORITY_META, STATUS_META } from "@/lib/meta";
import { hub, useHub } from "@/lib/store";
import { uiActions, useUi } from "@/lib/ui";
import { FORMATS, PLATFORMS, PRIORITIES, STATUSES, type ContentItem, type Format, type Platform, type Priority, type Status } from "@/lib/types";

/** Mounted once in the shell. Opened from anywhere with uiActions.openIdea() / openContent(). */
export function ContentDialogHost() {
  const { idea } = useUi();
  return idea ? <Form key={JSON.stringify(idea.defaults ?? {}) + idea.mode} mode={idea.mode} defaults={idea.defaults} /> : null;
}

function Form({ mode, defaults }: { mode: "idea" | "content"; defaults?: Partial<ContentItem> }) {
  const state = useHub();
  const router = useRouter();
  const isIdea = mode === "idea";
  const [title, setTitle] = useState(defaults?.title ?? "");
  const [description, setDescription] = useState(defaults?.description ?? "");
  const [pillarId, setPillar] = useState(defaults?.pillarId ?? state.pillars[0]?.id ?? "");
  const [platforms, setPlatforms] = useState<Platform[]>(defaults?.platforms ?? []);
  const [format, setFormat] = useState<Format>(defaults?.format ?? "carousel");
  const [priority, setPriority] = useState<Priority>(defaults?.priority ?? "medium");
  const [tags, setTags] = useState<string[]>(defaults?.tags ?? []);
  const [tagText, setTagText] = useState("");
  const [notes, setNotes] = useState(defaults?.notes ?? "");
  const [status, setStatus] = useState<Status>(defaults?.status ?? (isIdea ? "idea" : "planned"));
  const [campaignId, setCampaign] = useState<string>(defaults?.campaignId ?? "");
  const [publishDate, setDate] = useState(defaults?.publishDate ?? "");
  const [error, setError] = useState("");
  const [bump, setBump] = useState(0);

  const addTag = () => {
    const t = tagText.trim().replace(/^#/, "").toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagText("");
  };
  const reset = () => { setTitle(""); setDescription(""); setPlatforms([]); setTags([]); setTagText(""); setNotes(""); setError(""); setBump((n) => n + 1); };

  function save(another: boolean) {
    if (!title.trim()) { setError("Give the idea a title so you can find it later."); return; }
    const pending = tagText.trim().replace(/^#/, "").toLowerCase();
    const allTags = pending && !tags.includes(pending) ? [...tags, pending] : tags;
    const item = hub.addItem({
      title: title.trim(), description: description.trim(), pillarId, platforms, format, priority, tags: allTags, notes: notes.trim(),
      status, campaignId: campaignId || null, publishDate: publishDate || null,
    });
    toast.success(isIdea ? "Idea saved to the vault" : "Content created", { description: item.title, action: { label: "Open", onClick: () => router.push(`/content/${item.id}`) } });
    if (another) reset(); else uiActions.closeIdea();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && uiActions.closeIdea()} className="max-w-2xl"
      title={isIdea ? "New idea" : "New content"}
      description={isIdea ? "Capture it now. You can shape it into content later." : "Create a piece of content and place it in the workflow."}
      footer={<>
        <Button variant="ghost" onClick={() => uiActions.closeIdea()}>Cancel</Button>
        {isIdea && <Button variant="outline" onClick={() => save(true)}>Save &amp; add another</Button>}
        <Button onClick={() => save(false)}>{isIdea ? "Save idea" : "Create content"}</Button>
      </>}>
      <form key={bump} onSubmit={(e) => { e.preventDefault(); save(false); }} className="grid gap-4 sm:grid-cols-2">
        <Field label="Idea title" className="sm:col-span-2" hint={error ? <span className="font-bold text-status-overdue">{error}</span> : undefined}>
          <Input autoFocus value={title} onChange={(e) => { setTitle(e.target.value); setError(""); }} placeholder="e.g. 5 mistakes businesses make with their websites" />
        </Field>
        <Field label="Short description" className="sm:col-span-2">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is the idea, and what should people take from it?" />
        </Field>
        <Field label="Content pillar">
          <Select value={pillarId} onChange={(e) => setPillar(e.target.value)}>{state.pillars.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select>
        </Field>
        <Field label="Content format">
          <Select value={format} onChange={(e) => setFormat(e.target.value as Format)}>{FORMATS.map((f) => <option key={f} value={f}>{FORMAT_META[f].label}</option>)}</Select>
        </Field>
        <div className="sm:col-span-2">
          <div className="mb-1.5 text-[12px] font-bold text-muted">{isIdea ? "Potential platforms" : "Platforms"}</div>
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map((p) => {
              const on = platforms.includes(p);
              return (
                <button key={p} type="button" aria-pressed={on} onClick={() => setPlatforms(on ? platforms.filter((x) => x !== p) : [...platforms, p])}
                  className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[12.5px] font-bold transition-colors", on ? "border-deep bg-deep text-cream" : "border-hairline-strong bg-page text-ink hover:bg-wash")}>
                  <PlatformGlyph platform={p} className="size-3.5" />{PLATFORM_META[p].label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="sm:col-span-2">
          <div className="mb-1.5 text-[12px] font-bold text-muted">Priority</div>
          <div className="inline-flex rounded-lg border border-hairline-strong p-0.5" role="radiogroup" aria-label="Priority">
            {PRIORITIES.map((p) => (
              <button key={p} type="button" role="radio" aria-checked={priority === p} onClick={() => setPriority(p)}
                className={cn("h-7 rounded-md px-3 text-[12.5px] font-bold transition-colors", priority === p ? "bg-deep text-cream" : "text-ink hover:bg-wash")}>{PRIORITY_META[p].label}</button>
            ))}
          </div>
        </div>
        {!isIdea && <>
          <Field label="Status"><Select value={status} onChange={(e) => setStatus(e.target.value as Status)}>{STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}</Select></Field>
          <Field label="Campaign"><Select value={campaignId} onChange={(e) => setCampaign(e.target.value)}><option value="">No campaign</option>{state.campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
          <Field label="Publish date"><Input type="date" value={publishDate} onChange={(e) => setDate(e.target.value)} /></Field>
        </>}
        <Field label="Tags" className="sm:col-span-2" hint="Press Enter or comma to add a tag.">
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-hairline-strong px-2 py-1.5 focus-within:border-deep focus-within:ring-3 focus-within:ring-deep/15">
            {tags.map((t) => <button key={t} type="button" onClick={() => setTags(tags.filter((x) => x !== t))} className="rounded-md bg-wash px-1.5 py-0.5 text-[12px] font-bold text-muted ring-1 ring-inset ring-hairline hover:text-status-overdue" aria-label={`Remove tag ${t}`}>#{t} ×</button>)}
            <input value={tagText} onChange={(e) => setTagText(e.target.value)} onBlur={addTag}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } else if (e.key === "Backspace" && !tagText) setTags(tags.slice(0, -1)); }}
              placeholder={tags.length ? "" : "website, tips…"} className="h-6 min-w-24 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted/60" />
          </div>
        </Field>
        <Field label="Notes" className="sm:col-span-2"><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Links, references, a half-formed hook…" /></Field>
        <button type="submit" className="sr-only">Save</button>
      </form>
    </Dialog>
  );
}
