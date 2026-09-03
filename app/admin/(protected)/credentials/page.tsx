import { prisma } from "@/lib/prisma";
import CredentialsEditor from "@/components/admin/credentials-editor";

export const dynamic = "force-dynamic";
const L = (v: unknown) => { const o = (v ?? {}) as { es?: string; en?: string }; return { es: o.es ?? "", en: o.en ?? "" }; };

export default async function Page() {
  const rows = await prisma.credential.findMany({ orderBy: { sortOrder: "asc" } });
  return <CredentialsEditor initial={rows.map((r) => ({ id: r.id, name: L(r.name), imageUrl: r.imageUrl }))} />;
}
