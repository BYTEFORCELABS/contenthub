import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "outline" | "ghost" | "subtle" | "danger" | "danger-ghost";
const styles: Record<Variant, string> = {
  primary: "bg-deep text-cream hover:bg-deep/90 shadow-[0_1px_0_rgb(0_0_0/0.08),inset_0_1px_0_rgb(255_255_255/0.08)]",
  outline: "border border-hairline-strong bg-page text-ink hover:bg-wash hover:border-deep/30",
  ghost: "text-ink hover:bg-wash",
  subtle: "bg-wash text-deep hover:bg-wash-strong",
  danger: "bg-status-overdue text-page hover:bg-status-overdue/90",
  "danger-ghost": "text-status-overdue hover:bg-status-overdue/8",
};
const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[13px] font-bold transition-[background-color,border-color,box-shadow,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 h-9 px-3.5 [&_svg]:size-4 [&_svg]:shrink-0";

export function Button({ variant = "primary", className, ...p }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button type="button" className={cn(base, styles[variant], className)} {...p} />;
}
export function ButtonLink({ variant = "primary", className, ...p }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(base, styles[variant], className)} {...p} />;
}
