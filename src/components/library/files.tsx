import { Award, FileText, Film, Image as ImageIcon, Shapes, type LucideIcon } from "lucide-react";
import type { Asset, MediaKind } from "@/lib/types";

export type AssetKind = Asset["kind"];
export const KIND_META: Record<AssetKind, { label: string; plural: string; icon: LucideIcon }> = {
  image: { label: "Image", plural: "Images", icon: ImageIcon },
  video: { label: "Video", plural: "Videos", icon: Film },
  graphic: { label: "Graphic", plural: "Graphics", icon: Shapes },
  document: { label: "Document", plural: "Documents", icon: FileText },
  thumbnail: { label: "Thumbnail", plural: "Thumbnails", icon: ImageIcon },
  brand: { label: "Brand asset", plural: "Brand assets", icon: Award },
};

const GRAPHIC_EXT = /\.(svg|fig|ai|psd|eps|sketch|xd)$/i;
const DOC_EXT = /\.(pdf|docx?|pptx?|xlsx?|txt|md|csv|key|pages)$/i;
/** Best guess from MIME type, then extension. */
export function inferKind(file: { name: string; type: string }): MediaKind {
  if (file.type.startsWith("video/")) return "video";
  if (GRAPHIC_EXT.test(file.name)) return "graphic";
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf" || DOC_EXT.test(file.name)) return "document";
  return "document";
}

export function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(0.1, bytes / 1024 / 1024).toFixed(1)} MB`;
  const mb = bytes / 1024 / 1024;
  return mb >= 100 ? `${Math.round(mb)} MB` : `${mb.toFixed(1)} MB`;
}
/** "48 MB" -> megabytes, for sorting. */
export const sizeToMb = (s: string) => {
  const n = parseFloat(s) || 0;
  return /gb/i.test(s) ? n * 1024 : /kb/i.test(s) ? n / 1024 : n;
};

export const PREVIEW_ONLY = "Added to the library (preview only: files aren't stored until storage is connected)";
export const hueOf = (name: string) => 20 + ([...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 26);
