import { Suspense } from "react";
import { CampaignsView } from "@/components/campaigns/campaigns-view";

export default function Page() {
  return <Suspense fallback={null}><CampaignsView /></Suspense>;
}
