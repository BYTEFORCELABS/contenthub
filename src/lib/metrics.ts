import { addDays, diffDays, fmtShort, today } from "./dates";
import type { ContentItem, Pillar, Platform } from "./types";

/**
 * Deterministic MOCK metrics for the analytics prototype. Nothing here is measured:
 * every number derives from a hash of the content id, so it is stable between renders and reloads.
 * Replace this module with real platform data once accounts are connected.
 */
export const RANGES = [7, 30, 90] as const;
export type Range = (typeof RANGES)[number];
export const METRIC_PLATFORMS: Platform[] = ["instagram", "facebook", "linkedin", "tiktok", "x"];

export type Counts = { reach: number; likes: number; comments: number; shares: number; saves: number; clicks: number };
export type Metrics = Counts & { engagements: number; rate: number };

/** 32-bit FNV-1a, mapped to 0..1. */
export const unit = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 100000) / 100000;
};
/** Longer windows give each post more time to accumulate reach. */
const RANGE_FACTOR: Record<Range, number> = { 7: 0.35, 30: 1, 90: 2.4 };
const REACH_W: Record<Platform, number> = { instagram: 1.2, facebook: 0.9, linkedin: 0.8, tiktok: 1.5, x: 0.6, website: 0.5, youtube: 1 };
const ENG_W: Record<Platform, number> = { instagram: 1.15, facebook: 0.8, linkedin: 1.1, tiktok: 1.3, x: 0.7, website: 0.5, youtube: 1 };

const finish = (c: Counts): Metrics => {
  const engagements = c.likes + c.comments + c.shares + c.saves;
  return { ...c, engagements, rate: c.reach ? (engagements / c.reach) * 100 : 0 };
};
export const sumMetrics = (list: Metrics[]): Metrics =>
  finish(list.reduce((a, m) => ({ reach: a.reach + m.reach, likes: a.likes + m.likes, comments: a.comments + m.comments, shares: a.shares + m.shares, saves: a.saves + m.saves, clicks: a.clicks + m.clicks }), { reach: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0 }));

/** Published items in the window. Short windows only include recent posts; longer ones include all published work. */
export const publishedIn = (items: ContentItem[], range: Range) =>
  items.filter((i) => i.status === "published" && (range !== 7 || !i.publishDate || diffDays(i.publishDate, today()) >= -7));

function platformMetrics(item: ContentItem, p: Platform, range: Range): Metrics {
  const k = `${item.id}:${p}`;
  const reach = Math.round((600 + unit(k + "r") * 5400) * REACH_W[p] * RANGE_FACTOR[range] * (0.9 + unit(item.id + range) * 0.2));
  const e = ENG_W[p] * (0.035 + unit(k + "e") * 0.06);
  const part = (w: number, s: string) => Math.round(reach * e * w * (0.8 + unit(k + s) * 0.4));
  return finish({ reach, likes: part(0.62, "l"), comments: part(0.07, "c"), shares: part(0.12, "s"), saves: part(0.19, "v"), clicks: Math.round(reach * (0.008 + unit(k + "k") * 0.03)) });
}
/** Per-platform split for one item, only for platforms the item was published on that we report on. */
export function itemByPlatform(item: ContentItem, range: Range): Partial<Record<Platform, Metrics>> {
  const out: Partial<Record<Platform, Metrics>> = {};
  item.platforms.filter((p) => METRIC_PLATFORMS.includes(p)).forEach((p) => { out[p] = platformMetrics(item, p, range); });
  return out;
}
export const itemMetrics = (item: ContentItem, range: Range): Metrics => sumMetrics(Object.values(itemByPlatform(item, range)));

export const summary = (items: ContentItem[], range: Range) => {
  const pub = publishedIn(items, range);
  return { posts: pub.length, ...sumMetrics(pub.map((i) => itemMetrics(i, range))) };
};

/** Mock change versus the previous period, in percent, between about -6 and +20. */
export const deltaFor = (key: string, range: Range) => Math.round((unit(`${key}:${range}`) * 26 - 6) * 10) / 10;

export type Bucket = { label: string; reach: number; engagements: number };
/** Splits the period totals over days (or weeks for 90 days) with a deterministic wobble, so the buckets always add up to the KPI. */
export function timeSeries(items: ContentItem[], range: Range): Bucket[] {
  const total = summary(items, range);
  const n = range === 90 ? 13 : range, span = range === 90 ? 7 : 1;
  const w = Array.from({ length: n }, (_, i) => 0.45 + unit(`w${range}:${i}`) + (i / n) * 0.35);
  const sum = w.reduce((a, b) => a + b, 0);
  return w.map((x, i) => {
    const end = addDays(today(), -(n - 1 - i) * span);
    return { label: span === 1 ? fmtShort(end) : `Week of ${fmtShort(addDays(end, -6))}`, reach: Math.round((total.reach * x) / sum), engagements: Math.round((total.engagements * x) / sum) };
  });
}

export function platformStats(items: ContentItem[], range: Range) {
  const pub = publishedIn(items, range);
  return METRIC_PLATFORMS.map((platform) => {
    const rows = pub.map((i) => itemByPlatform(i, range)[platform]).filter((m): m is Metrics => !!m);
    return { platform, posts: rows.length, ...sumMetrics(rows) };
  });
}

export function topContent(items: ContentItem[], range: Range, n = 5) {
  return publishedIn(items, range).map((item) => ({ item, ...itemMetrics(item, range) })).sort((a, b) => b.rate - a.rate).slice(0, n);
}

export function pillarStats(pillars: Pillar[], items: ContentItem[], range: Range) {
  const pub = publishedIn(items, range);
  return pillars.map((pillar) => {
    const rows = pub.filter((i) => i.pillarId === pillar.id);
    return { pillar, posts: rows.length, ...sumMetrics(rows.map((i) => itemMetrics(i, range))) };
  }).sort((a, b) => b.rate - a.rate);
}

export const fmtNum = (n: number) => (n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : n.toLocaleString("en-GB"));
export const fmtPct = (n: number) => `${n.toFixed(1)}%`;
