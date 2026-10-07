import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <div className="eyebrow">404</div>
      <h1 className="mt-2 text-[26px] font-bold text-deep">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-[14px] text-muted">The content may have been deleted, or the link is wrong.</p>
      <div className="mt-5 flex justify-center gap-2"><ButtonLink href="/">Dashboard</ButtonLink><ButtonLink href="/content" variant="outline">All content</ButtonLink></div>
    </div>
  );
}
