"use client";

import { upsertCredential } from "@/app/actions/admin";
import { AddButton, ImagePicker, KIT_CSS, LocText, PageHead, RowCard, Toast, useCrud } from "@/components/admin/kit";

type Row = { id?: number; name: { es: string; en: string }; imageUrl: string };

export default function CredentialsEditor({ initial }: { initial: Row[] }) {
  const c = useCrud<Row>({
    model: "credential",
    initial,
    blank: () => ({ name: { es: "", en: "" }, imageUrl: "" }),
    upsert: (r) => upsertCredential(r),
  });

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: KIT_CSS }} />
      <PageHead title="Credenciales" hint="Certificados del carrusel de la sección Stack." />
      <AddButton label="Añadir credencial" onClick={c.add} />

      {c.rows.map((row, i) => (
        <RowCard
          key={row._key}
          title={row.name.es || "(nueva)"}
          pending={c.busy === row._key}
          dirty={c.dirty.has(row._key)}
          onSave={() => c.save(row)}
          onDelete={() => c.del(row)}
          onUp={i > 0 ? () => c.move(row._key, -1) : undefined}
          onDown={i < c.rows.length - 1 ? () => c.move(row._key, 1) : undefined}
        >
          <LocText label="Nombre" value={row.name} onChange={(v) => c.patch(row._key, { name: v })} />
          <ImagePicker label="Imagen del certificado" value={row.imageUrl} onChange={(v) => c.patch(row._key, { imageUrl: v })} />
        </RowCard>
      ))}
      <Toast toast={c.toast} />
    </div>
  );
}
