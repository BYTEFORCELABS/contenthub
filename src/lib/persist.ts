"use server";
import { currentEmail } from "./auth";
import { supabaseAdmin } from "./supabase/server";
import type { HubState } from "./types";

import { TABLES, type Changes, type Table } from "./tables";

const NEWEST_FIRST: Record<Table, boolean> = { items: true, campaigns: true, pillars: false, assets: true, activity: true };
const PEOPLE = [{ id: "Isaac", name: "Isaac" }, { id: "Zainab", name: "Zainab" }, { id: "Tobi", name: "Tobi" }];

/** Everything the app shows, or null when nobody valid is signed in. Called by the layout on each page load. */
export async function loadState(): Promise<HubState | null> {
  if (!(await currentEmail())) return null;
  const db = supabaseAdmin();
  const rows = await Promise.all(TABLES.map(async (t) => {
    const { data, error } = await db.from(t).select("data").order("seq", { ascending: !NEWEST_FIRST[t] }).limit(5000);
    if (error) throw new Error(`Could not read ${t}: ${error.message}`);
    return (data ?? []).map((r) => r.data);
  }));
  const [items, campaigns, pillars, assets, activity] = rows as unknown as [HubState["items"], HubState["campaigns"], HubState["pillars"], HubState["assets"], HubState["activity"]];
  return { items, campaigns, pillars, assets, activity, people: PEOPLE };
}

/** Saves what changed in the browser. Only signed-in members may call it. */
export async function persist(changes: Changes): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await currentEmail())) return { ok: false, error: "Your session has ended. Sign in again." };
  const db = supabaseAdmin();
  const now = new Date().toISOString();
  for (const t of TABLES) {
    const c = changes[t];
    if (!c) continue;
    if (c.upsert.length) {
      const { error } = await db.from(t).upsert(c.upsert.map((r) => ({ id: r.id, data: r, updated_at: now })), { onConflict: "id" });
      if (error) return { ok: false, error: error.message };
    }
    if (c.remove.length) {
      const { error } = await db.from(t).delete().in("id", c.remove);
      if (error) return { ok: false, error: error.message };
    }
  }
  return { ok: true };
}
