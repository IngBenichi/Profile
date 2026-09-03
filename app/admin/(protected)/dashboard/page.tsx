import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MONO, SG } from "@/components/admin/kit";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [projects, experiences, hubs, credentials, timeline, links, assets] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.skillHub.count(),
    prisma.credential.count(),
    prisma.timelineItem.count(),
    prisma.contactLink.count(),
    prisma.asset.count(),
  ]);

  const cards = [
    { label: "Proyectos", n: projects, href: "/admin/projects" },
    { label: "Experiencia", n: experiences, href: "/admin/experience" },
    { label: "Grupos de skills", n: hubs, href: "/admin/skills" },
    { label: "Credenciales", n: credentials, href: "/admin/credentials" },
    { label: "Línea de tiempo", n: timeline, href: "/admin/timeline" },
    { label: "Enlaces de contacto", n: links, href: "/admin/contact-links" },
    { label: "Imágenes subidas", n: assets, href: "/admin/projects" },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: SG, fontSize: 26, fontWeight: 700, margin: "0 0 6px" }}>Panel</h1>
      <p style={{ fontFamily: MONO, fontSize: 12, color: "oklch(0.55 0.01 250)", margin: "0 0 28px" }}>
        Todo lo que edites aquí se refleja al instante en benichi.dev
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            style={{
              textDecoration: "none",
              border: "1px solid oklch(1 0 0 / 0.1)",
              borderRadius: 12,
              background: "oklch(0.16 0.006 250 / 0.6)",
              padding: "18px 16px",
              color: "inherit",
            }}
          >
            <div style={{ fontFamily: SG, fontSize: 28, fontWeight: 700, color: "oklch(0.75 0.14 150)" }}>{c.n}</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: "oklch(0.6 0.012 250)", marginTop: 4 }}>{c.label}</div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        <Link
          href="/admin/site"
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: "oklch(0.9 0.005 250)",
            textDecoration: "none",
            border: "1px solid oklch(1 0 0 / 0.14)",
            borderRadius: 8,
            padding: "10px 16px",
            display: "inline-block",
          }}
        >
          › Editar textos del sitio (hero, sobre mí, contacto…)
        </Link>
      </div>
    </div>
  );
}
