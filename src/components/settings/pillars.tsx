"use client";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PillarBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/field";
import { hub, useHub } from "@/lib/store";
import type { Pillar } from "@/lib/types";

const TONES: Record<Pillar["tone"], string> = { tech: "Technology", edu: "Education", brand: "Brand", biz: "Business", promo: "Promotion" };
const parseTopics = (s: string) => [...new Set(s.split(",").map((t) => t.trim()).filter(Boolean))];

function PillarForm({ pillar, onClose }: { pillar: Pillar | null; onClose: () => void }) {
  const [name, setName] = useState(pillar?.name ?? "");
  const [topics, setTopics] = useState(pillar?.topics.join(", ") ?? "");
  const [tone, setTone] = useState<Pillar["tone"]>(pillar?.tone ?? "brand");
  const save = () => {
    if (!name.trim()) return;
    const v = { name: name.trim(), topics: parseTopics(topics), tone };
    if (pillar) hub.updatePillar(pillar.id, v); else hub.addPillar(v);
    toast.success(pillar ? "Pillar updated" : "Pillar added");
    onClose();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()} title={pillar ? "Edit pillar" : "New pillar"} description="Pillars are the themes your content is organised around."
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button disabled={!name.trim()} onClick={save}>{pillar ? "Save" : "Add pillar"}</Button></>}>
      <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <Field label="Name"><Input autoFocus value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Topics" hint="Separate with commas"><Input value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="Web development, AI" /></Field>
        <Field label="Tone"><Select value={tone} onChange={(e) => setTone(e.target.value as Pillar["tone"])}>{Object.entries(TONES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</Select></Field>
      </form>
    </Dialog>
  );
}

export function PillarsSection() {
  const { pillars, items } = useHub();
  const [edit, setEdit] = useState<Pillar | "new" | null>(null);
  const [del, setDel] = useState<Pillar | null>(null);
  const used = (id: string) => items.filter((i) => i.pillarId === id).length;
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[13.5px] text-muted">Themes that keep your content mix balanced.</p>
        <Button onClick={() => setEdit("new")}><Plus />Add pillar</Button>
      </div>
      {pillars.length === 0 ? <p className="rounded-xl border border-dashed border-hairline-strong py-10 text-center text-[13.5px] text-muted">No pillars yet. Add one to start organising content.</p> : (
        <ul className="space-y-3">
          {pillars.map((p) => (
            <li key={p.id} className="rounded-xl border border-hairline p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-[14px]"><PillarBadge pillar={p} /><span className="num text-[12.5px] text-muted">{used(p.id)} {used(p.id) === 1 ? "item" : "items"}</span></div>
                <div className="flex gap-1">
                  <Button variant="ghost" aria-label={`Edit ${p.name}`} onClick={() => setEdit(p)}><Pencil /></Button>
                  <Button variant="danger-ghost" aria-label={`Delete ${p.name}`} disabled={pillars.length < 2} title={pillars.length < 2 ? "At least one pillar is required" : undefined} onClick={() => setDel(p)}><Trash2 /></Button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">{p.topics.length ? p.topics.map((t) => <span key={t} className="rounded-md bg-wash px-2 py-0.5 text-[12px] font-bold text-muted ring-1 ring-inset ring-hairline">{t}</span>) : <span className="text-[12.5px] text-muted">No topics</span>}</div>
            </li>
          ))}
        </ul>
      )}
      {edit && <PillarForm key={edit === "new" ? "new" : edit.id} pillar={edit === "new" ? null : edit} onClose={() => setEdit(null)} />}
      <Dialog open={!!del} onOpenChange={(o) => !o && setDel(null)} title={`Delete "${del?.name}"?`}
        description={del && used(del.id) ? `${used(del.id)} content ${used(del.id) === 1 ? "item uses" : "items use"} this pillar and will move to ${pillars.find((p) => p.id !== del.id)?.name}.` : "No content uses this pillar."}
        footer={<><Button variant="ghost" onClick={() => setDel(null)}>Cancel</Button><Button variant="danger" onClick={() => { if (del) hub.deletePillar(del.id); toast.success("Pillar deleted"); setDel(null); }}>Delete pillar</Button></>} />
    </div>
  );
}
