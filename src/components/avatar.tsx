import { cn } from "@/lib/cn";

export function Avatar({ name, size = 24, className }: { name: string | null; size?: number; className?: string }) {
  if (!name) return <span className={cn("grid place-items-center rounded-full border border-dashed border-hairline-strong text-[10px] text-muted", className)} style={{ width: size, height: size }} title="Unassigned">?</span>;
  return (
    <span title={name} className={cn("grid place-items-center rounded-full bg-deep font-bold text-cream", className)} style={{ width: size, height: size, fontSize: size * 0.42 }}>
      {name.trim()[0].toUpperCase()}
    </span>
  );
}
