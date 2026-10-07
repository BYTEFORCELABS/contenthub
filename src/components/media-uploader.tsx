"use client";
import { useState } from "react";
import { Check, FolderOpen, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FileDrop } from "@/components/library/file-drop";
import { KIND_META, PREVIEW_ONLY, formatSize, inferKind } from "@/components/library/files";
import { cn } from "@/lib/cn";
import { useHub } from "@/lib/store";
import type { MediaKind, MediaRef } from "@/lib/types";

const uid = () => `m-${Math.random().toString(36).slice(2, 8)}`;

/** Attach media to a content item. Mock: only name, kind and size are kept; files are not stored. */
export function MediaUploader({ media, onChange }: { media: MediaRef[]; onChange: (media: MediaRef[]) => void }) {
  const { assets } = useHub();
  const [picker, setPicker] = useState(false);
  const attach = (files: File[]) => {
    onChange([...media, ...files.map((f): MediaRef => ({ id: uid(), name: f.name, kind: inferKind(f), size: formatSize(f.size) }))]);
    toast.success(PREVIEW_ONLY.replace("Added to the library", "Attached"));
  };
  const toggle = (id: string) => {
    const a = assets.find((x) => x.id === id);
    if (!a) return;
    if (media.some((m) => m.id === id)) onChange(media.filter((m) => m.id !== id));
    else onChange([...media, { id: a.id, name: a.name, kind: (a.kind === "brand" ? "graphic" : a.kind) as MediaKind, size: a.size }]);
  };
  return (
    <div className="flex flex-col gap-3">
      {media.length > 0 ? (
        <ul className="divide-y divide-hairline rounded-xl border border-hairline">
          {media.map((m) => {
            const Icon = KIND_META[m.kind].icon;
            return (
              <li key={m.id} className="flex items-center gap-3 px-3 py-2">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-wash text-deep"><Icon className="size-4" aria-hidden /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-bold text-ink">{m.name}</span><span className="text-[12px] text-muted">{KIND_META[m.kind].label}</span></span>
                <span className="num shrink-0 text-[12px] text-muted">{m.size}</span>
                <button type="button" aria-label={`Remove ${m.name}`} onClick={() => onChange(media.filter((x) => x.id !== m.id))} className="rounded-md p-1 text-muted hover:bg-wash hover:text-ink"><X className="size-4" /></button>
              </li>
            );
          })}
        </ul>
      ) : <p className="text-[13px] text-muted">No media attached yet.</p>}
      <FileDrop compact label="Attach files" onFiles={attach} />
      <div><Button variant="outline" onClick={() => setPicker(true)}><FolderOpen />Choose from library</Button></div>

      <Dialog open={picker} onOpenChange={setPicker} title="Choose from library" description="Select assets to attach. Select again to detach."
        footer={<Button onClick={() => setPicker(false)}>Done{media.length ? ` (${media.length} attached)` : ""}</Button>}>
        {assets.length === 0 ? <p className="py-6 text-center text-[13px] text-muted">The library is empty.</p> : (
          <ul className="divide-y divide-hairline rounded-xl border border-hairline">
            {assets.map((a) => {
              const on = media.some((m) => m.id === a.id); const Icon = KIND_META[a.kind].icon;
              return (
                <li key={a.id}>
                  <button type="button" aria-pressed={on} onClick={() => toggle(a.id)} className={cn("flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-wash/70", on && "bg-wash")}>
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-wash-strong text-deep"><Icon className="size-4" aria-hidden /></span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-ink">{a.name}</span>
                    <span className="num shrink-0 text-[12px] text-muted">{a.size}</span>
                    <span className={cn("grid size-5 shrink-0 place-items-center rounded-md border", on ? "border-deep bg-deep text-cream" : "border-hairline-strong")}>{on && <Check className="size-3.5" />}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Dialog>
    </div>
  );
}
