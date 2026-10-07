import { afterAll, describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

/** Talks to the real Supabase project. Skipped when the keys are not in the environment. Uses rows named test-*, and removes them. */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SECRETE_KEY;
const pub = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const live = !!(url && secret && pub);

describe.skipIf(!live)("live database", () => {
  const db = live ? createClient(url!, secret!, { auth: { persistSession: false } }) : null!;
  const id = `test-${Date.now()}`;
  afterAll(async () => { await db?.from("items").delete().like("id", "test-%"); });

  it("saves, edits, reads back and deletes a row", async () => {
    const up = await db.from("items").upsert({ id, data: { id, title: "first" } }, { onConflict: "id" });
    expect(up.error).toBeNull();
    await db.from("items").upsert({ id, data: { id, title: "edited" } }, { onConflict: "id" });
    const read = await db.from("items").select("data").eq("id", id);
    expect(read.data).toEqual([{ data: { id, title: "edited" } }]);
    const del = await db.from("items").delete().in("id", [id]);
    expect(del.error).toBeNull();
    const gone = await db.from("items").select("id").eq("id", id);
    expect(gone.data).toEqual([]);
  });

  it("deleting a row that does not exist is harmless", async () => {
    expect((await db.from("items").delete().in("id", ["test-never-existed"])).error).toBeNull();
  });

  it("keeps the starting pillars and the allowed emails", async () => {
    expect((await db.from("pillars").select("id")).data?.length).toBeGreaterThanOrEqual(5);
    const emails = (await db.from("members").select("email")).data?.map((m) => m.email).sort();
    expect(emails).toEqual(["cyberzikk1@gmail.com", "isaacchukwuka67@gmail.com"]);
  });

  it("refuses the public key, so nobody can read or write without signing in", async () => {
    const anon = createClient(url!, pub!);
    expect((await anon.from("items").select("*")).error).not.toBeNull();
    expect((await anon.from("members").select("*")).error).not.toBeNull();
    expect((await anon.from("items").insert({ id: "test-anon", data: {} })).error).not.toBeNull();
  });
});
