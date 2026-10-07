"use client";
import { Check, Download } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/avatar";
import { StatusBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { CHECKLIST_TEMPLATE, STATUS_META } from "@/lib/meta";
import { useHub } from "@/lib/store";
import { STATUSES } from "@/lib/types";

const Note = ({ children }: { children: React.ReactNode }) => <p className="rounded-xl bg-wash px-4 py-3 text-[13px] text-muted">{children}</p>;

export function TeamSection() {
  const { people, items } = useHub();
  return (
    <div className="space-y-4">
      {people.length === 0 ? <p className="py-8 text-center text-[13.5px] text-muted">No team members.</p> : (
        <ul className="divide-y divide-hairline rounded-xl border border-hairline">
          {people.map((p) => <li key={p.id} className="flex items-center gap-3 px-4 py-3"><Avatar name={p.name} size={32} /><span className="flex-1 text-[14px] font-bold text-ink">{p.name}</span><span className="num text-[12.5px] text-muted">{items.filter((i) => i.assignee === p.id).length} assigned</span></li>)}
        </ul>
      )}
      <Note>Team management, invitations and roles arrive with the backend. For now the team list is fixed.</Note>
    </div>
  );
}

export function WorkflowSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="eyebrow mb-2">Stages</h3>
        <ol className="divide-y divide-hairline rounded-xl border border-hairline">
          {STATUSES.map((s, i) => <li key={s} className="flex items-center gap-3 px-4 py-2.5"><span className="num w-4 text-[12px] font-bold text-muted">{i + 1}</span><span className="w-32 shrink-0"><StatusBadge status={s} /></span><span className="text-[13px] text-muted">{STATUS_META[s].hint}</span></li>)}
        </ol>
      </div>
      <div>
        <h3 className="eyebrow mb-2">Default checklist</h3>
        <ul className="grid gap-1.5 sm:grid-cols-2">{CHECKLIST_TEMPLATE.map((c) => <li key={c} className="flex items-center gap-2 rounded-lg border border-hairline px-3 py-2 text-[13px] text-ink"><Check className="size-3.5 text-bronze" aria-hidden />{c}</li>)}</ul>
      </div>
      <Note>The workflow is fixed in this version. Custom stages and checklists will be configurable later.</Note>
    </div>
  );
}

export function AppearanceSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-xl border border-hairline p-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-lg border border-hairline bg-wash text-[11px] font-bold text-deep">Aa</span>
        <div><div className="text-[14px] font-bold text-ink">Light theme</div><div className="text-[13px] text-muted">Cream and deep brown, set in Futura, matching the Cyberzik Ledger.</div></div>
      </div>
      <Note>Dark mode will follow the Ledger when it ships there, so both tools change together.</Note>
    </div>
  );
}

export function DataSection() {
  const state = useHub();
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `cyberzik-contenthub-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Exported current data as JSON");
  };
  return (
    <div className="space-y-4">
      <Note>Everything is saved to your Content Hub database as you work, so it is the same on every device. Export a copy any time.</Note>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline p-4">
        <div><div className="text-[14px] font-bold text-ink">Export JSON</div><div className="text-[13px] text-muted">Download everything: content, campaigns, pillars, assets and activity.</div></div>
        <Button variant="outline" onClick={exportJson}><Download />Export JSON</Button>
      </div>
    </div>
  );
}
