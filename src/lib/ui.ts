"use client";
import { useSyncExternalStore } from "react";
import type { ContentItem } from "./types";

/** Tiny global UI state: which app-wide dialogs are open. */
type Ui = { idea: null | { defaults?: Partial<ContentItem>; mode: "idea" | "content" }; search: boolean };
let ui: Ui = { idea: null, search: false };
const subs = new Set<() => void>();
const set = (n: Partial<Ui>) => { ui = { ...ui, ...n }; subs.forEach((f) => f()); };
export const uiActions = {
  openIdea: (defaults?: Partial<ContentItem>) => set({ idea: { defaults, mode: "idea" } }),
  openContent: (defaults?: Partial<ContentItem>) => set({ idea: { defaults, mode: "content" } }),
  closeIdea: () => set({ idea: null }),
  setSearch: (search: boolean) => set({ search }),
};
export const useUi = () => useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb); }; }, () => ui, () => ui);
