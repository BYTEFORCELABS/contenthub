export const STATUSES = ["idea", "planned", "production", "editing", "review", "approved", "scheduled", "published"] as const;
export type Status = (typeof STATUSES)[number];

export const PLATFORMS = ["instagram", "facebook", "linkedin", "tiktok", "x", "website", "youtube"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const FORMATS = ["carousel", "image", "reel", "video", "text", "thread", "article", "story"] as const;
export type Format = (typeof FORMATS)[number];

export const PRIORITIES = ["high", "medium", "low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export type Brief = { objective: string; audience: string; keyMessage: string; hook: string; cta: string; notes: string };
export type MediaKind = "image" | "video" | "graphic" | "document" | "thumbnail";
export type MediaRef = { id: string; name: string; kind: MediaKind; size: string };
export type ChecklistItem = { id: string; label: string; done: boolean };

/** One record covers an idea and the content it grows into: an idea is simply an item whose status is "idea". */
export type ContentItem = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  pillarId: string;
  campaignId: string | null;
  platforms: Platform[];
  format: Format;
  /** yyyy-mm-dd, local day */
  publishDate: string | null;
  assignee: string | null;
  tags: string[];
  notes: string;
  brief: Brief;
  caption: string;
  media: MediaRef[];
  checklist: ChecklistItem[];
  /** Set on items created through repurposing. */
  repurposedFromId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Pillar = { id: string; name: string; topics: string[]; tone: "tech" | "edu" | "brand" | "biz" | "promo" };
export type Campaign = { id: string; name: string; description: string; startDate: string; endDate: string; goal: string };
export type Asset = { id: string; name: string; kind: MediaKind | "brand"; size: string; tags: string[]; addedAt: string; hue: number };
export type Activity = { id: string; text: string; at: string; itemId?: string; campaignId?: string };
export type Person = { id: string; name: string };

export type HubState = {
  items: ContentItem[];
  campaigns: Campaign[];
  pillars: Pillar[];
  assets: Asset[];
  activity: Activity[];
  people: Person[];
};
