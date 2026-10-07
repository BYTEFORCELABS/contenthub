import { useId } from "react";
import { cn } from "@/lib/cn";
import type { Asset } from "@/lib/types";
import { KIND_META } from "./files";

/** Stand-in preview: wash surface, a faint line pattern and the kind icon. Asset.hue only nudges pattern angle and strength. */
export function AssetPreview({ asset, className, iconClass = "size-8" }: { asset: Pick<Asset, "kind" | "hue">; className?: string; iconClass?: string }) {
  const id = useId();
  const Icon = KIND_META[asset.kind].icon;
  const angle = (asset.hue % 12) * 15;
  return (
    <div className={cn("relative grid place-items-center overflow-hidden bg-wash", className)} aria-hidden>
      <svg className="absolute inset-0 size-full text-deep" style={{ opacity: 0.05 + (asset.hue % 8) / 100 }}>
        <defs><pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}><line x1="0" y1="0" x2="0" y2="14" stroke="currentColor" strokeWidth="1.5" /></pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <span className="relative grid size-14 place-items-center rounded-full bg-page/80 text-deep ring-1 ring-hairline"><Icon className={iconClass} strokeWidth={1.5} /></span>
    </div>
  );
}
