import { Globe } from "lucide-react";
import { cn } from "@/lib/cn";
import { PLATFORM_META } from "@/lib/meta";
import type { Platform } from "@/lib/types";

const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Simple monochrome glyphs: the icon library has no brand marks, and brand colours would clash with the palette. */
export function PlatformGlyph({ platform, className }: { platform: Platform; className?: string }) {
  if (platform === "website") return <Globe className={className} />;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...P}>
      {platform === "instagram" && <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></>}
      {platform === "facebook" && <path d="M14 21v-8h3l.5-3.5H14V7.5c0-1 .5-1.8 1.9-1.8H17.6V2.6A20 20 0 0 0 15.2 2.5C12.7 2.5 10.5 4 10.5 7v2.5H7.5V13h3v8" />}
      {platform === "linkedin" && <><path d="M6.5 10v8M6.5 6.2v.1M11 18v-8m0 3.5c0-2 1.2-3.5 3.2-3.5s2.8 1.4 2.8 3.5V18" /></>}
      {platform === "tiktok" && <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.3 2.6 1.9 4.2 4.5 4.5" />}
      {platform === "x" && <path d="M4.5 4.5l15 15M19.5 4.5l-15 15" />}
      {platform === "youtube" && <><rect x="2.8" y="5.5" width="18.4" height="13" rx="4" /><path d="M10 9.5v5l4.3-2.5z" fill="currentColor" /></>}
    </svg>
  );
}

export function PlatformBadge({ platform, label = true, className }: { platform: Platform; label?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-bold text-ink/80", className)} title={PLATFORM_META[platform].label}>
      <span className="grid size-5 place-items-center rounded-md bg-wash-strong text-muted"><PlatformGlyph platform={platform} className="size-3.5" /></span>
      {label && PLATFORM_META[platform].label}
    </span>
  );
}

/** Overlapping icon-only stack, for tight spaces. */
export function PlatformStack({ platforms, max = 3 }: { platforms: Platform[]; max?: number }) {
  if (!platforms.length) return <span className="text-[12px] text-muted">No platform</span>;
  return (
    <span className="inline-flex items-center" aria-label={platforms.map((p) => PLATFORM_META[p].label).join(", ")}>
      {platforms.slice(0, max).map((p) => (
        <span key={p} title={PLATFORM_META[p].label} className="-ml-1 grid size-6 place-items-center rounded-full bg-wash-strong text-muted ring-2 ring-page first:ml-0"><PlatformGlyph platform={p} className="size-3.5" /></span>
      ))}
      {platforms.length > max && <span className="-ml-1 grid size-6 place-items-center rounded-full bg-deep text-[10px] font-bold text-cream ring-2 ring-page">+{platforms.length - max}</span>}
    </span>
  );
}
