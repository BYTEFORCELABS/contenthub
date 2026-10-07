"use client";
import { useState } from "react";
import { Database, GitBranch, Palette, Shapes, Users, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PillarsSection } from "@/components/settings/pillars";
import { AppearanceSection, DataSection, TeamSection, WorkflowSection } from "@/components/settings/sections";
import { cn } from "@/lib/cn";

const SECTIONS: { id: string; label: string; icon: LucideIcon; view: () => React.ReactNode }[] = [
  { id: "pillars", label: "Content pillars", icon: Shapes, view: PillarsSection },
  { id: "team", label: "Team", icon: Users, view: TeamSection },
  { id: "workflow", label: "Workflow", icon: GitBranch, view: WorkflowSection },
  { id: "appearance", label: "Appearance", icon: Palette, view: AppearanceSection },
  { id: "data", label: "Data", icon: Database, view: DataSection },
];

export default function SettingsPage() {
  const [id, setId] = useState("pillars");
  const cur = SECTIONS.find((s) => s.id === id)!;
  const View = cur.view;
  return (
    <div className="cz-page">
      <PageHeader title="Settings" subtitle="Pillars, team, workflow and your data." />
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <nav aria-label="Settings sections" className="flex shrink-0 gap-1 overflow-x-auto md:w-52 md:flex-col md:overflow-visible">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setId(s.id)} aria-current={id === s.id ? "page" : undefined}
              className={cn("flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-[13.5px] font-bold transition-colors", id === s.id ? "bg-wash-strong text-deep" : "text-muted hover:bg-wash hover:text-ink")}>
              <s.icon className="size-4" aria-hidden />{s.label}
            </button>
          ))}
        </nav>
        <section className="min-w-0 max-w-2xl flex-1" aria-labelledby="settings-h">
          <h2 id="settings-h" className="mb-4 text-[18px] font-bold text-deep">{cur.label}</h2>
          <View />
        </section>
      </div>
    </div>
  );
}
