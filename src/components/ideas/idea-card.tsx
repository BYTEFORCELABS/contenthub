"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm";
import { timeAgo } from "@/lib/dates";
import { hub } from "@/lib/store";
import type { ContentItem } from "@/lib/types";

/** One line per thought. Open it to add detail, whenever (or if ever) you want to. */
export function IdeaRow({ idea }: { idea: ContentItem }) {
  const [del, setDel] = useState(false);
  const hook = idea.tags.includes("hook");
  return (
    <li className="group flex items-start gap-3 py-4">
      <Link href={`/content/${idea.id}`} className="min-w-0 flex-1">
        <div className="text-[15.5px] font-bold leading-snug text-ink group-hover:text-deep">{idea.title}</div>
        {idea.description && <p className="mt-1 line-clamp-2 text-[13.5px] text-muted">{idea.description}</p>}
        <div className="mt-1.5 text-[12px] text-muted">{hook ? "Hook" : "Idea"} · {timeAgo(idea.createdAt)}</div>
      </Link>
      <button type="button" aria-label={`Delete ${idea.title}`} onClick={() => setDel(true)} className="grid size-8 shrink-0 place-items-center rounded-lg text-muted opacity-0 transition hover:bg-wash-strong hover:text-status-overdue focus:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100"><Trash2 className="size-4" /></button>
      <ConfirmDialog open={del} onOpenChange={setDel} title="Delete this?" description={`"${idea.title}" will be removed permanently.`} onConfirm={() => { hub.deleteItem(idea.id); toast.success("Deleted"); }} />
    </li>
  );
}
