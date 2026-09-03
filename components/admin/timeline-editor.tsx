"use client";

import { upsertTimeline } from "@/app/actions/admin";
import { AddButton, KIT_CSS, LocText, PageHead, RowCard, Text, Toast, useCrud } from "@/components/admin/kit";

type Row = { id?: number; year: string; text: { es: string; en: string } };

export default function TimelineEditor({ initial }: { initial: Row[] }) {
  const c = useCrud<Row>({
    model: "timelineItem",
    initial,
    blank: () => ({ year: "", text: { es: "", en: "" } }),
    upsert: (r) => upsertTimeline(r),
  });

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: KIT_CSS }} />
      <PageHead title="Línea de tiempo" hint="Los hitos de la sección 'Sobre mí'." />
      <AddButton label="Añadir hito" onClick={c.add} />

      {c.rows.map((row, i) => (
        <RowCard
          key={row._key}
          title={row.year || "(sin año)"}
          pending={c.busy === row._key}
          dirty={c.dirty.has(row._key)}
          onSave={() => c.save(row)}
          onDelete={() => c.del(row)}
          onUp={i > 0 ? () => c.move(row._key, -1) : undefined}
          onDown={i < c.rows.length - 1 ? () => c.move(row._key, 1) : undefined}
        >
          <div style={{ maxWidth: 200 }}>
            <Text label="Año" value={row.year} onChange={(v) => c.patch(row._key, { year: v })} />
          </div>
          <LocText label="Texto" value={row.text} onChange={(v) => c.patch(row._key, { text: v })} />
        </RowCard>
      ))}
      <Toast toast={c.toast} />
    </div>
  );
}
