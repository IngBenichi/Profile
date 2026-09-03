"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Nav from "@/components/nav";
import type { LandingContent, Lang, Loc } from "@/lib/content";

const HeroObject = dynamic(() => import("@/components/hero-object"), { ssr: false });

const p = (v: Loc, lang: Lang) => v?.[lang] ?? v?.es ?? "";

const UI = {
  es: {
    kicker: "Disponible",
    scroll: "Scroll",
    status: "DISPONIBLE",
    source: "Código",
    demo: "Demo",
    nav: { about: "Sobre mí", stack: "Stack", work: "Proyectos", experience: "Experiencia", contact: "Contacto" },
    sectionLabel: { about: "Sobre mí", stack: "Stack", work: "Proyectos", experience: "Experiencia", contact: "Contacto" },
    domains: ["Backend", "Cloud", "DevOps", "Seguridad", "IA", "APIs"],
  },
  en: {
    kicker: "Available",
    scroll: "Scroll",
    status: "AVAILABLE",
    source: "Source",
    demo: "Live demo",
    nav: { about: "About", stack: "Stack", work: "Work", experience: "Experience", contact: "Contact" },
    sectionLabel: { about: "About", stack: "Stack", work: "Work", experience: "Experience", contact: "Contact" },
    domains: ["Backend", "Cloud", "DevOps", "Security", "AI", "APIs"],
  },
} as const;

const LEVEL_PCT: Record<string, number> = {
  "Básico": 35, Basic: 35, Intermedio: 65, Intermediate: 65, Avanzado: 90, Advanced: 90,
};

const NAV_ORDER = ["about", "stack", "work", "experience", "contact"] as const;
const SEC_NUM: Record<string, string> = { about: "01", stack: "02", work: "03", experience: "04", contact: "05" };

export default function Landing({ content }: { content: LandingContent }) {
  const [lang, setLang] = useState<Lang>("es");
  const [active, setActive] = useState("top");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [webgl, setWebgl] = useState(true);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const objRef = useRef<HTMLDivElement | null>(null);
  const heroTxtRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{ master: GainNode; oscs: { o: OscillatorNode; lfo: OscillatorNode }[] } | null>(null);

  const ui = UI[lang];
  const s = content.site;
  const t = (v: Loc) => p(v, lang);

  /* ---------------------------------------------------------------- setup */
  useEffect(() => {
    setMounted(true);
    const mm = () => setIsMobile(window.innerWidth < 900);
    mm();
    window.addEventListener("resize", mm);
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
    return () => window.removeEventListener("resize", mm);
  }, []);

  /* --------------------------------------------------- scroll spy + reveal */
  useEffect(() => {
    if (!mounted) return;
    const root = rootRef.current;
    if (!root) return;

    const spy = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id || "top")),
      { rootMargin: "-42% 0px -52% 0px" },
    );
    root.querySelectorAll("section[id]").forEach((el) => spy.observe(el));

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let rev: IntersectionObserver | undefined;
    if (!reduce) {
      rev = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.remove("bn-armed");
              e.target.classList.add("bn-in");
              rev!.unobserve(e.target);
            }
          }),
        { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
      );
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top > window.innerHeight * 0.92) {
          el.classList.add("bn-armed");
          rev!.observe(el);
        }
      });
    }

    return () => {
      spy.disconnect();
      rev?.disconnect();
    };
  }, [mounted, lang]);

  /* ------------------------------------------------------------- parallax */
  useEffect(() => {
    if (!mounted) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 900) return;
    let ticking = false;
    const apply = () => {
      const y = window.scrollY;
      if (objRef.current) objRef.current.style.transform = `translate3d(0, ${(y * 0.14).toFixed(1)}px, 0)`;
      if (heroTxtRef.current) heroTxtRef.current.style.transform = `translate3d(0, ${(y * -0.04).toFixed(1)}px, 0)`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  /* -------------------------------------------------------- ambient audio */
  const stopAmbient = useCallback(() => {
    const ctx = audioCtxRef.current;
    const n = audioNodesRef.current;
    if (!ctx || !n) return;
    n.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    window.setTimeout(() => n.oscs.forEach(({ o, lfo }) => { try { o.stop(); lfo.stop(); } catch {} }), 900);
    audioNodesRef.current = null;
  }, []);

  const startAmbient = useCallback(() => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      master.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.6);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 780;
      filter.connect(master);
      const freqs = [110, 164.81, 220];
      const oscs = freqs.map((f, i) => {
        const o = ctx.createOscillator();
        o.type = i === 1 ? "triangle" : "sine";
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = 0.5 / freqs.length;
        o.connect(g);
        g.connect(filter);
        o.start();
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.05 + i * 0.02;
        const lg = ctx.createGain();
        lg.gain.value = 4;
        lfo.connect(lg);
        lg.connect(o.detune);
        lfo.start();
        return { o, lfo };
      });
      audioNodesRef.current = { master, oscs };
    } catch (e) {
      console.warn("audio unavailable", e);
    }
  }, []);

  useEffect(() => () => {
    stopAmbient();
    const ctx = audioCtxRef.current;
    if (ctx) window.setTimeout(() => { try { ctx.close(); } catch {} }, 950);
  }, [stopAmbient]);

  const toggleSound = () => {
    soundOn ? stopAmbient() : startAmbient();
    setSoundOn((v) => !v);
  };

  const goTo = useCallback((id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
  }, []);

  const tiltMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-3px)`;
  };
  const tiltLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "";
  };

  const timeline = useMemo(() => content.timeline.map((x) => ({ year: x.year, text: t(x.text) })), [content.timeline, lang]);
  const [feature, ...restProjects] = content.projects;
  const now = new Date();
  const folioDate = `${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}`;

  return (
    <div className="ed bn-grain" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <Nav lang={lang} onLang={() => setLang((l) => (l === "es" ? "en" : "es"))} soundOn={soundOn} onSound={toggleSound} active={active} onNavigate={goTo} />

      {/* running folio */}
      <aside className="folio" aria-hidden>
        <span className="folio__dot" />
        <span className="folio__b">benichi.dev</span>
        <span>{folioDate}</span>
        <span className="folio__sec">
          {active !== "top" && SEC_NUM[active]
            ? `§ ${SEC_NUM[active]} · ${ui.sectionLabel[active as keyof typeof ui.sectionLabel] ?? ""}`
            : "§ 00 · Index"}
        </span>
        <span className="folio__status">{ui.status}</span>
      </aside>

      {/* ============================================================ hero */}
      <header className="hero" id="top">
        <div className="hero__obj" ref={objRef}>
          <div className="hero__glow" />
          {mounted && webgl && !isMobile && <HeroObject isMobile={isMobile} />}
        </div>
        <div className="hero__scrim" aria-hidden />

        <div className="ed-wrap hero__grid">
          <div className="hero__rail">
            <span className="eyebrow">{folioDate}</span>
            <span className="eyebrow" style={{ color: "var(--bn-accent)" }}>{ui.status}</span>
          </div>
          <div className="hero__body" ref={heroTxtRef}>
            <span className="kicker">
              <span className="kicker__dot" />
              {t(s.heroBadge)}
            </span>
            <p className="hero__role">{s.heroRealName} — {t(s.heroTitle)}</p>
            <h1 className="hero__name">{s.heroName}</h1>
            <p className="hero__lede">{t(s.heroCopy)}</p>
            <div className="hero__meta">
              {ui.domains.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        <span className="hero__scroll">{ui.scroll} ↓</span>
      </header>

      <main>
        {/* ======================================================== about */}
        <section className="sec" id="about">
          <div className="ed-wrap">
            <div className="sec__head">
              <span className="eyebrow"><i>§ {SEC_NUM.about}</i></span>
              <h2 className="sec__title" data-reveal>{t(s.aboutEyebrow)}</h2>
            </div>
            <div className="about__grid">
              <div className="about__text">
                <p className="lede" data-reveal>{t(s.aboutP1)}</p>
                <p className="body" data-reveal>{t(s.aboutP2)}</p>
              </div>
              <div className="tl" data-reveal>
                <span className="eyebrow">{t(s.timelineTitle)}</span>
                <ol>
                  {timeline.map((x, i) => (
                    <li key={i}>
                      <span className="tl__year">{x.year}</span>
                      <span className="tl__text">{x.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== stack */}
        <section className="sec sec--sunk" id="stack">
          <div className="ed-wrap">
            <div className="sec__head">
              <span className="eyebrow"><i>§ {SEC_NUM.stack}</i></span>
              <div>
                <h2 className="sec__title" data-reveal>{t(s.stackEyebrow)}</h2>
                <p className="sec__intro" data-reveal>{t(s.stackIntro)}</p>
              </div>
            </div>

            <div className="hubs">
              {content.hubs.map((h) => (
                <div className="hub" key={h.id} data-reveal>
                  <div className="hub__head">
                    <span className="hub__dot" style={{ background: h.color, boxShadow: `0 0 8px ${h.color}` }} />
                    <span>{t(h.label)}</span>
                  </div>
                  {h.items.map((it) => {
                    const lv = t(it.level);
                    return (
                      <div className="hub__row" key={it.id}>
                        <div className="hub__meta">
                          <span>{it.name}</span>
                          <span>{lv} · {it.years}</span>
                        </div>
                        <div className="hub__bar">
                          <i style={{ width: `${LEVEL_PCT[lv] ?? 60}%`, background: h.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="marquee-wrap" data-reveal>
              <span className="eyebrow">{t(s.credEyebrow)}</span>
              <div className="marquee">
                <div className="marquee__track">
                  {[...content.credentials, ...content.credentials].map((c, i) => (
                    <figure key={i}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.imageUrl} alt={t(c.name)} loading="lazy" decoding="async" />
                      <figcaption>{t(c.name)}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== work */}
        <section className="sec" id="work">
          <div className="ed-wrap">
            <div className="sec__head">
              <span className="eyebrow"><i>§ {SEC_NUM.work}</i></span>
              <div>
                <h2 className="sec__title" data-reveal>{t(s.workEyebrow)}</h2>
                <p className="sec__intro" data-reveal>{t(s.workIntro)}</p>
              </div>
            </div>

            {feature && (
              <a
                className="feature"
                href={feature.demoUrl || feature.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
                onMouseMove={tiltMove}
                onMouseLeave={tiltLeave}
              >
                <div className="feature__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={feature.imageUrl} alt={feature.title} loading="lazy" decoding="async" />
                </div>
                <div className="feature__body">
                  <span className="eyebrow">{feature.code} · {t(feature.role)}</span>
                  <h3>{feature.title}</h3>
                  <p>{t(feature.description)}</p>
                  <div className="tags">
                    {feature.tech.map((x) => <span key={x}>{x}</span>)}
                  </div>
                  <span className="feature__cta">{ui.demo} →</span>
                </div>
              </a>
            )}

            <div className="work__grid">
              {restProjects.map((pr) => (
                <article className="proj" key={pr.id} data-reveal onMouseMove={tiltMove} onMouseLeave={tiltLeave}>
                  <div className="proj__img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pr.imageUrl} alt={pr.title} loading="lazy" decoding="async" />
                  </div>
                  <div className="proj__body">
                    <span className="eyebrow">{pr.code} · {t(pr.role)}</span>
                    <h3>{pr.title}</h3>
                    <p>{t(pr.description)}</p>
                    <div className="tags">{pr.tech.map((x) => <span key={x}>{x}</span>)}</div>
                    <div className="proj__links">
                      <a href={pr.githubUrl} target="_blank" rel="noopener noreferrer">{ui.source} →</a>
                      {pr.demoUrl && <a href={pr.demoUrl} target="_blank" rel="noopener noreferrer">{ui.demo} →</a>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================== experience */}
        <section className="sec sec--sunk" id="experience">
          <div className="ed-wrap">
            <div className="sec__head">
              <span className="eyebrow"><i>§ {SEC_NUM.experience}</i></span>
              <h2 className="sec__title" data-reveal>{t(s.expEyebrow)}</h2>
            </div>

            <div className="xp">
              {content.experiences.map((ex) => (
                <article className="xp__item" key={ex.id} data-reveal>
                  <div className="xp__meta">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ex.logoUrl} alt={ex.company} loading="lazy" decoding="async" />
                    <div>
                      <b>{ex.company}</b>
                      <span>{t(ex.position)}</span>
                    </div>
                    <div className="xp__when">
                      <span>{ex.period}</span>
                      <span>{t(ex.location)}</span>
                    </div>
                  </div>
                  <p className="xp__desc">{t(ex.description)}</p>
                  <ul className="xp__notes">
                    {(ex.achievements[lang] ?? ex.achievements.es ?? []).map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="edu" data-reveal>
              <div>
                <span className="eyebrow">{t(s.eduTitle)}</span>
                <b>{t(s.eduDegree)}</b>
                <span>{s.eduInstitution}</span>
              </div>
              <span className="edu__when">{t(s.eduPeriod)}</span>
            </div>
          </div>
        </section>

        {/* ====================================================== contact */}
        <section className="sec contact" id="contact">
          <div className="ed-wrap">
            <span className="eyebrow" style={{ color: "var(--bn-accent)" }}>{t(s.contactEyebrow)}</span>
            <h2 className="contact__title" data-reveal>{t(s.contactTitle)}</h2>
            <p className="contact__copy" data-reveal>{t(s.contactCopy)}</p>
            <div className="contact__links">
              {content.contactLinks.map((c) => (
                <a key={c.id} href={c.href} target="_blank" rel="noopener noreferrer" data-reveal>
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="ed-wrap">
          <span>© {now.getFullYear()} {s.heroRealName}</span>
          <span>{t(s.footer)}</span>
        </div>
      </footer>
    </div>
  );
}

/* ================================================================== CSS */
const CSS = `
.ed {
  --serif: var(--bn-serif); --sans: var(--bn-sans); --mono: var(--bn-mono);
  position: relative;
  background-color: var(--bn-bg);
  background-image:
    radial-gradient(1200px 640px at 82% -6%, rgba(99,215,162,0.10), transparent 60%),
    radial-gradient(900px 520px at 4% 14%, rgba(231,178,124,0.055), transparent 55%);
  color: var(--bn-text);
  font-family: var(--sans);
  line-height: 1.6;
  overflow-x: hidden;
}
.ed *::selection { background: var(--bn-accent-wash); color: var(--bn-text); }
.ed :where(h1, h2, h3) { font-family: var(--serif); font-weight: 400; margin: 0; letter-spacing: -0.01em; text-wrap: balance; }
.ed :where(p) { margin: 0; }
.ed a { color: inherit; }
.ed :focus-visible { outline: 2px solid var(--bn-accent); outline-offset: 3px; border-radius: 2px; }

.ed-wrap { max-width: var(--bn-maxw); margin-inline: auto; padding-inline: 24px; position: relative; z-index: 2; }

.eyebrow { font-family: var(--mono); font-size: var(--bn-step--1); letter-spacing: 0.13em; text-transform: uppercase; color: var(--bn-faint); }
.eyebrow i { color: var(--bn-signal); font-style: normal; }

.lede { font-family: var(--serif); font-size: var(--bn-step-2); line-height: 1.45; color: var(--bn-text); }
.body { color: var(--bn-dim); margin-top: 16px; max-width: 62ch; }

/* --------------------------------------------------------------- folio */
.folio {
  position: fixed; left: 18px; top: 0; bottom: 0; z-index: 40;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px;
  writing-mode: vertical-rl; text-orientation: mixed;
  font-family: var(--mono); font-size: 0.64rem; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--bn-faint);
}
.folio__dot { width: 5px; height: 5px; border-radius: 50%; background: var(--bn-accent); box-shadow: 0 0 8px var(--bn-accent); }
.folio__b { color: var(--bn-dim); }
.folio__sec { color: var(--bn-signal); }
.folio__status { color: var(--bn-accent); }
@media (max-width: 1200px) { .folio { display: none; } }

/* ---------------------------------------------------------------- hero */
.hero {
  position: relative; min-height: 82vh; display: flex; align-items: center;
  padding: 128px 0 72px; border-bottom: 1px solid var(--bn-line); overflow: hidden;
}
.hero__obj { position: absolute; inset: 4% -10% 0 60%; z-index: 0; opacity: 0.9; will-change: transform; }
.hero__glow {
  position: absolute; inset: 14% 6%; border-radius: 50%;
  background: radial-gradient(circle at 42% 40%, rgba(99,215,162,0.26), rgba(99,215,162,0.04) 55%, transparent 72%);
  filter: blur(38px);
}
.hero__scrim {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background:
    linear-gradient(90deg, var(--bn-bg) 14%, rgba(28,29,34,0.7) 46%, transparent 82%),
    linear-gradient(0deg, var(--bn-bg), transparent 22%);
}
.hero__grid { display: grid; grid-template-columns: var(--bn-rail) minmax(0, 1fr); gap: 0 34px; }
.hero__rail { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--bn-signal); padding-top: 12px; }
.hero__body { position: relative; z-index: 2; max-width: 560px; will-change: transform; }
.kicker {
  display: inline-flex; align-items: center; gap: 9px; white-space: nowrap;
  font-family: var(--mono); font-size: var(--bn-step--1); letter-spacing: 0.05em;
  color: var(--bn-accent); border: 1px solid var(--bn-line); border-radius: 999px; padding: 6px 14px; margin-bottom: 30px;
}
.kicker__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--bn-accent); box-shadow: 0 0 10px var(--bn-accent); }
.hero__name { font-size: clamp(3rem, 8.5vw, 6.6rem); line-height: 1.0; margin-top: 6px; }
.hero__role { font-family: var(--mono); font-size: 0.86rem; letter-spacing: 0.04em; color: var(--bn-faint); }
.hero__lede { font-family: var(--serif); font-size: var(--bn-step-2); line-height: 1.42; color: var(--bn-dim); max-width: 32ch; margin-top: 24px; }
.hero__meta { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 34px; font-family: var(--mono); font-size: var(--bn-step--1); color: var(--bn-faint); }
.hero__meta span::before { content: "· "; color: var(--bn-accent); }
.hero__scroll { position: absolute; right: 28px; bottom: 24px; z-index: 2; font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--bn-faint); }
@media (max-width: 900px) {
  .hero { min-height: 0; padding: 112px 0 48px; }
  .hero__obj, .hero__scrim, .hero__scroll { display: none; }
  .hero__grid { grid-template-columns: 1fr; }
  .hero__rail { flex-direction: row; gap: 18px; border-top: 0; padding-top: 0; margin-bottom: 22px; }
  .hero__name { font-size: clamp(2.6rem, 14vw, 3.8rem); }
  .hero__lede { max-width: none; font-size: var(--bn-step-1); margin-top: 18px; }
}

/* ------------------------------------------------------------- section */
.sec { padding: 104px 0; border-bottom: 1px solid var(--bn-line-soft); }
.sec--sunk { background: var(--bn-bg-sunk); }
.sec__head { display: grid; grid-template-columns: var(--bn-rail) minmax(0, 1fr); gap: 0 34px; margin-bottom: 46px; align-items: start; }
.sec__head > .eyebrow { border-top: 1px solid var(--bn-line); padding-top: 12px; }
.sec__title { font-size: var(--bn-step-3); line-height: 1.08; max-width: 16ch; }
.sec__intro { margin-top: 16px; color: var(--bn-dim); font-size: var(--bn-step-1); max-width: 48ch; }
@media (max-width: 900px) {
  .sec { padding: 72px 0; }
  .sec__head { grid-template-columns: 1fr; gap: 12px; }
  .sec__head > .eyebrow { border-top: 0; padding-top: 0; }
}

/* about */
.about__grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 56px; }
.tl { border-left: 1px solid var(--bn-line); padding-left: 26px; }
.tl ol { list-style: none; margin: 18px 0 0; padding: 0; display: flex; flex-direction: column; gap: 20px; }
.tl li { display: grid; gap: 4px; }
.tl__year { font-family: var(--mono); font-size: var(--bn-step--1); color: var(--bn-accent); }
.tl__text { font-size: 0.95rem; color: var(--bn-dim); line-height: 1.5; }
@media (max-width: 900px) { .about__grid { grid-template-columns: 1fr; gap: 36px; } .tl { border-left: 0; padding-left: 0; } }

/* stack */
.hubs { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1px; background: var(--bn-line-soft); border: 1px solid var(--bn-line-soft); }
.hub { background: var(--bn-bg); padding: 22px; }
.sec--sunk .hub { background: var(--bn-bg-sunk); }
.hub__head { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; font-family: var(--mono); font-size: 0.74rem; letter-spacing: 0.08em; color: var(--bn-text); }
.hub__dot { width: 8px; height: 8px; border-radius: 50%; }
.hub__row { padding: 9px 0; border-top: 1px solid var(--bn-line-soft); }
.hub__meta { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
.hub__meta span:first-child { font-size: 0.92rem; color: var(--bn-text); }
.hub__meta span:last-child { font-family: var(--mono); font-size: 0.66rem; color: var(--bn-faint); }
.hub__bar { height: 3px; border-radius: 2px; background: rgba(255,255,255,0.08); overflow: hidden; }
.hub__bar i { display: block; height: 100%; border-radius: 2px; }

.marquee-wrap { margin-top: 56px; }
.marquee { position: relative; overflow: hidden; margin-top: 16px; -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
.marquee__track { display: flex; gap: 14px; width: max-content; animation: bnMq 34s linear infinite; }
.marquee:hover .marquee__track { animation-play-state: paused; }
@keyframes bnMq { to { transform: translateX(-50%); } }
.marquee figure { flex: 0 0 148px; margin: 0; border: 1px solid var(--bn-line); border-radius: 10px; overflow: hidden; background: var(--bn-surface); }
.marquee img { display: block; width: 100%; aspect-ratio: 4/3; object-fit: cover; }
.marquee figcaption { padding: 8px 10px; font-family: var(--mono); font-size: 0.64rem; color: var(--bn-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
@media (prefers-reduced-motion: reduce) { .marquee__track { animation: none; } }

/* work */
.feature { display: grid; grid-template-columns: 1.15fr 0.85fr; border: 1px solid var(--bn-line); border-radius: 16px; overflow: hidden; background: var(--bn-surface); text-decoration: none; transition: border-color .25s ease, transform .15s ease; }
.feature:hover { border-color: rgba(99,215,162,0.45); }
.feature__img { overflow: hidden; border-right: 1px solid var(--bn-line); }
.feature__img img { display: block; width: 100%; height: 100%; min-height: 260px; object-fit: cover; }
.feature__body { padding: 30px; display: flex; flex-direction: column; gap: 12px; }
.feature__body h3 { font-size: var(--bn-step-3); }
.feature__body p { color: var(--bn-dim); font-size: 0.98rem; }
.feature__cta { font-family: var(--mono); font-size: 0.8rem; color: var(--bn-accent); margin-top: auto; }
.work__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px; margin-top: 18px; }
.proj { border: 1px solid var(--bn-line); border-radius: 14px; overflow: hidden; background: var(--bn-surface); transition: border-color .25s ease, transform .15s ease; }
.proj:hover { border-color: rgba(99,215,162,0.4); }
.proj__img { aspect-ratio: 16/10; overflow: hidden; border-bottom: 1px solid var(--bn-line); }
.proj__img img, .feature__img img { transition: transform .5s ease; }
.proj:hover .proj__img img, .feature:hover .feature__img img { transform: scale(1.05); }
.proj__img img { display: block; width: 100%; height: 100%; object-fit: cover; }
.proj__body { padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.proj__body h3 { font-size: var(--bn-step-1); }
.proj__body p { color: var(--bn-dim); font-size: 0.9rem; line-height: 1.55; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tags span { font-family: var(--mono); font-size: 0.62rem; color: var(--bn-dim); background: rgba(255,255,255,0.05); border: 1px solid var(--bn-line); border-radius: 5px; padding: 3px 7px; }
.proj__links { display: flex; gap: 14px; font-family: var(--mono); font-size: 0.72rem; margin-top: 2px; }
.proj__links a:last-child { color: var(--bn-accent); }
@media (max-width: 760px) { .feature { grid-template-columns: 1fr; } .feature__img { border-right: 0; border-bottom: 1px solid var(--bn-line); } .feature__img img { min-height: 200px; } }

/* experience */
.xp { display: flex; flex-direction: column; gap: 18px; }
.xp__item { border: 1px solid var(--bn-line); border-radius: 14px; padding: 26px; background: var(--bn-bg); }
.sec--sunk .xp__item { background: var(--bn-bg); }
.xp__meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 14px; }
.xp__meta img { width: 40px; height: 40px; border-radius: 9px; object-fit: cover; border: 1px solid var(--bn-line); }
.xp__meta b { font-family: var(--serif); font-size: var(--bn-step-1); font-weight: 400; display: block; }
.xp__meta > div:nth-child(2) span { font-family: var(--mono); font-size: 0.74rem; color: var(--bn-accent); }
.xp__when { margin-left: auto; text-align: right; font-family: var(--mono); font-size: 0.66rem; color: var(--bn-faint); }
.xp__when span { display: block; }
.xp__desc { color: var(--bn-dim); font-size: 0.96rem; line-height: 1.6; margin-bottom: 14px; max-width: 74ch; }
.xp__notes { list-style: none; margin: 0; padding: 0; display: grid; gap: 7px; }
.xp__notes li { font-family: var(--mono); font-size: 0.78rem; color: var(--bn-dim); line-height: 1.5; padding-left: 16px; position: relative; }
.xp__notes li::before { content: "›"; position: absolute; left: 0; color: var(--bn-faint); }
.edu { margin-top: 28px; border: 1px solid var(--bn-line); border-radius: 14px; padding: 22px 26px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; background: var(--bn-bg); }
.edu b { font-family: var(--serif); font-size: var(--bn-step-1); font-weight: 400; display: block; margin: 6px 0 2px; }
.edu > div span:last-child { color: var(--bn-dim); font-size: 0.9rem; }
.edu__when { font-family: var(--mono); font-size: 0.72rem; color: var(--bn-faint); }
@media (max-width: 760px) { .xp__when { margin-left: 0; text-align: left; } }

/* contact */
.contact { text-align: center; }
.contact .ed-wrap { max-width: 680px; }
.contact__title { font-size: clamp(2rem, 5vw, 3.2rem); margin: 16px 0; }
.contact__copy { color: var(--bn-dim); font-size: var(--bn-step-1); line-height: 1.7; margin-bottom: 38px; }
.contact__links { display: flex; flex-direction: column; gap: 11px; align-items: center; }
.contact__links a { font-family: var(--mono); font-size: 0.9rem; color: var(--bn-dim); border: 1px solid var(--bn-line); border-radius: 8px; padding: 12px 22px; width: min(360px, 100%); text-decoration: none; transition: border-color .2s ease, color .2s ease; }
.contact__links a:hover { border-color: var(--bn-accent); color: var(--bn-accent); }

/* footer */
.foot { padding: 40px 0 64px; }
.foot .ed-wrap { display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.72rem; color: var(--bn-faint); flex-wrap: wrap; gap: 8px; }
`;
