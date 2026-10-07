"use client";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <div className="eyebrow">Something went wrong</div>
      <h1 className="mt-2 text-[24px] font-bold text-deep">This page failed to load</h1>
      <p className="mt-2 text-[13.5px] text-muted">{error.message || "An unexpected error occurred."}</p>
      <Button className="mt-5" onClick={reset}>Try again</Button>
    </div>
  );
}
