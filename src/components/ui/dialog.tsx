"use client";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Dialog({ open, onOpenChange, title, description, children, footer, className }: {
  open: boolean; onOpenChange: (o: boolean) => void; title: string; description?: ReactNode;
  children?: ReactNode; footer?: ReactNode; className?: string;
}) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="cz-overlay fixed inset-0 z-50 bg-overlay backdrop-blur-[2px]" />
        <D.Content
          className={cn("cz-dialog fixed left-1/2 top-3 z-50 flex max-h-[calc(100dvh-24px)] w-[calc(100vw-24px)] max-w-lg -translate-x-1/2 flex-col rounded-2xl sm:top-[10vh] sm:max-h-[calc(90dvh-24px)] sm:w-[calc(100vw-32px)] border border-hairline bg-page shadow-[0_24px_64px_-12px_rgb(36_26_18/0.3)] focus:outline-none", className)}
        >
          <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-5 sm:px-6">
            <div>
              <D.Title className="text-[16px] font-bold text-deep">{title}</D.Title>
              {description ? <D.Description className="mt-1 text-[13px] text-muted">{description}</D.Description> : <D.Description className="sr-only">{title}</D.Description>}
            </div>
            <D.Close className="rounded-md p-1 text-muted hover:bg-wash hover:text-ink" aria-label="Close"><X className="size-4" /></D.Close>
          </div>
          {children && <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">{children}</div>}
          {footer && <div className="flex shrink-0 flex-wrap justify-end gap-2 rounded-b-2xl border-t border-hairline bg-wash/50 px-5 py-3.5 sm:px-6">{footer}</div>}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
