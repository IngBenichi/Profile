"use client";

import { upsertHub, upsertSkillItem } from "@/app/actions/admin";
import { AddButton, Btn, KIT_CSS, Label, LocText, MONO, PageHead, RowCard, Text, Toast, useCrud } from "@/components/admin/kit";

type Item = { id?: number; hubId: number; name: string; years: string; level: { es: string; en: string } };
type Hub = { id?: number; slug: string; color: string; label: { es: string; en: string }; items: Item[] };

function HubItems({ hubId, items }: { hubId: number; items: Item[] }) {
  const c = useCrud<Item>({
    model: "skillItem",
    initial: items,
    blank: () => ({ hubId, name: "", years: "", level: { es: "", en: "" } }),
    upsert: (r) => upsertSkillItem({ ...r, hubId }),
  });

  return (
    <div style={{ borderTop: "1px solid oklch(1 0 0 / 0.07)", marginTop: 4, paddingTop: 12 }}>
      <Label>Skills del grupo</Label>
      <div style={{ marginTop: 8 }}>
        {c.rows.map((it, i) => (
          <div
            key={it._key}
            style={{ border: "1px solid oklch(1 0 0 / 0.08)", borderRadius: 9, padding: 10, marginBottom: 8, display: "flex", flexDirection: "column", gap: 9 }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ flex: 2 }}>
                <Text label="Nombre" value={it.name} onChange={(v) => c.patch(it._key, { name: v })} />
              </div>
              <div style={{ width: 90 }}>
                <Text label="Años" value={it.years} placeholder="3+" onChange={(v) => c.patch(it._key, { years: v })} />
              </div>
              <Btn type="button" kind="primary" onClick={() => c.save(it)} disabled={c.busy === it._key}>
                {c.busy === it._key ? "…" : "Guardar"}
              </Btn>
              <Btn type="button" kind="danger" onClick={() => c.del(it)}>✕</Btn>
              {i > 0 && <Btn type="button" onClick={() => c.move(it._key, -1)}>▲</Btn>}
              {i < c.rows.length - 1 && <Btn type="button" onClick={() => c.move(it._key, 1)}>▼</Btn>}
            </div>
            <LocText label="Nivel (Básico / Intermedio / Avanzado)" value={it.level} onChange={(v) => c.patch(it._key, { level: v })} />
          </div>
        ))}
        <Btn type="button" onClick={c.add}>+ skill</Btn>
      </div>
      <Toast toast={c.toast} />
    </div>
  );
}

export default function SkillsEditor({ initial }: { initial: Hub[] }) {
  const c = useCrud<Hub>({
    model: "skillHub",
    initial,
    blank: () => ({ slug: "", color: "oklch(0.75 0.14 150)", label: { es: "", en: "" }, items: [] }),
    // items are not part of the hub upsert payload
    upsert: (r) => upsertHub({ id: r.id, slug: r.slug, label: r.label, color: r.color }),
  });

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: KIT_CSS }} />
      <PageHead title="Skills" hint="Grupos (LENGUAJES, FRAMEWORKS…) y sus skills. El % de la barra sale del nivel." />
      <AddButton label="Añadir grupo" onClick={c.add} />

      {c.rows.map((hub, i) => (
        <RowCard
          key={hub._key}
          title={hub.label.es || hub.slug || "(nuevo grupo)"}
          pending={c.busy === hub._key}
          dirty={c.dirty.has(hub._key)}
          onSave={() => c.save(hub)}
          onDelete={() => c.del(hub)}
          onUp={i > 0 ? () => c.move(hub._key, -1) : undefined}
          onDown={i < c.rows.length - 1 ? () => c.move(hub._key, 1) : undefined}
        >
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 10 }}>
            <Text label="Slug" value={hub.slug} placeholder="lang" onChange={(v) => c.patch(hub._key, { slug: v })} />
            <Text label="Color (oklch / hex)" value={hub.color} onChange={(v) => c.patch(hub._key, { color: v })} />
          </div>
          <LocText label="Etiqueta" value={hub.label} onChange={(v) => c.patch(hub._key, { label: v })} />

          {hub.id ? (
            <HubItems hubId={hub.id} items={hub.items} />
          ) : (
            <p style={{ fontFamily: MONO, fontSize: 11, color: "oklch(0.6 0.012 250)" }}>Guarda el grupo para añadirle skills.</p>
          )}
        </RowCard>
      ))}
      <Toast toast={c.toast} />
    </div>
  );
}
