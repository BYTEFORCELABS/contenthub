"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { hub } from "@/lib/store";
import { FileDrop } from "./file-drop";
import { KIND_META, PREVIEW_ONLY, formatSize, hueOf, inferKind } from "./files";

export function UploadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const close = (o: boolean) => { if (!o) setFiles([]); onOpenChange(o); };
  const add = () => {
    files.forEach((f) => hub.addAsset({ name: f.name, kind: inferKind(f), size: formatSize(f.size), tags: [], hue: hueOf(f.name) }));
    toast.success(PREVIEW_ONLY);
    close(false);
  };
  return (
    <Dialog open={open} onOpenChange={close} title="Upload to the library" description="Choose files from your computer. Previews are placeholders until storage is connected."
      footer={<><Button variant="ghost" onClick={() => close(false)}>Cancel</Button><Button disabled={!files.length} onClick={add}>Add {files.length || ""} {files.length === 1 ? "file" : "files"}</Button></>}>
      <FileDrop onFiles={(f) => setFiles((p) => [...p, ...f])} />
      {files.length > 0 && (
        <ul className="mt-4 divide-y divide-hairline rounded-xl border border-hairline">
          {files.map((f, i) => {
            const k = inferKind(f); const Icon = KIND_META[k].icon;
            return (
              <li key={`${f.name}-${i}`} className="flex items-center gap-3 px-3 py-2">
                <Icon className="size-4 shrink-0 text-bronze" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-ink">{f.name}</span>
                <span className="num shrink-0 text-[12px] text-muted">{KIND_META[k].label} · {formatSize(f.size)}</span>
                <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="rounded-md p-1 text-muted hover:bg-wash hover:text-ink"><X className="size-3.5" /></button>
              </li>
            );
          })}
        </ul>
      )}
    </Dialog>
  );
}
