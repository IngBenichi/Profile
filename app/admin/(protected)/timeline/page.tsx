import { prisma } from "@/lib/prisma";
import TimelineEditor from "@/components/admin/timeline-editor";

export const dynamic = "force-dynamic";
const L = (v: unknown) => { const o = (v ?? {}) as { es?: string; en?: string }; return { es: o.es ?? "", en: o.en ?? "" }; };

export default async function Page() {
  const rows = await prisma.timelineItem.findMany({ orderBy: { sortOrder: "asc" } });
  return <TimelineEditor initial={rows.map((r) => ({ id: r.id, year: r.year, text: L(r.text) }))} />;
}
