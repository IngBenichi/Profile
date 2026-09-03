import Landing from "@/components/landing";
import { getLandingContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getLandingContent();
  return <Landing content={content} />;
}
