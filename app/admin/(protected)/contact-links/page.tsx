import { prisma } from "@/lib/prisma";
import ContactLinksEditor from "@/components/admin/contact-links-editor";

export const dynamic = "force-dynamic";

export default async function Page() {
  const rows = await prisma.contactLink.findMany({ orderBy: { sortOrder: "asc" } });
  return <ContactLinksEditor initial={rows.map((r) => ({ id: r.id, label: r.label, href: r.href }))} />;
}
