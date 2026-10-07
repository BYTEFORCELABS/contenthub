"use client";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { hub } from "@/lib/store";

export type Kind = "idea" | "hook";

/** The whole app in one box: type it, press Enter, it's saved. Details can wait. */
export function Capture({ autoFocus }: { autoFocus?: boolean }) {
  const [text, setText] = useState("");
  const [kind, setKind] = useState<Kind>("idea");
  const save = () => {
    const t = text.trim();
    if (!t) return;
    const [first, ...rest] = t.split("\n");
    hub.addItem({ title: first.trim(), description: rest.join("\n").trim(), tags: kind === "hook" ? ["hook"] : [] });
    setText(""); toast.success(kind === "hook" ? "Hook saved" : "Idea saved");
  };
  return (
    <form onSubmit={(e) => { e.preventDefault(); save(); }} className="rounded-2xl border border-hairline-strong bg-page p-4 shadow-[0_8px_30px_-18px_rgb(31_27_24/0.25)] focus-within:border-deep/40">
      <textarea value={text} onChange={(e) => setText(e.target.value)} autoFocus={autoFocus} rows={2} aria-label="Capture an idea or hook"
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); save(); } }}
        placeholder="What's on your mind? An idea, a hook, anything…" className="block w-full resize-none bg-transparent text-[18px] leading-snug text-ink outline-none placeholder:text-muted/70" />
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1" role="group" aria-label="Type">
          {(["idea", "hook"] as Kind[]).map((k) => (
            <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k}
              className={cn("h-8 rounded-full px-3.5 text-[13px] font-bold capitalize transition-colors", kind === k ? "bg-wash-strong text-deep" : "text-muted hover:text-ink")}>{k}</button>
          ))}
        </div>
        <div className="flex items-center gap-3"><span className="hidden text-[12px] text-muted sm:block">Enter to save · Shift+Enter for a new line</span>
          <button type="submit" disabled={!text.trim()} className="h-9 rounded-lg bg-deep px-4 text-[13px] font-bold text-cream transition-opacity disabled:opacity-40">Save</button></div>
      </div>
    </form>
  );
}
