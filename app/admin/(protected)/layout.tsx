import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Sidebar from "@/components/admin/sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "oklch(0.15 0.006 250)",
        color: "oklch(0.95 0.003 250)",
        fontFamily: "var(--font-inter), 'Inter', sans-serif",
      }}
    >
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, padding: "32px 36px", maxWidth: 1000 }}>{children}</main>
    </div>
  );
}
