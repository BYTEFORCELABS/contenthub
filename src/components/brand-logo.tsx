import Image from "next/image";

const FULL = { src: "/brand/cyberzik_full_colour.png", cream: "/brand/cyberzic_cream.png", w: 884, h: 415 };
const MARK = { src: "/brand/cyberzik_mark.png", w: 501, h: 501 };
export const MIN_FULL_WIDTH = 120;

/**
 * Logo exactly as supplied: no filters, aspect ratio preserved. The full
 * lockup never renders below 120 px; narrower requests get the mark. Padding
 * gives clear space of at least the height of the C in the wordmark.
 */
export function BrandLogo({ width, priority }: { width: number; priority?: boolean }) {
  const full = width >= MIN_FULL_WIDTH;
  const a = full ? FULL : MARK;
  const clear = Math.ceil(width * (full ? 0.085 : 0.1));
  const img = { width: a.w, height: a.h, unoptimized: true, priority, style: { objectFit: "contain", width, height: "auto" } as const };
  return (
    // The full lockup swaps to the supplied cream version in dark mode. The mark has no cream version yet, so it sits on a white tile.
    <span className={full ? undefined : "cz-logo"} style={{ padding: clear, display: "inline-block", lineHeight: 0 }}>
      {/* unoptimized: serve the supplied PNG byte-for-byte, never re-encoded. */}
      <Image src={a.src} alt="CYBERZIK Technologies" {...img} className={full ? "cz-logo-light" : undefined} />
      {full && <Image src={FULL.cream} alt="" aria-hidden {...img} className="cz-logo-dark" />}
    </span>
  );
}
