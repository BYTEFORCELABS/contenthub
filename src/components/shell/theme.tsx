"use client";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "cz-theme";
type Theme = "light" | "dark";

/** Runs before the page paints, so there is no flash of the wrong theme. Chosen theme wins; otherwise the device's. */
export const THEME_SCRIPT = `try{var t=localStorage.getItem("${KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}`;

const subs = new Set<() => void>();
const current = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
function subscribe(cb: () => void) {
  subs.add(cb);
  const mq = matchMedia("(prefers-color-scheme: dark)");
  const onDevice = () => {
    let chosen: string | null = null;
    try { chosen = localStorage.getItem(KEY); } catch { /* ignore */ }
    if (chosen !== "light" && chosen !== "dark") { document.documentElement.dataset.theme = mq.matches ? "dark" : "light"; subs.forEach((f) => f()); }
  };
  mq.addEventListener("change", onDevice);
  return () => { subs.delete(cb); mq.removeEventListener("change", onDevice); };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, current, () => "light" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";
  const flip = () => {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch { /* ignore */ }
    subs.forEach((f) => f());
  };
  return (
    <button type="button" onClick={flip} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}
      className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-wash-strong hover:text-ink">
      {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}
