"use client";

import { useState } from "react";
import { saveSite } from "@/app/actions/admin";
import { KIT_CSS, LocText, Panel, SaveBar, SG, Text, useSaver } from "@/components/admin/kit";

type Loc = { es: string; en: string };
type Form = {
  heroName: string;
  heroRealName: string;
  eduInstitution: string;
  heroBadge: Loc; heroTitle: Loc; heroCopy: Loc;
  aboutEyebrow: Loc; aboutP1: Loc; aboutP2: Loc; timelineTitle: Loc;
  stackEyebrow: Loc; stackIntro: Loc; credEyebrow: Loc;
  workEyebrow: Loc; workIntro: Loc; expEyebrow: Loc;
  eduTitle: Loc; eduDegree: Loc; eduPeriod: Loc;
  contactEyebrow: Loc; contactTitle: Loc; contactCopy: Loc; footer: Loc;
};

export default function SiteEditor({ initial }: { initial: Form }) {
  const [f, setF] = useState<Form>(initial);
  const { pending, msg, run } = useSaver();
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: KIT_CSS }} />
      <h1 style={{ fontFamily: SG, fontSize: 24, fontWeight: 700, margin: "0 0 20px" }}>Textos del sitio</h1>

      <Panel title="Identidad">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Text label="Nombre en pantalla (logo / H1)" value={f.heroName} onChange={(v) => set("heroName", v)} />
            <Text label="Nombre real" value={f.heroRealName} onChange={(v) => set("heroRealName", v)} />
          </div>
        </div>
      </Panel>

      <Panel title="Hero">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LocText label="Badge (disponibilidad)" value={f.heroBadge} onChange={(v) => set("heroBadge", v)} />
          <LocText label="Título / rol" value={f.heroTitle} onChange={(v) => set("heroTitle", v)} />
          <LocText label="Párrafo del hero" value={f.heroCopy} onChange={(v) => set("heroCopy", v)} area />
        </div>
      </Panel>

      <Panel title="Sobre mí">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LocText label="Título de sección" value={f.aboutEyebrow} onChange={(v) => set("aboutEyebrow", v)} />
          <LocText label="Párrafo 1" value={f.aboutP1} onChange={(v) => set("aboutP1", v)} area />
          <LocText label="Párrafo 2" value={f.aboutP2} onChange={(v) => set("aboutP2", v)} area />
          <LocText label="Rótulo de la línea de tiempo" value={f.timelineTitle} onChange={(v) => set("timelineTitle", v)} />
        </div>
      </Panel>

      <Panel title="Stack / Credenciales">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LocText label="Título de sección (Stack)" value={f.stackEyebrow} onChange={(v) => set("stackEyebrow", v)} />
          <LocText label="Intro del stack" value={f.stackIntro} onChange={(v) => set("stackIntro", v)} area />
          <LocText label="Rótulo de credenciales" value={f.credEyebrow} onChange={(v) => set("credEyebrow", v)} />
        </div>
      </Panel>

      <Panel title="Proyectos / Experiencia">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LocText label="Título de sección (Proyectos)" value={f.workEyebrow} onChange={(v) => set("workEyebrow", v)} />
          <LocText label="Intro de proyectos" value={f.workIntro} onChange={(v) => set("workIntro", v)} area />
          <LocText label="Título de sección (Experiencia)" value={f.expEyebrow} onChange={(v) => set("expEyebrow", v)} />
        </div>
      </Panel>

      <Panel title="Educación">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LocText label="Rótulo" value={f.eduTitle} onChange={(v) => set("eduTitle", v)} />
          <LocText label="Título / carrera" value={f.eduDegree} onChange={(v) => set("eduDegree", v)} />
          <Text label="Institución" value={f.eduInstitution} onChange={(v) => set("eduInstitution", v)} />
          <LocText label="Periodo" value={f.eduPeriod} onChange={(v) => set("eduPeriod", v)} />
        </div>
      </Panel>

      <Panel title="Contacto / Pie">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LocText label="Rótulo (SYSTEM READY)" value={f.contactEyebrow} onChange={(v) => set("contactEyebrow", v)} />
          <LocText label="Título" value={f.contactTitle} onChange={(v) => set("contactTitle", v)} />
          <LocText label="Párrafo" value={f.contactCopy} onChange={(v) => set("contactCopy", v)} area />
          <LocText label="Texto del pie" value={f.footer} onChange={(v) => set("footer", v)} />
        </div>
      </Panel>

      <SaveBar pending={pending} msg={msg} onSave={() => run(() => saveSite(f))} />
    </div>
  );
}
