import { ContentWorkspace } from "@/components/workspace/content-workspace";

export default async function Page({ params }: PageProps<"/content/[id]">) {
  const { id } = await params;
  return <ContentWorkspace id={id} />;
}
