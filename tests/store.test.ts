import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Changes } from "@/lib/tables";

const saved: Changes[] = [];
vi.mock("@/lib/persist", () => ({ persist: vi.fn(async (c: Changes) => { saved.push(c); return { ok: true }; }) }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const { hub } = await import("@/lib/store");
const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => { saved.length = 0; });

describe("saving changes to the database", () => {
  it("a new idea is saved as one new row", async () => {
    const item = hub.addItem({ title: "Hook: nobody reads your 404 page" });
    await flush();
    const first = saved[0];
    expect(first.items?.upsert.map((r) => r.id)).toEqual([item.id]);
    expect(first.items?.remove).toEqual([]);
    expect(first.activity?.upsert).toHaveLength(1); // "idea created" log line
  });

  it("an edit saves only the row that changed", async () => {
    const a = hub.addItem({ title: "A" });
    const b = hub.addItem({ title: "B" });
    await flush(); saved.length = 0;
    hub.updateItem(a.id, { title: "A, edited" });
    await flush();
    expect(saved[0].items?.upsert.map((r) => r.id)).toEqual([a.id]);
    expect(saved[0].items?.upsert.map((r) => r.id)).not.toContain(b.id);
  });

  it("deleting removes the row from the database, and nothing else", async () => {
    const a = hub.addItem({ title: "Delete me" });
    const b = hub.addItem({ title: "Keep me" });
    await flush(); saved.length = 0;
    hub.deleteItem(a.id);
    await flush();
    expect(saved[0].items?.remove).toEqual([a.id]);
    expect(saved[0].items?.upsert).toEqual([]);
    hub.updateItem(b.id, { title: "Keep me, still here" }); // b is untouched by the delete
    await flush();
    expect(saved[1].items?.upsert.map((r) => r.id)).toEqual([b.id]);
  });

  it("deleting a campaign also frees its content instead of deleting it", async () => {
    const c = hub.addCampaign({ name: "Launch", description: "", startDate: "2026-10-01", endDate: "2026-10-31", goal: "" });
    const item = hub.addItem({ title: "In campaign", campaignId: c.id });
    await flush(); saved.length = 0;
    hub.deleteCampaign(c.id);
    await flush();
    expect(saved[0].campaigns?.remove).toEqual([c.id]);
    expect(saved[0].items?.upsert.map((r) => r.id)).toEqual([item.id]);
    expect((saved[0].items?.upsert[0] as unknown as { campaignId: string | null }).campaignId).toBeNull();
  });

  it("deleting the same thing twice does nothing the second time", async () => {
    const a = hub.addItem({ title: "Once" });
    await flush();
    hub.deleteItem(a.id); await flush(); saved.length = 0;
    hub.deleteItem(a.id); await flush();
    expect(saved).toHaveLength(0);
  });

  it("writes are sent in the order they happened", async () => {
    const a = hub.addItem({ title: "Quick" });
    hub.updateItem(a.id, { title: "Quick 2" });
    hub.deleteItem(a.id);
    await flush(); await flush(); await flush();
    expect(saved.map((c) => (c.items?.remove.length ? "delete" : "upsert"))).toEqual(["upsert", "upsert", "delete"]);
  });

  it("deleting a campaign with its content removes every piece, and only that campaign's", async () => {
    const c = hub.addCampaign({ name: "Plan", description: "", startDate: "2026-10-01", endDate: "2026-10-31", goal: "" });
    const mine = [hub.addItem({ title: "One", campaignId: c.id }), hub.addItem({ title: "Two", campaignId: c.id })];
    const other = hub.addItem({ title: "Not in the plan" });
    await flush(); saved.length = 0;
    hub.deleteCampaign(c.id, true);
    await flush();
    expect(saved[0].campaigns?.remove).toEqual([c.id]);
    expect([...(saved[0].items?.remove ?? [])].sort()).toEqual(mine.map((i) => i.id).sort());
    expect(saved[0].items?.remove).not.toContain(other.id);
    expect(saved[0].items?.upsert).toEqual([]);
  });
});
