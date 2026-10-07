import type { HubState } from "./types";

export const TABLES = ["items", "campaigns", "pillars", "assets", "activity"] as const;
export type Table = (typeof TABLES)[number];
export type Changes = Partial<Record<Table, { upsert: { id: string }[]; remove: string[] }>>;

/** Rows that differ between two states, by id, per table. */
export function diff(prev: HubState, next: HubState): Changes {
  const out: Changes = {};
  for (const t of TABLES) {
    const before = new Map<string, unknown>((prev[t] as { id: string }[]).map((r) => [r.id, r]));
    const rows = next[t] as { id: string }[];
    const upsert = rows.filter((r) => before.get(r.id) !== r);
    const keep = new Set(rows.map((r) => r.id));
    const remove = [...before.keys()].filter((id) => !keep.has(id));
    if (upsert.length || remove.length) out[t] = { upsert, remove };
  }
  return out;
}

