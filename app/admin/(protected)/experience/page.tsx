import { prisma } from "@/lib/prisma";
import ExperienceEditor from "@/components/admin/experience-editor";

export const dynamic = "force-dynamic";
const L = (v: unknown) => { const o = (v ?? {}) as { es?: string; en?: string }; return { es: o.es ?? "", en: o.en ?? "" }; };
const LL = (v: unknown) => { const o = (v ?? {}) as { es?: string[]; en?: string[] }; return { es: o.es ?? [], en: o.en ?? [] }; };

export default async function Page() {
  const rows = await prisma.experience.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <ExperienceEditor
      initial={rows.map((r) => ({
        id: r.id,
        company: r.company,
        logoUrl: r.logoUrl,
        position: L(r.position),
        period: r.period,
        location: L(r.location),
        description: L(r.description),
        achievements: LL(r.achievements),
      }))}
    />
  );
}
