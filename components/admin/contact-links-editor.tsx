"use client";

import { upsertContactLink } from "@/app/actions/admin";
import { AddButton, KIT_CSS, PageHead, RowCard, Text, Toast, useCrud } from "@/components/admin/kit";

type Row = { id?: number; label: string; href: string };

export default function ContactLinksEditor({ initial }: { initial: Row[] }) {
  const c = useCrud<Row>({
    model: "contactLink",
    initial,
    blank: () => ({ label: "", href: "" }),
    upsert: (r) => upsertContactLink(r),
  });

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: KIT_CSS }} />
      <PageHead title="Enlaces de contacto" hint="Botones tipo terminal de la sección de contacto (mismo texto en ambos idiomas)." />
      <AddButton label="Añadir enlace" onClick={c.add} />

      {c.rows.map((row, i) => (
        <RowCard
          key={row._key}
          title={row.label || "(nuevo)"}
          pending={c.busy === row._key}
          dirty={c.dirty.has(row._key)}
          onSave={() => c.save(row)}
          onDelete={() => c.del(row)}
          onUp={i > 0 ? () => c.move(row._key, -1) : undefined}
          onDown={i < c.rows.length - 1 ? () => c.move(row._key, 1) : undefined}
        >
          <Text label="Etiqueta visible" value={row.label} placeholder="$ open github.com/IngBenichi" onChange={(v) => c.patch(row._key, { label: v })} />
          <Text label="URL / href" value={row.href} placeholder="https://…  o  mailto:…" onChange={(v) => c.patch(row._key, { href: v })} />
        </RowCard>
      ))}
      <Toast toast={c.toast} />
    </div>
  );
}
