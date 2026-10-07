"use client";
import { useRef, useState } from "react";
import { Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/cn";

/** Keeps typing local and writes to the store after a short pause or on blur, so a keystroke doesn't re-render the whole app. */
function useDraft(value: string, onCommit: (v: string) => void) {
  const [local, setLocal] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const flush = (v: string) => { clearTimeout(t.current); onCommit(v); setLocal(null); };
  return {
    value: local ?? value,
    onChange: (v: string) => { setLocal(v); clearTimeout(t.current); t.current = setTimeout(() => flush(v), 600); },
    onBlur: () => { if (local !== null) flush(local); },
  };
}

export function DraftInput({ value, onCommit, className, ...p }: { value: string; onCommit: (v: string) => void } & Omit<React.ComponentProps<"input">, "value" | "onChange">) {
  const d = useDraft(value, onCommit);
  return <Input {...p} value={d.value} onChange={(e) => d.onChange(e.target.value)} onBlur={d.onBlur} className={className} />;
}
export function DraftTextarea({ value, onCommit, className, ...p }: { value: string; onCommit: (v: string) => void } & Omit<React.ComponentProps<"textarea">, "value" | "onChange">) {
  const d = useDraft(value, onCommit);
  return <Textarea {...p} value={d.value} onChange={(e) => d.onChange(e.target.value)} onBlur={d.onBlur} className={cn(className)} />;
}
