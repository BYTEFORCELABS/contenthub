"use client";
import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/cn";

/** Drag-and-drop zone plus a real file input. Calls back with the chosen File objects; storing them is the caller's business. */
export function FileDrop({ onFiles, compact, label = "Drag files here, or click to browse" }: { onFiles: (f: File[]) => void; compact?: boolean; label?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const f = Array.from(e.dataTransfer.files); if (f.length) onFiles(f); }}
      className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed text-center transition-colors", over ? "border-deep bg-wash-strong" : "border-hairline-strong bg-wash/50", compact ? "gap-1 px-4 py-4" : "gap-2 px-6 py-10")}
    >
      <UploadCloud className={cn("text-bronze", compact ? "size-5" : "size-7")} aria-hidden />
      <button type="button" onClick={() => input.current?.click()} className="text-[13.5px] font-bold text-deep underline-offset-2 hover:underline">{label}</button>
      {!compact && <p className="text-[12.5px] text-muted">Images, video, graphics and documents</p>}
      <input ref={input} type="file" multiple className="sr-only" tabIndex={-1} aria-label="Choose files" onChange={(e) => { const f = Array.from(e.target.files ?? []); if (f.length) onFiles(f); e.target.value = ""; }} />
    </div>
  );
}
