"use client";
import { useSyncExternalStore } from "react";
import { addDays, today } from "./dates";
import { CHECKLIST_TEMPLATE, STAGE_DONE, STATUS_META } from "./meta";
import { seedState } from "./seed";
import type { Asset, Campaign, ContentItem, HubState, Pillar, Platform, Status } from "./types";

/**
 * Frontend-only store. Everything the UI changes goes through the functions in `hub`,
 * so a real backend can replace this module without touching any component.
 * State persists in localStorage until then.
 */
const KEY = "cyberzik-contenthub-v1";
const SEED = seedState();
let state: HubState = SEED;
let loaded = false;
const subs = new Set<() => void>();

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;
const nowIso = () => new Date().toISOString();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw) as HubState;
  } catch { /* private mode or corrupt data: fall back to the seed */ }
}
function commit(next: HubState) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage unavailable; state still lives in memory */ }
  subs.forEach((f) => f());
}
const log = (s: HubState, text: string, ref: { itemId?: string; campaignId?: string } = {}): HubState => ({
  ...s, activity: [{ id: uid("a"), text, at: nowIso(), ...ref }, ...s.activity].slice(0, 60),
});

function subscribe(cb: () => void) {
  load();
  subs.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY || !e.newValue) return;
    try { state = JSON.parse(e.newValue); subs.forEach((f) => f()); } catch { /* ignore */ }
  };
  window.addEventListener("storage", onStorage);
  return () => { subs.delete(cb); window.removeEventListener("storage", onStorage); };
}
const getSnapshot = () => { load(); return state; };
const getServerSnapshot = () => SEED;

/** Subscribe to the whole hub. Select derived data with plain code or the helpers in select.ts. */
export function useHub(): HubState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export type NewItem = Partial<Omit<ContentItem, "id" | "createdAt" | "updatedAt">> & { title: string };

function blank(p: NewItem): ContentItem {
  const status = p.status ?? "idea";
  return {
    id: uid("c"), description: "", status, priority: "medium", pillarId: state.pillars[0]?.id ?? "", campaignId: null,
    platforms: [], format: "image", publishDate: null, assignee: null, tags: [], notes: "",
    brief: { objective: "", audience: "", keyMessage: "", hook: "", cta: "", notes: "" }, caption: "", media: [],
    checklist: CHECKLIST_TEMPLATE.map((label, k) => ({ id: `k${k}`, label, done: k < STAGE_DONE[status] })),
    repurposedFromId: null, ...p, createdAt: nowIso(), updatedAt: nowIso(),
  };
}

export const hub = {
  addItem(p: NewItem): ContentItem {
    const item = blank(p);
    commit(log({ ...state, items: [item, ...state.items] }, item.status === "idea" ? `New content idea created: ${item.title}` : `New content created: ${item.title}`, { itemId: item.id }));
    return item;
  },
  updateItem(id: string, patch: Partial<ContentItem>) {
    commit({ ...state, items: state.items.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: nowIso() } : c)) });
  },
  /** Moves an item between stages, ticking the checklist steps that stage implies and giving published/scheduled work a date. */
  moveItem(id: string, status: Status): { dateAssigned: string | null } {
    const item = state.items.find((c) => c.id === id);
    if (!item || item.status === status) return { dateAssigned: null };
    let publishDate = item.publishDate; let dateAssigned: string | null = null;
    if ((status === "scheduled" || status === "published") && !publishDate) { publishDate = status === "published" ? today() : addDays(today(), 1); dateAssigned = publishDate; }
    const done = STAGE_DONE[status];
    const checklist = item.checklist.map((k, i) => (i < done ? { ...k, done: true } : k));
    const next = { ...state, items: state.items.map((c) => (c.id === id ? { ...c, status, publishDate, checklist, updatedAt: nowIso() } : c)) };
    commit(log(next, status === "published" ? `Post marked as Published: ${item.title}` : status === "scheduled" ? `Content scheduled: ${item.title}` : `Post moved to ${STATUS_META[status].label}: ${item.title}`, { itemId: id }));
    return { dateAssigned };
  },
  toggleCheck(id: string, checkId: string) {
    commit({ ...state, items: state.items.map((c) => (c.id === id ? { ...c, updatedAt: nowIso(), checklist: c.checklist.map((k) => (k.id === checkId ? { ...k, done: !k.done } : k)) } : c)) });
  },
  deleteItem(id: string) { commit({ ...state, items: state.items.filter((c) => c.id !== id) }); },
  /** One piece of content becomes one new item per chosen platform, linked back to the original. */
  repurpose(id: string, targets: { platform: Platform; format: ContentItem["format"] }[]): ContentItem[] {
    const src = state.items.find((c) => c.id === id);
    if (!src || !targets.length) return [];
    const made = targets.map((t) => blank({
      title: `${src.title} (${t.platform === "x" ? "X" : t.platform[0].toUpperCase() + t.platform.slice(1)})`, description: src.description, status: "planned", priority: src.priority,
      pillarId: src.pillarId, campaignId: src.campaignId, platforms: [t.platform], format: t.format, tags: src.tags, brief: src.brief, repurposedFromId: src.id, assignee: src.assignee,
    }));
    commit(log({ ...state, items: [...made, ...state.items] }, `Repurposed "${src.title}" into ${made.length} pieces`, { itemId: id }));
    return made;
  },
  addCampaign(p: Omit<Campaign, "id">): Campaign {
    const c = { ...p, id: uid("camp") };
    commit(log({ ...state, campaigns: [c, ...state.campaigns] }, `Campaign created: ${c.name}`, { campaignId: c.id }));
    return c;
  },
  updateCampaign(id: string, patch: Partial<Campaign>) { commit({ ...state, campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)) }); },
  deleteCampaign(id: string) {
    commit({ ...state, campaigns: state.campaigns.filter((c) => c.id !== id), items: state.items.map((i) => (i.campaignId === id ? { ...i, campaignId: null } : i)) });
  },
  addAsset(p: Omit<Asset, "id" | "addedAt">): Asset {
    const a = { ...p, id: uid("as"), addedAt: nowIso() };
    commit({ ...state, assets: [a, ...state.assets] });
    return a;
  },
  updateAsset(id: string, patch: Partial<Asset>) { commit({ ...state, assets: state.assets.map((a) => (a.id === id ? { ...a, ...patch } : a)) }); },
  deleteAsset(id: string) { commit({ ...state, assets: state.assets.filter((a) => a.id !== id) }); },
  addPillar(p: Omit<Pillar, "id">) { commit({ ...state, pillars: [...state.pillars, { ...p, id: uid("pil") }] }); },
  updatePillar(id: string, patch: Partial<Pillar>) { commit({ ...state, pillars: state.pillars.map((p) => (p.id === id ? { ...p, ...patch } : p)) }); },
  /** Content keeps working if its pillar is removed: it falls back to the first remaining one. */
  deletePillar(id: string) {
    const rest = state.pillars.filter((p) => p.id !== id);
    if (!rest.length) return;
    commit({ ...state, pillars: rest, items: state.items.map((i) => (i.pillarId === id ? { ...i, pillarId: rest[0].id } : i)) });
  },
  reset() { commit(seedState()); },
};
