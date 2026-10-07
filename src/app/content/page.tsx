import { Suspense } from "react";
import type { Metadata } from "next";
import { AllContent } from "@/components/content/all-content";

export const metadata: Metadata = { title: "All Content" };
export default function Page() { return <Suspense><AllContent /></Suspense>; }
