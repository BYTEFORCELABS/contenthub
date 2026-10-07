import { today } from "./dates";
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
