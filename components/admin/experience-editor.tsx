"use client";

import { upsertExperience } from "@/app/actions/admin";
import { AddButton, ImagePicker, KIT_CSS, Label, LocText, PageHead, RowCard, StringList, Text, Toast, useCrud } from "@/components/admin/kit";

type Row = {
  id?: number;
  company: string;
  logoUrl: string;
  position: { es: string; en: string };
  period: string;
  location: { es: string; en: string };
  description: { es: string; en: string };
  achievements: { es: string[]; en: string[] };
};

export default function ExperienceEditor({ initial }: { initial: Row[] }) {
  const c = useCrud<Row>({
    model: "experience",
    initial,
    blank: () => ({
      company: "",
      logoUrl: "",
      position: { es: "", en: "" },
      period: "",
      location: { es: "", en: "" },
      description: { es: "", en: "" },
      achievements: { es: [], en: [] },
    }),
    upsert: (r) => upsertExperience(r),
  });

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: KIT_CSS }} />
      <PageHead title="Experiencia" hint="Cada empresa de la sección de experiencia." />
      <AddButton label="Añadir experiencia" onClick={c.add} />

      {c.rows.map((row, i) => (
        <RowCard
          key={row._key}
          title={row.company || "(nueva)"}
          pending={c.busy === row._key}
          dirty={c.dirty.has(row._key)}
          onSave={() => c.save(row)}
          onDelete={() => c.del(row)}
          onUp={i > 0 ? () => c.move(row._key, -1) : undefined}
          onDown={i < c.rows.length - 1 ? () => c.move(row._key, 1) : undefined}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Text label="Empresa" value={row.company} onChange={(v) => c.patch(row._key, { company: v })} />
            <Text label="Periodo" value={row.period} placeholder="Dec 2024 — Present" onChange={(v) => c.patch(row._key, { period: v })} />
          </div>
          <ImagePicker label="Logo" value={row.logoUrl} onChange={(v) => c.patch(row._key, { logoUrl: v })} />
          <LocText label="Cargo" value={row.position} onChange={(v) => c.patch(row._key, { position: v })} />
          <LocText label="Ubicación / modalidad" value={row.location} onChange={(v) => c.patch(row._key, { location: v })} />
          <LocText label="Descripción" value={row.description} onChange={(v) => c.patch(row._key, { description: v })} area />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <Label>Logros · ES</Label>
              <div style={{ marginTop: 6 }}>
                <StringList label="" items={row.achievements.es} onChange={(v) => c.patch(row._key, { achievements: { ...row.achievements, es: v } })} />
              </div>
            </div>
            <div>
              <Label>Logros · EN</Label>
              <div style={{ marginTop: 6 }}>
                <StringList label="" items={row.achievements.en} onChange={(v) => c.patch(row._key, { achievements: { ...row.achievements, en: v } })} />
              </div>
            </div>
          </div>
        </RowCard>
      ))}
      <Toast toast={c.toast} />
    </div>
  );
}
