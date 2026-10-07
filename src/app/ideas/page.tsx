import type { Metadata } from "next";
import { IdeaVault } from "@/components/ideas/idea-vault";

export const metadata: Metadata = { title: "Ideas" };
export default function Page() { return <IdeaVault />; }
