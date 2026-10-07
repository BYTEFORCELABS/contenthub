"use client";
import { useMemo, useState } from "react";
import { FolderOpen, LayoutGrid, List, Search, Upload } from "lucide-react";
import { AssetDetail } from "@/components/library/asset-detail";
import { AssetTile } from "@/components/library/asset-tile";
import { sizeToMb, type AssetKind } from "@/components/library/files";
import { UploadDialog } from "@/components/library/upload-dialog";
import { EmptyState, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { useHub } from "@/lib/store";

const TABS: { id: string; label: string; kinds: AssetKind[] | null }[] = [
  { id: "all", label: "All", kinds: null },
  { id: "images", label: "Images", kinds: ["image", "thumbnail"] },
  { id: "videos", label: "Videos", kinds: ["video"] },
  { id: "graphics", label: "Graphics", kinds: ["graphic"] },
  { id: "documents", label: "Documents", kinds: ["document"] },
  { id: "brand", label: "Brand assets", kinds: ["brand"] },
];

export default function LibraryPage() {
  const { assets } = useHub();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [tags, setTags] = useState<string[]>([]);
  const [list, setList] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [upload, setUpload] = useState(false);

  const counts = useMemo(() => Object.fromEntries(TABS.map((t) => [t.id, t.kinds ? assets.filter((a) => t.kinds!.includes(a.kind)).length : assets.length])), [assets]);
  const allTags = useMemo(() => [...new Set(assets.flatMap((a) => a.tags))].sort(), [assets]);
  const shown = useMemo(() => {
    const kinds = TABS.find((t) => t.id === tab)?.kinds;
    const n = q.trim().toLowerCase();
    const out = assets.filter((a) => (!kinds || kinds.includes(a.kind)) && tags.every((t) => a.tags.includes(t)) && (!n || (a.name + " " + a.tags.join(" ")).toLowerCase().includes(n)));
    return out.sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "size" ? sizeToMb(b.size) - sizeToMb(a.size) : b.addedAt.localeCompare(a.addedAt));
  }, [assets, tab, q, sort, tags]);
  const filtered = q.trim() !== "" || tags.length > 0;
  const toggleTag = (t: string) => setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  return (
    <div className="cz-page">
      <PageHeader title="Content Library" subtitle="Keep every creative asset in one place, ready to attach to content."
        actions={<Button onClick={() => setUpload(true)}><Upload />Upload</Button>} />

      <div role="tablist" aria-label="Asset type" className="mb-4 flex gap-1 overflow-x-auto border-b border-hairline">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={cn("-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2 text-[13px] font-bold transition-colors", tab === t.id ? "border-deep text-deep" : "border-transparent text-muted hover:text-ink")}>
            {t.label}<span className="num rounded-full bg-wash px-1.5 text-[11px]">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-52 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or tag…" aria-label="Search assets" className="h-8 pl-8 text-[13px]" />
        </div>
        <Select aria-label="Sort assets" className="h-8 w-auto py-0 text-[12.5px] font-bold" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option><option value="name">Name</option><option value="size">Size</option>
        </Select>
        <div className="ml-auto flex rounded-lg bg-wash p-0.5" role="group" aria-label="View">
          {[[false, LayoutGrid, "Grid view"], [true, List, "List view"]].map(([v, Icon, label]) => {
            const I = Icon as typeof List;
            return <button key={String(v)} aria-label={label as string} aria-pressed={list === v} onClick={() => setList(v as boolean)} className={cn("rounded-md p-1.5 transition-colors", list === v ? "bg-page text-deep shadow-sm" : "text-muted hover:text-ink")}><I className="size-4" /></button>;
          })}
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Filter by tag">
          {allTags.map((t) => (
            <button key={t} aria-pressed={tags.includes(t)} onClick={() => toggleTag(t)}
              className={cn("rounded-md px-2 py-0.5 text-[12px] font-bold ring-1 ring-inset transition-colors", tags.includes(t) ? "bg-deep text-cream ring-deep" : "bg-wash text-muted ring-hairline hover:text-ink")}>#{t}</button>
          ))}
          {tags.length > 0 && <button onClick={() => setTags([])} className="px-1 text-[12px] font-bold text-bronze hover:underline">Clear tags</button>}
        </div>
      )}

      {shown.length === 0 ? (
        <EmptyState icon={FolderOpen} title={filtered ? "No assets match" : "Nothing here yet"} text={filtered ? "Try a different search or clear the tag filters." : "Upload images, video, graphics or documents to start the library."}
          action={filtered ? "Clear filters" : "Upload"} onAction={filtered ? () => { setQ(""); setTags([]); } : () => setUpload(true)} />
      ) : list ? (
        <div className="divide-y divide-hairline overflow-hidden rounded-xl border border-hairline">{shown.map((a) => <AssetTile key={a.id} asset={a} list onOpen={() => setOpenId(a.id)} />)}</div>
      ) : (
        <div className="cz-stagger grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{shown.map((a) => <AssetTile key={a.id} asset={a} onOpen={() => setOpenId(a.id)} />)}</div>
      )}

      <AssetDetail asset={assets.find((a) => a.id === openId)} onClose={() => setOpenId(null)} />
      <UploadDialog open={upload} onOpenChange={setUpload} />
    </div>
  );
}
