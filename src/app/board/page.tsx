import type { Metadata } from "next";
import { ContentBoard } from "@/components/board/content-board";

export const metadata: Metadata = { title: "Content Board" };
export default function Page() { return <ContentBoard />; }
