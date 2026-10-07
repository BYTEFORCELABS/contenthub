"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/field";
import type { Campaign } from "@/lib/types";

export type CampaignDraft = Omit<Campaign, "id">;
const BLANK: CampaignDraft = { name: "", description: "", goal: "", startDate: "", endDate: "" };
const FORM = "campaign-form";

function Form({ initial, onSubmit }: { initial: CampaignDraft; onSubmit: (d: CampaignDraft) => void }) {
  const [d, setD] = useState(initial);
  const [err, setErr] = useState("");
  const set = (p: Partial<CampaignDraft>) => setD((x) => ({ ...x, ...p }));
  return (
    <form id={FORM} className="flex flex-col gap-3.5" onSubmit={(e) => {
      e.preventDefault();
      if (!d.name.trim()) return setErr("Give the campaign a name.");
      if (d.startDate && d.endDate && d.endDate < d.startDate) return setErr("The end date comes before the start date.");
      onSubmit({ ...d, name: d.name.trim(), description: d.description.trim(), goal: d.goal.trim() });
    }}>
      <Field label="Name"><Input value={d.name} onChange={(e) => set({ name: e.target.value })} autoFocus required placeholder="Cyberzik Brand Awareness" /></Field>
      <Field label="Description"><Textarea value={d.description} onChange={(e) => set({ description: e.target.value })} placeholder="What is this campaign about?" /></Field>
      <Field label="Goal"><Input value={d.goal} onChange={(e) => set({ goal: e.target.value })} placeholder="e.g. 5,000 new followers" /></Field>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field label="Start date"><Input type="date" value={d.startDate} onChange={(e) => set({ startDate: e.target.value })} /></Field>
        <Field label="End date"><Input type="date" value={d.endDate} min={d.startDate || undefined} onChange={(e) => set({ endDate: e.target.value })} /></Field>
      </div>
      {err && <p role="alert" className="text-[12.5px] font-bold text-status-overdue">{err}</p>}
    </form>
  );
}

/** Create or edit. The form mounts only while open, so every open starts from `initial`. */
export function CampaignFormDialog({ open, onOpenChange, initial = BLANK, title, submitLabel, onSubmit }: {
  open: boolean; onOpenChange: (o: boolean) => void; initial?: CampaignDraft; title: string; submitLabel: string; onSubmit: (d: CampaignDraft) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title}
      footer={<><Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" form={FORM}>{submitLabel}</Button></>}>
      <Form initial={initial} onSubmit={onSubmit} />
    </Dialog>
  );
}
