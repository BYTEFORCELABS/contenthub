export const TABLES = ["items", "campaigns", "pillars", "assets", "activity"] as const;
export type Table = (typeof TABLES)[number];
export type Changes = Partial<Record<Table, { upsert: { id: string }[]; remove: string[] }>>;
