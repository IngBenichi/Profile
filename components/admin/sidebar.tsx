"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth-actions";
import { MONO, SG } from "@/components/admin/kit";

const NAV: { href: string; label: string }[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/site", label: "Textos del sitio" },
  { href: "/admin/timeline", label: "Línea de tiempo" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/credentials", label: "Credenciales" },
  { href: "/admin/projects", label: "Proyectos" },
  { href: "/admin/experience", label: "Experiencia" },
  { href: "/admin/contact-links", label: "Enlaces de contacto" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 232,
        flexShrink: 0,
        borderRight: "1px solid oklch(1 0 0 / 0.08)",
        background: "oklch(0.14 0.006 250)",
        minHeight: "100vh",
        padding: "20px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px 18px" }}>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "oklch(0.75 0.14 150)",
            boxShadow: "0 0 8px oklch(0.75 0.14 150 / 0.8)",
          }}
        />
        <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 14, letterSpacing: "0.04em" }}>
          BENICHI<span style={{ color: "oklch(0.55 0.01 250)" }}>://CMS</span>
        </span>
      </div>

      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.03em",
              textDecoration: "none",
              padding: "9px 11px",
              borderRadius: 7,
              color: active ? "oklch(0.96 0.003 250)" : "oklch(0.58 0.01 250)",
              background: active ? "oklch(1 0 0 / 0.06)" : "transparent",
              borderLeft: active ? "2px solid oklch(0.75 0.14 150)" : "2px solid transparent",
            }}
          >
            {item.label}
          </Link>
        );
      })}

      <div style={{ marginTop: "auto", paddingTop: 16 }}>
        <Link
          href="/"
          target="_blank"
          style={{ fontFamily: MONO, fontSize: 11, color: "oklch(0.55 0.01 250)", textDecoration: "none", display: "block", padding: "8px 11px" }}
        >
          ↗ ver sitio
        </Link>
        <button
          onClick={async () => {
            await logout();
            window.location.href = "/admin/login";
          }}
          style={{
            width: "100%",
            fontFamily: MONO,
            fontSize: 11,
            textAlign: "left",
            color: "oklch(0.7 0.12 25)",
            background: "oklch(0.7 0.16 25 / 0.08)",
            border: "1px solid oklch(0.7 0.16 25 / 0.3)",
            borderRadius: 7,
            padding: "9px 11px",
            cursor: "pointer",
          }}
        >
          ⏻ cerrar sesión
        </button>
      </div>
    </aside>
  );
}
