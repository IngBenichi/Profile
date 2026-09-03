"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { OrbitNodeKey } from "@/components/hero-orbit";

const HeroOrbit = dynamic(() => import("@/components/hero-orbit"), { ssr: false });

/* ------------------------------------------------------------------ fonts */
const SG = "var(--font-space-grotesk), 'Space Grotesk', sans-serif";
const MONO = "var(--font-jetbrains-mono), 'JetBrains Mono', monospace";
const BODY = "var(--font-inter), 'Inter', sans-serif";

/* ------------------------------------------------------------------- data */
type Lang = "es" | "en";
type Localized = { es: string; en: string };
const L = (v: string | Localized, lang: Lang) => (typeof v === "string" ? v : v[lang]);

const DATA = {
  timeline: [
    { year: "2023", es: "Inicia Ingeniería de Sistemas — Universidad de la Costa (CUC)", en: "Starts Systems Engineering — Universidad de la Costa (CUC)" },
    { year: "2024", es: "Cofunda ARC4M como Software Engineer", en: "Co-founds ARC4M as Software Engineer" },
    { year: "2024", es: "Backend Developer Junior en Domotes S.A.S.", en: "Backend Developer Junior at Domotes S.A.S." },
    { year: "2024–26", es: "Certificaciones en Django, Docker, FastAPI, Laravel, DevOps, IA, OAuth, OWASP", en: "Certifications in Django, Docker, FastAPI, Laravel, DevOps, AI, OAuth, OWASP" },
    { year: "NOW", es: "Construyendo sistemas backend reales", en: "Building real backend systems" },
  ],
  hubs: [
    { key: "lang", color: "oklch(0.75 0.14 150)", label: { es: "LENGUAJES", en: "LANGUAGES" }, items: [
      { name: "Python", years: "5+", level: { es: "Avanzado", en: "Advanced" } },
      { name: "JavaScript", years: "3+", level: { es: "Intermedio", en: "Intermediate" } },
      { name: "PHP", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
    ] },
    { key: "fw", color: "oklch(0.74 0.14 300)", label: { es: "FRAMEWORKS", en: "FRAMEWORKS" }, items: [
      { name: "Node.js", years: "4+", level: { es: "Avanzado", en: "Advanced" } },
      { name: "Express", years: "4+", level: { es: "Avanzado", en: "Advanced" } },
      { name: "Django", years: "3+", level: { es: "Avanzado", en: "Advanced" } },
      { name: "Flask", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
      { name: "FastAPI", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
      { name: "Laravel", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
    ] },
    { key: "db", color: "oklch(0.78 0.12 200)", label: { es: "BASES DE DATOS", en: "DATABASES" }, items: [
      { name: "PostgreSQL", years: "3+", level: { es: "Avanzado", en: "Advanced" } },
      { name: "MySQL", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
      { name: "SQLite", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
    ] },
    { key: "tools", color: "oklch(0.72 0.14 250)", label: { es: "HERRAMIENTAS", en: "TOOLS" }, items: [
      { name: "Docker", years: "3+", level: { es: "Avanzado", en: "Advanced" } },
      { name: "Azure DevOps", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
      { name: "AWS", years: "1", level: { es: "Básico", en: "Basic" } },
      { name: "Git", years: "5+", level: { es: "Avanzado", en: "Advanced" } },
    ] },
  ],
  credentials: [
    { img: "/django.png", name: "Django" },
    { img: "/django_rest.png", name: "Django REST" },
    { img: "/laravel.png", name: "Laravel" },
    { img: "/laravel_rest.png", name: "Laravel REST" },
    { img: "/docker.png", name: "Docker" },
    { img: "/fastapi.png", name: "FastAPI" },
    { img: "/devops.png", name: "DevOps" },
    { img: "/ia.png", name: { es: "Inteligencia Artificial", en: "Artificial Intelligence" } },
    { img: "/oauth.png", name: "OAuth" },
    { img: "/owasp.png", name: "OWASP" },
  ] as { img: string; name: string | Localized }[],
  projects: [
    { code: "SYS-01", title: "Benichi's Blog", role: { es: "Desarrollador Backend Líder", en: "Lead Backend Developer" }, desc: { es: "Plataforma de blog personal enfocada en rendimiento y SEO, usando renderizado del lado del servidor y generación de sitios estáticos.", en: "Personal blog platform focused on performance and SEO, using server-side rendering and static site generation." }, tech: ["Django", "PostgreSQL", "Google Cloud", "Docker"], github: "https://github.com/IngBenichi/Blog-Benichi", demo: "https://my-blog-app-django.onrender.com/", image: "/blog.png" },
    { code: "SYS-02", title: "YTMediaConverter", role: { es: "Ingeniero Backend", en: "Backend Engineer" }, desc: { es: "Aplicación para descargar y convertir videos de YouTube en MP3 o MP4, con interfaz gráfica intuitiva y barra de progreso en tiempo real.", en: "App to download and convert YouTube videos to MP3 or MP4, with an intuitive GUI and real-time progress bar." }, tech: ["Python"], github: "https://github.com/IngBenichi/YTMediaConverter", demo: null as string | null, image: "/yt.JPG" },
    { code: "SYS-03", title: "Crypto Dashboard", role: { es: "Desarrollador Frontend", en: "Frontend Developer" }, desc: { es: "Dashboard interactivo para visualizar datos de criptomonedas en tiempo real con gráficos y estadísticas detalladas.", en: "Interactive dashboard for real-time cryptocurrency data with charts and detailed stats." }, tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"], github: "https://github.com/IngBenichi/crypto-dashboard", demo: "https://v0-crypto-dashboard-mu-tawny.vercel.app/", image: "/crypto.png" },
    { code: "SYS-04", title: "Auction Product Page", role: { es: "Desarrollador Frontend", en: "Frontend Developer" }, desc: { es: "Página de producto de subasta con diseño moderno y funcionalidades interactivas para una experiencia de usuario optimizada.", en: "Auction product page with modern design and interactive features for an optimized user experience." }, tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"], github: "https://github.com/IngBenichi/auction-product-page", demo: "https://v0-auction-product-page.vercel.app/", image: "/auction.png" },
    { code: "SYS-05", title: "Benichi Dev Studio", role: { es: "Desarrollador Frontend", en: "Frontend Developer" }, desc: { es: "Landing page profesional para estudio de desarrollo, con diseño moderno y secciones informativas sobre servicios y proyectos.", en: "Professional landing page for a dev studio, with modern design and informative service/project sections." }, tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"], github: "https://github.com/IngBenichi/benichi-dev-studio-landing-page", demo: "https://v0-benichi-dev-studio-landing-page.vercel.app/", image: "/benichi-dev.png" },
    { code: "SYS-06", title: "Battle Zone Landing", role: { es: "Desarrollador Frontend", en: "Frontend Developer" }, desc: { es: "Landing page temática para zona de batalla, con diseño impactante y elementos visuales dinámicos.", en: "Themed battle-zone landing page with bold design and dynamic visual elements." }, tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"], github: "https://github.com/IngBenichi/battle-zone-landing-page", demo: "https://v0-battle-zone-landing-page.vercel.app/", image: "/battle.png" },
  ],
  experiences: [
    { company: "Domotes S.A.S", logo: "/domotes_ltda_logo.jpeg", position: { es: "Backend Developer Junior", en: "Backend Developer Junior" }, period: "Dec 2024 — Present", location: { es: "Barranquilla, Colombia · Presencial", en: "Barranquilla, Colombia · On-site" }, desc: { es: "Desarrollo y mantengo sistemas backend escalables utilizando Laravel y microservicios basados en Python, siguiendo buenas prácticas y patrones arquitectónicos para asegurar mantenibilidad y rendimiento.", en: "I develop and maintain scalable backend systems using Laravel and Python-based microservices, following best practices and architectural patterns for maintainability and performance." }, achievements: { es: [
      "Desarrollé y mantuve sistemas backend escalables usando Laravel y microservicios en Python",
      "Construí y gestioné pipelines de CI/CD aprovechando Microsoft Azure",
      "Trabajé con contenedores Docker para crear entornos consistentes y optimizar despliegues",
      "Administré y optimicé bases de datos, asegurando alto rendimiento y confiabilidad",
      "Diseñé e implementé APIs RESTful siguiendo las mejores prácticas",
      "Contribuí a mantener una arquitectura de sistema robusta, escalable y de alta calidad",
    ], en: [
      "Developed and maintained scalable backend systems using Laravel and Python microservices",
      "Built and managed CI/CD pipelines leveraging Microsoft Azure",
      "Worked with Docker containers to create consistent environments and optimize deployments",
      "Managed and optimized databases, ensuring high performance and reliability",
      "Designed and implemented RESTful APIs following best practices",
      "Contributed to maintaining a robust, scalable, high-quality system architecture",
    ] } },
    { company: "ARC4M", logo: "/arc4m_logo.jpeg", position: { es: "Co-Fundador & Software Engineer", en: "Co-Founder & Software Engineer" }, period: "Jan 2024 — Present", location: { es: "Barranquilla, Colombia · Remoto", en: "Barranquilla, Colombia · Remote" }, desc: { es: "Como cofundador y software engineer, lidero el desarrollo de soluciones tecnológicas, participando en decisiones estratégicas y en la implementación de arquitecturas robustas para nuestros productos.", en: "As co-founder and software engineer, I lead the development of technology solutions, taking part in strategic decisions and implementing robust architectures for our products." }, achievements: { es: [
      "Cofundé la empresa y participé en la definición de la visión tecnológica",
      "Diseñé e implementé arquitecturas escalables para productos SaaS",
      "Lideré equipos de desarrollo en proyectos de software a medida",
      "Implementé prácticas de DevOps y despliegue continuo",
      "Colaboré con clientes para entender y resolver necesidades técnicas complejas",
    ], en: [
      "Co-founded the company and helped shape its technology vision",
      "Designed and implemented scalable architectures for SaaS products",
      "Led development teams on custom software projects",
      "Implemented DevOps practices and continuous deployment",
      "Collaborated with clients to understand and solve complex technical needs",
    ] } },
  ],
};

const I18N = {
  es: {
    nav: { home: "INDEX", about: "SOBRE MÍ", stack: "STACK", work: "TRABAJO", experience: "EXPERIENCIA", contact: "CONTACTO" },
    heroBadge: "Disponible para nuevas oportunidades",
    heroTitle: "Ingeniero de Software Backend",
    heroCopy: "Estudiante de Ingeniería de Sistemas construyendo APIs, microservicios e infraestructura — con la mira puesta en IA, cloud y ciberseguridad.",
    ctaWork: "Ver trabajo", ctaContact: "Contactar", scroll: "SCROLL",
    systemPanelTitle: "BENICHI://SYSTEM", systemStatus: "ONLINE",
    domains: { backend: "Backend", cloud: "Cloud", devops: "DevOps", security: "Seguridad", ai: "IA", apis: "APIs" },
    aboutNum: "01", aboutEyebrow: "Sobre mí",
    aboutP1: "Soy Ingeniero de Software Backend con una profunda pasión por resolver problemas complejos a través de APIs robustas, arquitecturas de microservicios y soluciones escalables en la nube.",
    aboutP2: "Aprendo constantemente — proyectos open-source, hackathons, equipos multidisciplinarios. Hoy me enfoco en construir sistemas backend reales, y en llevarlos hacia IA, cloud y ciberseguridad.",
    timelineTitle: "LÍNEA DE TIEMPO",
    stackNum: "02", stackEyebrow: "Stack tecnológico",
    stackIntro: "Backend moderno, bases de datos relacionales y herramientas DevOps — el sistema con el que construyo.",
    credEyebrow: "CREDENCIALES",
    workNum: "03", workEyebrow: "Proyectos", workIntro: "Seis sistemas reales que he construido y desplegado.",
    source: "Código", demo: "Demo",
    expNum: "04", expEyebrow: "Experiencia",
    eduTitle: "EDUCACIÓN", eduDegree: "Ingeniería en Sistemas", eduInst: "Universidad de la Costa (CUC)", eduPeriod: "Feb 2023 – Dic 2027 · En curso",
    contactEyebrow: "SYSTEM READY", contactTitle: "¿Tienes un proyecto en mente?",
    contactCopy: "Actualmente estoy abierto a nuevas oportunidades donde pueda aportar valor construyendo sistemas backend robustos. Si buscas a alguien comprometido y orientado a resultados, ¡hablemos!",
    footer: "Ingeniero de Software Backend",
    boot: ["INICIANDO SISTEMA BENICHI...", "CARGANDO NÚCLEO...", "CARGANDO RED...", "CARGANDO IA...", "CARGANDO PROYECTOS...", "SISTEMA EN LÍNEA"],
    skip: "CLIC PARA SALTAR",
  },
  en: {
    nav: { home: "INDEX", about: "ABOUT", stack: "STACK", work: "WORK", experience: "EXPERIENCE", contact: "CONTACT" },
    heroBadge: "Open to new opportunities",
    heroTitle: "Backend Software Engineer",
    heroCopy: "Systems Engineering student building APIs, microservices and infrastructure — with sights set on AI, cloud and cybersecurity.",
    ctaWork: "View work", ctaContact: "Get in touch", scroll: "SCROLL",
    systemPanelTitle: "BENICHI://SYSTEM", systemStatus: "ONLINE",
    domains: { backend: "Backend", cloud: "Cloud", devops: "DevOps", security: "Security", ai: "AI", apis: "APIs" },
    aboutNum: "01", aboutEyebrow: "About me",
    aboutP1: "I'm a Backend Software Engineer with a deep passion for solving complex problems through robust APIs, microservices architectures and scalable cloud solutions.",
    aboutP2: "I learn constantly — open-source projects, hackathons, cross-functional teams. Today I'm focused on building real backend systems, and pushing further into AI, cloud and cybersecurity.",
    timelineTitle: "TIMELINE",
    stackNum: "02", stackEyebrow: "Technology stack",
    stackIntro: "Modern backend, relational databases and DevOps tooling — the system I build with.",
    credEyebrow: "CREDENTIALS",
    workNum: "03", workEyebrow: "Work", workIntro: "Six real systems I've built and shipped.",
    source: "Source", demo: "Live demo",
    expNum: "04", expEyebrow: "Experience",
    eduTitle: "EDUCATION", eduDegree: "Systems Engineering", eduInst: "Universidad de la Costa (CUC)", eduPeriod: "Feb 2023 – Dec 2027 · In progress",
    contactEyebrow: "SYSTEM READY", contactTitle: "Have a project in mind?",
    contactCopy: "I'm currently open to new opportunities where I can add value building robust backend systems. If you're looking for someone committed and results-driven, let's talk!",
    footer: "Backend Software Engineer",
    boot: ["INITIALIZING BENICHI SYSTEM...", "LOADING CORE...", "LOADING NETWORK...", "LOADING AI...", "LOADING PROJECTS...", "SYSTEM ONLINE"],
    skip: "CLICK TO SKIP",
  },
} as const;

const DOMAIN_DEFS: { key: OrbitNodeKey; color: string }[] = [
  { key: "backend", color: "oklch(0.75 0.14 150)" },
  { key: "cloud", color: "oklch(0.72 0.14 250)" },
  { key: "devops", color: "oklch(0.78 0.12 200)" },
  { key: "security", color: "oklch(0.7 0.16 25)" },
  { key: "ai", color: "oklch(0.74 0.14 300)" },
  { key: "apis", color: "oklch(0.85 0.006 250)" },
];

const LEVEL_PCT: Record<string, number> = {
  "Básico": 35, Basic: 35, Intermedio: 65, Intermediate: 65, Avanzado: 90, Advanced: 90,
};

const NAV_ORDER = ["home", "about", "stack", "work", "experience", "contact"] as const;

const CONTACT_LINKS = [
  { cmd: "$ open mailto:djangobenichi@gmail.com", href: "mailto:djangobenichi@gmail.com" },
  { cmd: "$ open github.com/IngBenichi", href: "https://github.com/IngBenichi" },
  { cmd: "$ open linkedin.com/in/benichidev", href: "https://www.linkedin.com/in/benichidev" },
];

const BASE_CSS = `
@keyframes bnBoot { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bnPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
@keyframes bnBounce { 0%, 100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(8px); opacity: 1; } }
@keyframes bnSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes bnMarqueeL { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes bnDrift { 0%, 100% { transform: translate(-8%,-8%) scale(1); } 50% { transform: translate(6%,8%) scale(1.18); } }
.bn-root [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
.bn-root ::selection { background: oklch(0.75 0.14 150 / 0.35); color: oklch(0.98 0 0); }
.bn-marquee:hover { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .bn-root *, .bn-root *::before, .bn-root *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}
`;

/* ------------------------------------------------------------- component */
export default function Home() {
  const [lang, setLang] = useState<Lang>("es");
  const [booted, setBooted] = useState(false);
  const [bootRendered, setBootRendered] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const labelEls = useRef<Partial<Record<OrbitNodeKey, HTMLElement | null>>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{ master: GainNode; oscs: { o: OscillatorNode; lfo: OscillatorNode }[] } | null>(null);

  const t = I18N[lang];

  const finishBoot = useCallback(() => {
    setBooted(true);
    window.setTimeout(() => setBootRendered(false), 700);
  }, []);

  /* setup */
  useEffect(() => {
    setMounted(true);
    const rm = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 860;
    const cursor = !rm && !!window.matchMedia?.("(pointer: fine)").matches;
    setReducedMotion(rm);
    setIsMobile(mobile);
    setShowCursor(cursor);

    const onResize = () => setIsMobile(window.innerWidth < 860);
    window.addEventListener("resize", onResize);

    let onCursorMove: ((e: MouseEvent) => void) | undefined;
    if (cursor) {
      onCursorMove = (e) => {
        if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      };
      window.addEventListener("mousemove", onCursorMove);
    }

    const bootTimer = window.setTimeout(finishBoot, rm ? 300 : 2300);

    return () => {
      window.clearTimeout(bootTimer);
      window.removeEventListener("resize", onResize);
      if (onCursorMove) window.removeEventListener("mousemove", onCursorMove);
    };
  }, [finishBoot]);

  /* scroll spy + reveal + progress bars */
  useEffect(() => {
    if (!mounted) return;
    const root = rootRef.current;
    if (!root) return;

    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.getAttribute("data-section") || "home")),
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    root.querySelectorAll("[data-section]").forEach((s) => spy.observe(s));

    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "none";
          reveal.unobserve(e.target);
        }
      }),
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));

    const bars = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.width = e.target.getAttribute("data-target") + "%";
          bars.unobserve(e.target);
        }
      }),
      { threshold: 0.4 },
    );
    root.querySelectorAll("[data-bar]").forEach((el) => bars.observe(el));

    return () => {
      spy.disconnect();
      reveal.disconnect();
      bars.disconnect();
    };
  }, [mounted, lang]);

  /* ambient audio */
  const stopAmbient = useCallback(() => {
    const ctx = audioCtxRef.current;
    const nodes = audioNodesRef.current;
    if (!ctx || !nodes) return;
    nodes.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    window.setTimeout(() => nodes.oscs.forEach(({ o, lfo }) => { try { o.stop(); lfo.stop(); } catch {} }), 900);
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
      master.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 1.6);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;
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
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 4;
        lfo.connect(lfoGain);
        lfoGain.connect(o.detune);
        lfo.start();
        return { o, lfo };
      });
      audioNodesRef.current = { master, oscs };
    } catch (e) {
      console.warn("audio unavailable", e);
    }
  }, []);

  const playTick = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!soundOn || !ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    o.stop(ctx.currentTime + 0.2);
  }, [soundOn]);

  useEffect(() => () => {
    stopAmbient();
    const ctx = audioCtxRef.current;
    if (ctx) window.setTimeout(() => { try { ctx.close(); } catch {} }, 950);
  }, [stopAmbient]);

  const toggleSound = () => {
    if (soundOn) stopAmbient();
    else startAmbient();
    setSoundOn((s) => !s);
  };

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 64;
    window.scrollTo({ top: y, behavior: "smooth" });
    setMobileNavOpen(false);
    playTick();
  }, [playTick]);

  const magnetMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.3}px)`;
  };
  const magnetLeave = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = "translate(0,0)"; };

  const tiltMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-4px)`;
    el.style.boxShadow = "0 24px 44px -22px oklch(0.75 0.14 150 / 0.4)";
  };
  const tiltLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "none";
  };

  const heroFallback = reducedMotion;
  const eyebrowNum: React.CSSProperties = { fontFamily: MONO, fontSize: 12, color: "oklch(0.5 0.01 250)", border: "1px solid oklch(1 0 0 / 0.16)", borderRadius: 6, padding: "4px 9px" };
  const dashedDot = (c: string): React.CSSProperties => ({ width: 20, height: 20, borderRadius: "50%", border: `1.5px dashed ${c}`, position: "relative", display: "inline-block", animation: "bnSpin 12s linear infinite" });

  const timeline = useMemo(() => DATA.timeline.map((tl) => ({ year: tl.year, text: tl[lang] })), [lang]);

  return (
    <div
      ref={rootRef}
      className="bn-root"
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        background: "oklch(0.15 0.006 250)",
        backgroundImage:
          "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        color: "oklch(0.96 0.003 250)",
        fontFamily: BODY,
        overflowX: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS }} />

      {/* boot overlay */}
      {bootRendered && (
        <div
          onClick={() => !booted && finishBoot()}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "oklch(0.11 0.005 250)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            opacity: booted ? 0 : 1,
            pointerEvents: booted ? "none" : "auto",
            transition: "opacity 0.6s ease",
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: "0.08em", color: "oklch(0.75 0.14 150)", display: "flex", flexDirection: "column", gap: 10, textAlign: "center" }}>
            {t.boot.map((line, i) => (
              <div key={i} style={{ animation: "bnBoot 0.4s ease forwards", animationDelay: `${(i * 0.32).toFixed(2)}s`, opacity: 0 }}>
                {line}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", bottom: 36, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", color: "oklch(0.5 0.01 250)" }}>
            {t.skip}
          </div>
        </div>
      )}

      {/* custom cursor */}
      {showCursor && (
        <div
          ref={cursorRef}
          style={{ position: "fixed", top: 0, left: 0, width: 18, height: 18, marginLeft: -9, marginTop: -9, borderRadius: "50%", border: "1px solid oklch(0.96 0.003 250 / 0.6)", pointerEvents: "none", zIndex: 9000, willChange: "transform", transition: "opacity 0.2s" }}
        />
      )}

      {/* header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", background: "oklch(0.15 0.006 250 / 0.72)", backdropFilter: "blur(14px)", borderBottom: "1px solid oklch(1 0 0 / 0.08)" }}>
        <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 15, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "oklch(0.75 0.14 150)", boxShadow: "0 0 8px oklch(0.75 0.14 150 / 0.8)", animation: "bnPulse 2.4s ease infinite", display: "inline-block" }} />
          BENICHI
        </div>

        {isMobile ? (
          <button onClick={() => setMobileNavOpen((s) => !s)} style={{ background: "none", border: "1px solid oklch(1 0 0 / 0.16)", borderRadius: 8, width: 36, height: 32, color: "oklch(0.96 0.003 250)", fontFamily: MONO, cursor: "pointer" }}>
            {mobileNavOpen ? "✕" : "≡"}
          </button>
        ) : (
          <nav style={{ display: "flex", alignItems: "center", gap: 26 }}>
            {NAV_ORDER.map((id) => {
              const active = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => { e.preventDefault(); scrollTo(id); }}
                  onMouseMove={magnetMove}
                  onMouseLeave={magnetLeave}
                  style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.06em", color: active ? "oklch(0.96 0.003 250)" : "oklch(0.55 0.01 250)", fontWeight: active ? 600 : 400, textDecoration: "none", cursor: "pointer" }}
                >
                  {t.nav[id]}
                </a>
              );
            })}
            <button onClick={toggleSound} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", color: "oklch(0.96 0.003 250)", background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.16)", borderRadius: 999, padding: "6px 13px", cursor: "pointer" }}>
              {soundOn ? "SND: ON" : "SND: OFF"}
            </button>
            <button onClick={() => setLang((l) => (l === "es" ? "en" : "es"))} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", color: "oklch(0.96 0.003 250)", background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.16)", borderRadius: 999, padding: "6px 13px", cursor: "pointer" }}>
              {lang.toUpperCase()}
            </button>
          </nav>
        )}
      </header>

      {mobileNavOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 190, background: "oklch(0.15 0.006 250 / 0.98)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
          {NAV_ORDER.map((id) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }} style={{ fontFamily: SG, fontSize: 26, fontWeight: 600, color: "oklch(0.96 0.003 250)", textDecoration: "none" }}>
              {t.nav[id]}
            </a>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button onClick={toggleSound} style={{ fontFamily: MONO, fontSize: 12, color: "oklch(0.96 0.003 250)", background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.16)", borderRadius: 999, padding: "8px 18px" }}>
              {soundOn ? "SND: ON" : "SND: OFF"}
            </button>
            <button onClick={() => setLang((l) => (l === "es" ? "en" : "es"))} style={{ fontFamily: MONO, fontSize: 12, color: "oklch(0.96 0.003 250)", background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.16)", borderRadius: 999, padding: "8px 18px" }}>
              {lang.toUpperCase()}
            </button>
          </div>
        </div>
      )}

      {/* hero */}
      <section id="home" data-section="home" style={{ position: "relative", height: "100vh", minHeight: 640, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderBottom: "1px solid oklch(1 0 0 / 0.06)" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {mounted && !heroFallback && <HeroOrbit labelEls={labelEls.current} isMobile={isMobile} />}
          {heroFallback && (
            <div style={{ position: "absolute", top: "50%", left: "50%", width: 520, height: 520, margin: "-260px 0 0 -260px", borderRadius: "50%", border: "1px solid oklch(1 0 0 / 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "70%", height: "70%", borderRadius: "50%", border: "1px dashed oklch(0.75 0.14 150 / 0.4)" }} />
            </div>
          )}
          {!heroFallback && DOMAIN_DEFS.map((d) => (
            <div
              key={d.key}
              ref={(el) => { labelEls.current[d.key] = el; }}
              style={{ position: "absolute", top: 0, left: 0, display: "flex", alignItems: "center", gap: 6, fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", color: "oklch(0.9 0.005 250)", whiteSpace: "nowrap", opacity: 0, willChange: "transform" }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: d.color }} />
              {t.domains[d.key]}
            </div>
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px", maxWidth: 760 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid oklch(1 0 0 / 0.18)", borderRadius: 999, padding: "7px 16px", fontFamily: MONO, fontSize: 11, letterSpacing: "0.05em", color: "oklch(0.75 0.14 150)", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "oklch(0.75 0.14 150)", animation: "bnPulse 2s ease infinite", display: "inline-block" }} />
            {t.heroBadge}
          </div>
          <h1 style={{ fontFamily: SG, fontWeight: 700, fontSize: "clamp(48px,10vw,108px)", lineHeight: 0.95, letterSpacing: "-0.02em", margin: 0, color: "oklch(0.97 0.003 250)" }}>BENICHI</h1>
          <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: "0.08em", color: "oklch(0.5 0.01 250)", marginTop: 14 }}>Camilo Benítez — {t.heroTitle}</div>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "oklch(0.68 0.012 250)", marginTop: 22, maxWidth: 560 }}>{t.heroCopy}</p>
          <div style={{ display: "flex", gap: 14, marginTop: 34, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => scrollTo("work")} onMouseMove={magnetMove} onMouseLeave={magnetLeave} style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, background: "oklch(0.96 0.003 250)", color: "oklch(0.15 0.006 250)", border: "none", borderRadius: 8, padding: "13px 24px", cursor: "pointer" }}>{t.ctaWork}</button>
            <button onClick={() => scrollTo("contact")} onMouseMove={magnetMove} onMouseLeave={magnetLeave} style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, background: "transparent", color: "oklch(0.96 0.003 250)", border: "1px solid oklch(1 0 0 / 0.24)", borderRadius: 8, padding: "13px 24px", cursor: "pointer" }}>{t.ctaContact}</button>
          </div>
        </div>

        <div style={{ position: "absolute", left: 28, bottom: 28, zIndex: 2, fontFamily: MONO, fontSize: 10, color: "oklch(0.55 0.01 250)", background: "oklch(0.18 0.007 250 / 0.7)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 10, padding: "14px 16px", minWidth: 150, backdropFilter: "blur(8px)" }} className="bn-syspanel">
          <div style={{ letterSpacing: "0.08em", color: "oklch(0.85 0.005 250)", marginBottom: 8, fontWeight: 600 }}>{t.systemPanelTitle}</div>
          {DOMAIN_DEFS.map((d) => (
            <div key={d.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "2.5px 0" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: d.color }} />
                {t.domains[d.key]}
              </span>
              <span style={{ color: "oklch(0.75 0.14 150)" }}>{t.systemStatus}</span>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", right: 28, bottom: 28, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 10, letterSpacing: "0.15em", color: "oklch(0.55 0.01 250)" }}>
          <span style={{ writingMode: "vertical-rl" }}>{t.scroll}</span>
          <span style={{ width: 1, height: 30, background: "oklch(1 0 0 / 0.25)", display: "inline-block", animation: "bnBounce 1.8s ease infinite" }} />
        </div>
      </section>

      {/* about */}
      <section id="about" data-section="about" style={{ padding: "120px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-15%", left: "-10%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, oklch(0.75 0.14 150 / 0.14), transparent 70%)", filter: "blur(40px)", pointerEvents: "none", animation: "bnDrift 24s ease-in-out infinite", zIndex: 0 }} />
        <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
            <span style={eyebrowNum}>{t.aboutNum}</span>
            <h2 style={{ fontFamily: SG, fontSize: 32, fontWeight: 600, margin: 0 }}>{t.aboutEyebrow}</h2>
            <span style={dashedDot("oklch(0.75 0.14 150 / 0.5)")}>
              <span style={{ position: "absolute", top: -2, left: "50%", width: 4, height: 4, marginLeft: -2, borderRadius: "50%", background: "oklch(0.75 0.14 150)" }} />
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))", gap: 56 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <p data-reveal style={{ fontSize: 17, lineHeight: 1.7, color: "oklch(0.75 0.012 250)", margin: 0 }}>{t.aboutP1}</p>
              <p data-reveal style={{ fontSize: 17, lineHeight: 1.7, color: "oklch(0.75 0.012 250)", margin: 0, transitionDelay: "0.1s" }}>{t.aboutP2}</p>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", color: "oklch(0.5 0.01 250)", marginBottom: 20 }}>{t.timelineTitle}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {timeline.map((tl, i) => (
                  <div key={i} data-reveal style={{ display: "flex", gap: 16, paddingBottom: 22, position: "relative", transitionDelay: `${i * 90}ms` }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ width: 9, height: 9, borderRadius: "50%", background: "oklch(0.75 0.14 150)", flexShrink: 0 }} />
                      <span style={{ width: 1, flex: 1, background: "oklch(1 0 0 / 0.14)", marginTop: 4 }} />
                    </div>
                    <div style={{ paddingBottom: 4 }}>
                      <div style={{ fontFamily: MONO, fontSize: 11, color: "oklch(0.75 0.14 150)", marginBottom: 4 }}>{tl.year}</div>
                      <div style={{ fontSize: 15, color: "oklch(0.9 0.005 250)", lineHeight: 1.5 }}>{tl.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* stack */}
      <section id="stack" data-section="stack" style={{ padding: "120px 32px", background: "oklch(0.13 0.006 250)", borderTop: "1px solid oklch(1 0 0 / 0.06)", borderBottom: "1px solid oklch(1 0 0 / 0.06)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, oklch(0.72 0.14 250 / 0.13), transparent 70%)", filter: "blur(44px)", pointerEvents: "none", animation: "bnDrift 28s ease-in-out infinite reverse", zIndex: 0 }} />
        <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <span style={eyebrowNum}>{t.stackNum}</span>
            <h2 style={{ fontFamily: SG, fontSize: 32, fontWeight: 600, margin: 0 }}>{t.stackEyebrow}</h2>
            <span style={dashedDot("oklch(0.72 0.14 250 / 0.5)")}>
              <span style={{ position: "absolute", top: -2, left: "50%", width: 4, height: 4, marginLeft: -2, borderRadius: "50%", background: "oklch(0.72 0.14 250)" }} />
            </span>
          </div>
          <p style={{ fontSize: 16, color: "oklch(0.6 0.012 250)", maxWidth: 560, margin: "0 0 56px 46px" }}>{t.stackIntro}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 20 }}>
            {DATA.hubs.map((hub, hi) => (
              <div key={hub.key} data-reveal style={{ border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 14, padding: 22, background: "oklch(0.16 0.006 250 / 0.6)", transitionDelay: `${hi * 100}ms` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: hub.color, boxShadow: `0 0 8px ${hub.color}` }} />
                  <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.08em", color: "oklch(0.85 0.005 250)" }}>{hub.label[lang]}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {hub.items.map((it) => {
                    const level = it.level[lang];
                    const pct = LEVEL_PCT[level] ?? 60;
                    return (
                      <div key={it.name} style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 9, borderBottom: "1px solid oklch(1 0 0 / 0.06)" }}>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 14.5, color: "oklch(0.94 0.003 250)", fontWeight: 500 }}>{it.name}</span>
                          <span style={{ fontFamily: MONO, fontSize: 10.5, color: "oklch(0.55 0.01 250)", textAlign: "right" }}>{level} · {it.years}</span>
                        </div>
                        <div style={{ width: "100%", height: 3, borderRadius: 2, background: "oklch(1 0 0 / 0.08)", overflow: "hidden" }}>
                          <div data-bar data-target={pct} style={{ height: "100%", width: "0%", borderRadius: 2, background: hub.color, transition: "width 1.1s cubic-bezier(0.16,1,0.3,1)" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 64 }}>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", color: "oklch(0.5 0.01 250)", marginBottom: 20 }}>{t.credEyebrow}</div>
            <div style={{ position: "relative", overflow: "hidden", WebkitMaskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)", maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)" }}>
              <div className="bn-marquee" style={{ display: "flex", gap: 14, width: "max-content", animation: "bnMarqueeL 32s linear infinite" }}>
                {[...DATA.credentials, ...DATA.credentials].map((c, i) => (
                  <div key={i} style={{ flex: "0 0 150px", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 10, overflow: "hidden", background: "oklch(0.18 0.007 250)" }}>
                    <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.img} alt={L(c.name, lang)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                    <div style={{ padding: "8px 10px", fontFamily: MONO, fontSize: 10.5, color: "oklch(0.7 0.012 250)", letterSpacing: "0.03em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{L(c.name, lang)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* work */}
      <section id="work" data-section="work" style={{ padding: "120px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", width: 600, height: 600, marginLeft: -300, borderRadius: "50%", background: "radial-gradient(circle, oklch(0.78 0.12 200 / 0.1), transparent 70%)", filter: "blur(50px)", pointerEvents: "none", animation: "bnDrift 30s ease-in-out infinite", zIndex: 0 }} />
        <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <span style={eyebrowNum}>{t.workNum}</span>
            <h2 style={{ fontFamily: SG, fontSize: 32, fontWeight: 600, margin: 0 }}>{t.workEyebrow}</h2>
            <span style={dashedDot("oklch(0.78 0.12 200 / 0.5)")}>
              <span style={{ position: "absolute", top: -2, left: "50%", width: 4, height: 4, marginLeft: -2, borderRadius: "50%", background: "oklch(0.78 0.12 200)" }} />
            </span>
          </div>
          <p style={{ fontSize: 16, color: "oklch(0.6 0.012 250)", maxWidth: 560, margin: "0 0 56px 46px" }}>{t.workIntro}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px,1fr))", gap: 22 }}>
            {DATA.projects.map((p, i) => (
              <div
                key={p.code}
                data-reveal
                onMouseMove={tiltMove}
                onMouseLeave={tiltLeave}
                style={{ border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 16, overflow: "hidden", background: "oklch(0.16 0.006 250 / 0.6)", transition: "border-color 0.25s ease, transform 0.15s ease, box-shadow 0.3s ease, opacity 0.7s ease", transitionDelay: `${i * 80}ms` }}
              >
                <div style={{ aspectRatio: "16/10", overflow: "hidden", borderBottom: "1px solid oklch(1 0 0 / 0.08)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: "oklch(0.75 0.14 150)", letterSpacing: "0.06em" }}>{p.code}</span>
                    <span style={{ fontFamily: MONO, fontSize: 10.5, color: "oklch(0.5 0.01 250)" }}>{p.role[lang]}</span>
                  </div>
                  <h3 style={{ fontFamily: SG, fontSize: 20, fontWeight: 600, margin: "0 0 10px 0", color: "oklch(0.97 0.003 250)" }}>{p.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "oklch(0.65 0.012 250)", margin: "0 0 16px 0" }}>{p.desc[lang]}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
                    {p.tech.map((tc) => (
                      <span key={tc} style={{ fontFamily: MONO, fontSize: 10.5, color: "oklch(0.8 0.005 250)", background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 5, padding: "3px 8px" }}>{tc}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 16, fontFamily: MONO, fontSize: 12 }}>
                    <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ color: "oklch(0.9 0.005 250)" }}>{t.source} →</a>
                    {p.demo && (
                      <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{ color: "oklch(0.75 0.14 150)" }}>{t.demo} →</a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* experience */}
      <section id="experience" data-section="experience" style={{ padding: "120px 32px", background: "oklch(0.13 0.006 250)", borderTop: "1px solid oklch(1 0 0 / 0.06)", borderBottom: "1px solid oklch(1 0 0 / 0.06)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 56 }}>
            <span style={eyebrowNum}>{t.expNum}</span>
            <h2 style={{ fontFamily: SG, fontSize: 32, fontWeight: 600, margin: 0 }}>{t.expEyebrow}</h2>
            <span style={dashedDot("oklch(0.7 0.16 25 / 0.5)")}>
              <span style={{ position: "absolute", top: -2, left: "50%", width: 4, height: 4, marginLeft: -2, borderRadius: "50%", background: "oklch(0.7 0.16 25)" }} />
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {DATA.experiences.map((ex, i) => (
              <div key={ex.company} data-reveal style={{ border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 14, padding: 28, background: "oklch(0.16 0.006 250 / 0.6)", fontFamily: MONO, transitionDelay: `${i * 120}ms` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ex.logo} alt={ex.company} style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover", border: "1px solid oklch(1 0 0 / 0.12)" }} />
                    <div>
                      <div style={{ fontFamily: SG, fontSize: 17, fontWeight: 600, color: "oklch(0.97 0.003 250)" }}>{ex.company}</div>
                      <div style={{ fontSize: 12.5, color: "oklch(0.75 0.14 150)", marginTop: 2 }}>{ex.position[lang]}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 11, color: "oklch(0.55 0.01 250)" }}>
                    <div>{ex.period}</div>
                    <div>{ex.location[lang]}</div>
                  </div>
                </div>
                <p style={{ fontFamily: BODY, fontSize: 14.5, lineHeight: 1.6, color: "oklch(0.68 0.012 250)", margin: "0 0 16px 0" }}>{ex.desc[lang]}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ex.achievements[lang].map((ac, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, fontFamily: BODY, fontSize: 13.5, color: "oklch(0.78 0.01 250)", lineHeight: 1.5 }}>
                      <span style={{ color: "oklch(0.5 0.01 250)", flexShrink: 0 }}>›</span>
                      {ac}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 14, padding: "24px 28px", background: "oklch(0.16 0.006 250 / 0.6)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", color: "oklch(0.5 0.01 250)", marginBottom: 8 }}>{t.eduTitle}</div>
              <div style={{ fontFamily: SG, fontSize: 17, fontWeight: 600 }}>{t.eduDegree}</div>
              <div style={{ fontSize: 13.5, color: "oklch(0.65 0.012 250)", marginTop: 3 }}>{t.eduInst}</div>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 12, color: "oklch(0.55 0.01 250)" }}>{t.eduPeriod}</div>
          </div>
        </div>
      </section>

      {/* contact */}
      <section id="contact" data-section="contact" style={{ padding: "140px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.1em", color: "oklch(0.75 0.14 150)", marginBottom: 20 }}>{t.contactEyebrow}</div>
          <h2 style={{ fontFamily: SG, fontSize: "clamp(28px,5vw,44px)", fontWeight: 600, margin: "0 0 20px 0" }}>{t.contactTitle}</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "oklch(0.68 0.012 250)", margin: "0 0 44px 0" }}>{t.contactCopy}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            {CONTACT_LINKS.map((cl) => (
              <a key={cl.href} href={cl.href} target="_blank" rel="noopener noreferrer" onMouseMove={magnetMove} onMouseLeave={magnetLeave} style={{ fontFamily: MONO, fontSize: 14, color: "oklch(0.9 0.005 250)", border: "1px solid oklch(1 0 0 / 0.16)", borderRadius: 8, padding: "12px 22px", width: "min(340px,100%)", boxSizing: "border-box", textDecoration: "none" }}>
                {cl.cmd}
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ padding: "28px 32px", textAlign: "center", borderTop: "1px solid oklch(1 0 0 / 0.06)", fontFamily: MONO, fontSize: 11.5, color: "oklch(0.45 0.01 250)" }}>
        © {new Date().getFullYear()} Camilo Benítez — {t.footer}
      </footer>
    </div>
  );
}
