"use client";
import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/field";
import { toISO, fmtLong } from "@/lib/dates";
import { hub } from "@/lib/store";
import type { Asset } from "@/lib/types";
import { AssetPreview } from "./asset-preview";
import { KIND_META } from "./files";

const parseTags = (s: string) => [...new Set(s.split(",").map((t) => t.trim().toLowerCase().replace(/^#/, "")).filter(Boolean))];

function Body({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  const [name, setName] = useState(asset.name);
  const [tags, setTags] = useState(asset.tags.join(", "));
  const [confirm, setConfirm] = useState(false);
  const dirty = name.trim() !== asset.name || parseTags(tags).join() !== asset.tags.join();
  const save = () => {
    if (!name.trim()) return;
    hub.updateAsset(asset.id, { name: name.trim(), tags: parseTags(tags) });
    toast.success("Asset updated");
  };
  return (
    <>
      <AssetPreview asset={asset} className="aspect-[16/9] rounded-xl border border-hairline" iconClass="size-9" />
      <p className="num mt-3 text-[12.5px] text-muted">{KIND_META[asset.kind].label} · {asset.size} · Added {fmtLong(toISO(new Date(asset.addedAt)))}</p>
      <div className="mt-4 grid gap-3">
        <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Tags" hint="Separate with commas"><Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="website, carousel" /></Field>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button disabled={!dirty || !name.trim()} onClick={save}>Save changes</Button>
          <Button variant="outline" disabled title="Storage isn't connected yet"><Download />Download</Button>
        </div>
        {confirm ? (
          <div className="flex items-center gap-2 text-[13px]"><span className="font-bold text-status-overdue">Delete this asset?</span>
            <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { hub.deleteAsset(asset.id); toast.success("Asset deleted"); onClose(); }}>Delete</Button></div>
        ) : <Button variant="danger-ghost" onClick={() => setConfirm(true)}><Trash2 />Delete</Button>}
      </div>
    </>
  );
}

export function AssetDetail({ asset, onClose }: { asset: Asset | undefined; onClose: () => void }) {
  return (
    <Dialog open={!!asset} onOpenChange={(o) => !o && onClose()} title={asset?.name ?? "Asset"} description="Rename, tag or remove this asset.">
      {asset && <Body key={asset.id} asset={asset} onClose={onClose} />}
    </Dialog>
  );
}
