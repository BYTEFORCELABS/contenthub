import { toISO, fmtShort } from "@/lib/dates";
import { cn } from "@/lib/cn";
import type { Asset } from "@/lib/types";
import { TagChip } from "@/components/badges";
import { AssetPreview } from "./asset-preview";
import { KIND_META } from "./files";

const added = (a: Asset) => fmtShort(toISO(new Date(a.addedAt)));

export function AssetTile({ asset, list, onOpen }: { asset: Asset; list?: boolean; onOpen: () => void }) {
  const Icon = KIND_META[asset.kind].icon;
  if (list) {
    return (
      <button type="button" onClick={onOpen} className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-wash/70">
        <AssetPreview asset={asset} className="size-12 shrink-0 rounded-lg border border-hairline" iconClass="size-4" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-bold text-ink">{asset.name}</span>
          <span className="mt-0.5 flex flex-wrap gap-1">{asset.tags.slice(0, 3).map((t) => <TagChip key={t}>{t}</TagChip>)}</span>
        </span>
        <span className="hidden items-center gap-1 text-[12.5px] text-muted sm:flex"><Icon className="size-3.5" />{KIND_META[asset.kind].label}</span>
        <span className="num w-16 shrink-0 text-right text-[12.5px] text-muted">{asset.size}</span>
        <span className="num hidden w-14 shrink-0 text-right text-[12.5px] text-muted sm:block">{added(asset)}</span>
      </button>
    );
  }
  return (
    <button type="button" onClick={onOpen} className={cn("group flex flex-col overflow-hidden rounded-xl border border-hairline bg-page text-left transition-colors hover:border-deep/30")}>
      <AssetPreview asset={asset} className="aspect-[4/3] w-full border-b border-hairline transition-colors group-hover:bg-wash-strong" />
      <span className="flex flex-1 flex-col gap-1.5 p-3">
        <span className="truncate text-[13.5px] font-bold text-ink" title={asset.name}>{asset.name}</span>
        <span className="num text-[12px] text-muted">{asset.size} · {added(asset)}</span>
        <span className="mt-auto flex flex-wrap gap-1">{asset.tags.slice(0, 2).map((t) => <TagChip key={t}>{t}</TagChip>)}{asset.tags.length > 2 && <span className="text-[11.5px] font-bold text-muted">+{asset.tags.length - 2}</span>}</span>
      </span>
    </button>
  );
}
