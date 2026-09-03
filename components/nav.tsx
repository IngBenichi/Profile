"use client";

import { useEffect, useState } from "react";

type Lang = "es" | "en";

const ITEMS: { id: string; es: string; en: string }[] = [
  { id: "about", es: "Sobre mí", en: "About" },
  { id: "stack", es: "Stack", en: "Stack" },
  { id: "work", es: "Proyectos", en: "Work" },
  { id: "experience", es: "Experiencia", en: "Experience" },
  { id: "contact", es: "Contacto", en: "Contact" },
];

export default function Nav({
  lang,
  onLang,
  soundOn,
  onSound,
  active,
  onNavigate,
}: {
  lang: Lang;
  onLang: () => void;
  soundOn: boolean;
  onSound: () => void;
  active: string;
  onNavigate: (id: string) => void;
}) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <nav className={`bnNav${stuck ? " is-stuck" : ""}`} aria-label="Navegación principal">
        <button className="bnNav__mark" onClick={() => go("top")}>
          <em>benichi</em>
          <b>.dev</b>
        </button>

        <div className="bnNav__links">
          {ITEMS.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(it.id);
              }}
              className={`bnNav__link${active === it.id ? " is-active" : ""}`}
            >
              {lang === "es" ? it.es : it.en}
            </a>
          ))}
        </div>

        <div className="bnNav__tools">
          <button className="bnNav__tool" onClick={onSound} aria-pressed={soundOn} title="Sonido ambiente">
            {soundOn ? "◉" : "◎"}
          </button>
          <button className="bnNav__tool" onClick={onLang}>
            {lang.toUpperCase()}
          </button>
          <button className="bnNav__burger" onClick={() => setOpen((o) => !o)} aria-label="Menú">
            {open ? "✕" : "≡"}
          </button>
        </div>
      </nav>

      {open && (
        <div className="bnNav__sheet">
          {ITEMS.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(it.id);
              }}
            >
              {lang === "es" ? it.es : it.en}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

const CSS = `
.bnNav {
  position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
  z-index: 60; display: flex; align-items: center; gap: 6px;
  padding: 7px 8px 7px 16px;
  border: 1px solid var(--bn-line); border-radius: 999px;
  background: rgba(28, 29, 34, 0.6);
  backdrop-filter: blur(16px) saturate(1.3); -webkit-backdrop-filter: blur(16px) saturate(1.3);
  box-shadow: 0 10px 34px -14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04);
  transition: top .35s cubic-bezier(.2,.8,.2,1), padding .35s cubic-bezier(.2,.8,.2,1), background .35s ease;
  max-width: calc(100vw - 28px);
}
.bnNav.is-stuck { top: 10px; padding-left: 12px; background: rgba(23,24,28,0.82); }
.bnNav__mark {
  font-family: var(--bn-serif); font-size: 1.02rem; background: none; border: 0; cursor: pointer;
  color: var(--bn-text); padding: 0 12px 0 2px; margin-right: 4px;
  border-right: 1px solid var(--bn-line); white-space: nowrap;
}
.bnNav__mark em { font-style: italic; }
.bnNav__mark b { font-weight: 500; }
.bnNav__links { display: flex; gap: 2px; }
.bnNav__link {
  font-family: var(--bn-mono); font-size: .72rem; letter-spacing: .05em; text-transform: uppercase;
  text-decoration: none; color: var(--bn-dim); padding: 8px 12px; border-radius: 999px;
  transition: color .2s ease, background .2s ease; white-space: nowrap;
}
.bnNav__link:hover { color: var(--bn-text); background: rgba(255,255,255,0.05); }
.bnNav__link.is-active { color: var(--bn-bg); background: var(--bn-accent); }
.bnNav__tools { display: flex; align-items: center; gap: 4px; padding-left: 4px; border-left: 1px solid var(--bn-line); }
.bnNav__tool {
  font-family: var(--bn-mono); font-size: .72rem; letter-spacing: .04em;
  color: var(--bn-text); background: rgba(255,255,255,0.04); border: 1px solid var(--bn-line);
  border-radius: 999px; padding: 7px 11px; cursor: pointer; min-width: 34px;
}
.bnNav__tool:hover { border-color: var(--bn-accent); color: var(--bn-accent); }
.bnNav__burger { display: none; font-family: var(--bn-mono); background: none; border: 0; color: var(--bn-text); font-size: 1rem; cursor: pointer; padding: 6px 8px; }
.bnNav__sheet {
  position: fixed; inset: 0; z-index: 55; background: rgba(23,24,28,0.97);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px;
}
.bnNav__sheet a { font-family: var(--bn-serif); font-size: 1.9rem; color: var(--bn-text); text-decoration: none; }
@media (max-width: 760px) {
  .bnNav__links { display: none; }
  .bnNav__burger { display: block; }
}
@media (prefers-reduced-motion: reduce) { .bnNav { transition: none; } }
`;
