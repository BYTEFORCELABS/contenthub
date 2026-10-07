import type { Format, Platform, Priority, Status } from "./types";

export const STATUS_META: Record<Status, { label: string; short: string; hint: string }> = {
  idea: { label: "Idea", short: "Idea", hint: "Captured, not yet committed to" },
  planned: { label: "Planned", short: "Planned", hint: "Approved to make, brief started" },
  production: { label: "In production", short: "Production", hint: "Being written, designed or filmed" },
  editing: { label: "Editing", short: "Editing", hint: "Polishing the draft" },
  review: { label: "Review", short: "Review", hint: "Waiting for sign-off" },
  approved: { label: "Approved", short: "Approved", hint: "Signed off, ready to schedule" },
  scheduled: { label: "Scheduled", short: "Scheduled", hint: "Has a publish date" },
  published: { label: "Published", short: "Published", hint: "Live" },
};
export const PLATFORM_META: Record<Platform, { label: string }> = {
  instagram: { label: "Instagram" }, facebook: { label: "Facebook" }, linkedin: { label: "LinkedIn" },
  tiktok: { label: "TikTok" }, x: { label: "X" }, website: { label: "Website" }, youtube: { label: "YouTube" },
};
export const FORMAT_META: Record<Format, { label: string }> = {
  carousel: { label: "Carousel" }, image: { label: "Single image" }, reel: { label: "Reel / short video" }, video: { label: "Long video" },
  text: { label: "Text post" }, thread: { label: "Thread" }, article: { label: "Article" }, story: { label: "Story" },
};
export const PRIORITY_META: Record<Priority, { label: string; rank: number }> = {
  high: { label: "High", rank: 0 }, medium: { label: "Medium", rank: 1 }, low: { label: "Low", rank: 2 },
};
/** Stage-by-stage checklist template used for every new piece of content. */
export const CHECKLIST_TEMPLATE = [
  "Idea approved", "Caption written", "Creative designed", "Video edited", "Final review", "Approved", "Scheduled", "Published",
];
/** How many checklist steps are complete once an item reaches each stage. */
export const STAGE_DONE: Record<Status, number> = { idea: 0, planned: 1, production: 2, editing: 4, review: 5, approved: 6, scheduled: 7, published: 8 };
