import { prisma } from "@/lib/prisma";
import SkillsEditor from "@/components/admin/skills-editor";

export const dynamic = "force-dynamic";
const L = (v: unknown) => { const o = (v ?? {}) as { es?: string; en?: string }; return { es: o.es ?? "", en: o.en ?? "" }; };

export default async function Page() {
  const hubs = await prisma.skillHub.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
  return (
    <SkillsEditor
      initial={hubs.map((h) => ({
        id: h.id,
        slug: h.slug,
        color: h.color,
        label: L(h.label),
        items: h.items.map((it) => ({ id: it.id, hubId: h.id, name: it.name, years: it.years, level: L(it.level) })),
      }))}
    />
  );
}
