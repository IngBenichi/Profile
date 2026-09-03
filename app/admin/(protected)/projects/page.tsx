import { prisma } from "@/lib/prisma";
import ProjectsEditor from "@/components/admin/projects-editor";

export const dynamic = "force-dynamic";
const L = (v: unknown) => { const o = (v ?? {}) as { es?: string; en?: string }; return { es: o.es ?? "", en: o.en ?? "" }; };

export default async function Page() {
  const rows = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <ProjectsEditor
      initial={rows.map((r) => ({
        id: r.id,
        code: r.code,
        title: r.title,
        role: L(r.role),
        description: L(r.description),
        tech: r.tech,
        githubUrl: r.githubUrl,
        demoUrl: r.demoUrl ?? "",
        imageUrl: r.imageUrl,
      }))}
    />
  );
}
