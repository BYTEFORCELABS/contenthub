const p = (n: number) => String(n).padStart(2, "0");
export const toISO = (d: Date) => `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
export const parseISO = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
export const today = () => toISO(new Date());
export const addDays = (iso: string, n: number) => { const d = parseISO(iso); d.setDate(d.getDate() + n); return toISO(d); };
/** Monday-first week start. */
export const startOfWeek = (iso: string) => { const d = parseISO(iso); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return toISO(d); };
export const startOfMonth = (iso: string) => iso.slice(0, 8) + "01";
export const addMonths = (iso: string, n: number) => { const d = parseISO(iso); d.setDate(1); d.setMonth(d.getMonth() + n); return toISO(d); };
export const fmtShort = (iso: string) => parseISO(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
export const fmtLong = (iso: string) => parseISO(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
export const fmtMonth = (iso: string) => parseISO(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
export const fmtWeekday = (iso: string) => parseISO(iso).toLocaleDateString("en-GB", { weekday: "short" });
export const diffDays = (a: string, b: string) => Math.round((parseISO(a).getTime() - parseISO(b).getTime()) / 86400000);
export function relative(iso: string) {
  const n = diffDays(iso, today());
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  if (n === -1) return "Yesterday";
  return n > 0 ? `In ${n} days` : `${-n} days ago`;
}
export function timeAgo(isoTs: string) {
  const s = Math.max(0, (Date.now() - new Date(isoTs).getTime()) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  const d = Math.floor(s / 86400);
  return d === 1 ? "Yesterday" : `${d} days ago`;
}
/** 6 rows x 7 columns of ISO days covering the month containing `iso`. */
export function monthGrid(iso: string) {
  const first = startOfWeek(startOfMonth(iso));
  return Array.from({ length: 42 }, (_, i) => addDays(first, i));
}
