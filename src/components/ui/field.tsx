import { cn } from "@/lib/cn";
import type { ComponentProps, ReactNode } from "react";

const control =
  "w-full rounded-lg border border-hairline-strong bg-page px-3 text-[14px] text-ink placeholder:text-muted/60 transition-shadow focus:outline-none focus:border-deep focus:ring-3 focus:ring-deep/15";

export function Input({ className, ...p }: ComponentProps<"input">) {
  return <input className={cn(control, "h-9", className)} {...p} />;
}
export function Textarea({ className, ...p }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "py-2 min-h-18", className)} {...p} />;
}
export function Select({ className, ...p }: ComponentProps<"select">) {
  return <select className={cn(control, "h-9 pr-8", className)} {...p} />;
}
export function Field({ label, hint, children, className }: { label: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[12px] font-bold text-muted">{label}</span>
      {children}
      {hint && <span className="text-[12px] text-muted">{hint}</span>}
    </label>
  );
}
