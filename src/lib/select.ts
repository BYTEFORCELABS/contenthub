import { addDays, diffDays, today } from "./dates";
import { STATUSES, type Campaign, type ContentItem, type HubState, type Pillar, type Status } from "./types";

export const countByStatus = (items: ContentItem[]) => Object.fromEntries(STATUSES.map((s) => [s, items.filter((i) => i.status === s).length])) as Record<Status, number>;
export const ideas = (items: ContentItem[]) => items.filter((i) => i.status === "idea");
export const inProduction = (items: ContentItem[]) => items.filter((i) => ["production", "editing", "review"].includes(i.status));
export const scheduledItems = (items: ContentItem[]) => items.filter((i) => i.status === "scheduled");
export const publishedThisMonth = (items: ContentItem[]) => items.filter((i) => i.status === "published" && i.publishDate?.slice(0, 7) === today().slice(0, 7));
export const upcoming = (items: ContentItem[]) =>
  items.filter((i) => i.publishDate && i.publishDate >= today() && i.status !== "published").sort((a, b) => a.publishDate!.localeCompare(b.publishDate!));
export const byId = <T extends { id: string }>(list: T[], id: string | null | undefined) => list.find((x) => x.id === id);
export const pillarOf = (s: HubState, i: ContentItem): Pillar | undefined => byId(s.pillars, i.pillarId);
export const campaignOf = (s: HubState, i: ContentItem): Campaign | undefined => byId(s.campaigns, i.campaignId);
export const campaignStats = (items: ContentItem[], campaignId: string) => {
  const list = items.filter((i) => i.campaignId === campaignId);
  return { total: list.length, ...countByStatus(list), inProduction: inProduction(list).length };
};

/** Text match across everything a person might remember a piece of content by. */
export function matches(s: HubState, i: ContentItem, q: string) {
  const n = q.trim().toLowerCase();
  if (!n) return true;
  const hay = [i.title, i.description, i.format, i.status, i.assignee ?? "", ...i.tags, ...i.platforms, pillarOf(s, i)?.name ?? "", campaignOf(s, i)?.name ?? ""].join(" ").toLowerCase();
  return n.split(/\s+/).every((w) => hay.includes(w));
}

/** What needs a person today: unfinished posts that are late or due today, and anything waiting on a review. Most urgent first. */
export type Attention = { item: ContentItem; reason: string; late: number };
export function needsAttention(items: ContentItem[]): Attention[] {
  const now = today();
  const out: Attention[] = [];
  for (const i of items) {
    if (i.status === "published" || i.status === "idea") continue;
    if (i.publishDate && i.publishDate < now) { const d = diffDays(now, i.publishDate); out.push({ item: i, late: d, reason: d === 1 ? "1 day late" : `${d} days late` }); }
    else if (i.publishDate === now && i.status !== "scheduled") out.push({ item: i, late: 0, reason: "Due today" });
    else if (i.status === "review") out.push({ item: i, late: -1, reason: "Waiting for review" });
  }
  return out.sort((a, b) => b.late - a.late || (a.item.publishDate ?? "").localeCompare(b.item.publishDate ?? ""));
}
export const dueToday = (items: ContentItem[]) => items.filter((i) => i.publishDate === today() && i.status !== "idea");
export const dueThisWeek = (items: ContentItem[]) => items.filter((i) => i.publishDate && i.publishDate >= today() && i.publishDate <= addDays(today(), 6) && i.status !== "published" && i.status !== "idea");
/** "Post time: 7:00 PM" in a post's notes, if there is one. */
export const postTime = (i: ContentItem) => /^Post time:\s*(.+)$/im.exec(i.notes)?.[1]?.trim() ?? null;
