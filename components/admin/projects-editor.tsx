"use client";

import { upsertProject } from "@/app/actions/admin";
import { AddButton, ImagePicker, KIT_CSS, LocText, PageHead, RowCard, StringList, Text, Toast, useCrud } from "@/components/admin/kit";

type Row = {
  id?: number;
  code: string;
  title: string;
  role: { es: string; en: string };
  description: { es: string; en: string };
  tech: string[];
  githubUrl: string;
  demoUrl: string;
  imageUrl: string;
};

export default function ProjectsEditor({ initial }: { initial: Row[] }) {
  const c = useCrud<Row>({
    model: "project",
    initial,
    blank: () => ({
      code: "",
      title: "",
      role: { es: "", en: "" },
      description: { es: "", en: "" },
      tech: [],
      githubUrl: "",
      demoUrl: "",
      imageUrl: "",
    }),
    upsert: (r) => upsertProject({ ...r, demoUrl: r.demoUrl.trim() || null }),
  });

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: KIT_CSS }} />
      <PageHead title="Proyectos" hint="Tarjetas de la sección de proyectos del landing." />
      <AddButton label="Añadir proyecto" onClick={c.add} />

      {c.rows.map((row, i) => (
        <RowCard
          key={row._key}
          title={`${row.code || "—"} · ${row.title || "(nuevo)"}`}
          pending={c.busy === row._key}
          dirty={c.dirty.has(row._key)}
          onSave={() => c.save(row)}
          onDelete={() => c.del(row)}
          onUp={i > 0 ? () => c.move(row._key, -1) : undefined}
          onDown={i < c.rows.length - 1 ? () => c.move(row._key, 1) : undefined}
        >
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 10 }}>
            <Text label="Código" value={row.code} placeholder="SYS-01" onChange={(v) => c.patch(row._key, { code: v })} />
            <Text label="Título" value={row.title} onChange={(v) => c.patch(row._key, { title: v })} />
          </div>
          <LocText label="Rol" value={row.role} onChange={(v) => c.patch(row._key, { role: v })} />
          <LocText label="Descripción" value={row.description} onChange={(v) => c.patch(row._key, { description: v })} area />
          <StringList label="Tecnologías" items={row.tech} onChange={(v) => c.patch(row._key, { tech: v })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Text label="GitHub URL" value={row.githubUrl} onChange={(v) => c.patch(row._key, { githubUrl: v })} />
            <Text label="Demo URL (opcional)" value={row.demoUrl} onChange={(v) => c.patch(row._key, { demoUrl: v })} />
          </div>
          <ImagePicker label="Imagen del proyecto" value={row.imageUrl} onChange={(v) => c.patch(row._key, { imageUrl: v })} />
        </RowCard>
      ))}
      <Toast toast={c.toast} />
    </div>
  );
}
