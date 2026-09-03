// Idempotent seed: initial benichi.dev content (the Portfolio.dc.html proposal).
// Safe to run on every deploy — it only fills tables that are still empty.
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const SITE = {
  id: 1,
  heroName: "BENICHI",
  heroRealName: "Camilo Benítez",
  eduInstitution: "Universidad de la Costa (CUC)",
  heroBadge: { es: "Disponible para nuevas oportunidades", en: "Open to new opportunities" },
  heroTitle: { es: "Ingeniero de Software Backend", en: "Backend Software Engineer" },
  heroCopy: {
    es: "Estudiante de Ingeniería de Sistemas construyendo APIs, microservicios e infraestructura — con la mira puesta en IA, cloud y ciberseguridad.",
    en: "Systems Engineering student building APIs, microservices and infrastructure — with sights set on AI, cloud and cybersecurity.",
  },
  aboutEyebrow: { es: "Sobre mí", en: "About me" },
  aboutP1: {
    es: "Soy Ingeniero de Software Backend con una profunda pasión por resolver problemas complejos a través de APIs robustas, arquitecturas de microservicios y soluciones escalables en la nube.",
    en: "I'm a Backend Software Engineer with a deep passion for solving complex problems through robust APIs, microservices architectures and scalable cloud solutions.",
  },
  aboutP2: {
    es: "Aprendo constantemente — proyectos open-source, hackathons, equipos multidisciplinarios. Hoy me enfoco en construir sistemas backend reales, y en llevarlos hacia IA, cloud y ciberseguridad.",
    en: "I learn constantly — open-source projects, hackathons, cross-functional teams. Today I'm focused on building real backend systems, and pushing further into AI, cloud and cybersecurity.",
  },
  timelineTitle: { es: "LÍNEA DE TIEMPO", en: "TIMELINE" },
  stackEyebrow: { es: "Stack tecnológico", en: "Technology stack" },
  stackIntro: {
    es: "Backend moderno, bases de datos relacionales y herramientas DevOps — el sistema con el que construyo.",
    en: "Modern backend, relational databases and DevOps tooling — the system I build with.",
  },
  credEyebrow: { es: "CREDENCIALES", en: "CREDENTIALS" },
  workEyebrow: { es: "Proyectos", en: "Work" },
  workIntro: { es: "Seis sistemas reales que he construido y desplegado.", en: "Six real systems I've built and shipped." },
  expEyebrow: { es: "Experiencia", en: "Experience" },
  eduTitle: { es: "EDUCACIÓN", en: "EDUCATION" },
  eduDegree: { es: "Ingeniería en Sistemas", en: "Systems Engineering" },
  eduPeriod: { es: "Feb 2023 – Dic 2027 · En curso", en: "Feb 2023 – Dec 2027 · In progress" },
  contactEyebrow: { es: "SYSTEM READY", en: "SYSTEM READY" },
  contactTitle: { es: "¿Tienes un proyecto en mente?", en: "Have a project in mind?" },
  contactCopy: {
    es: "Actualmente estoy abierto a nuevas oportunidades donde pueda aportar valor construyendo sistemas backend robustos. Si buscas a alguien comprometido y orientado a resultados, ¡hablemos!",
    en: "I'm currently open to new opportunities where I can add value building robust backend systems. If you're looking for someone committed and results-driven, let's talk!",
  },
  footer: { es: "Ingeniero de Software Backend", en: "Backend Software Engineer" },
}

const TIMELINE = [
  { year: "2023", text: { es: "Inicia Ingeniería de Sistemas — Universidad de la Costa (CUC)", en: "Starts Systems Engineering — Universidad de la Costa (CUC)" } },
  { year: "2024", text: { es: "Cofunda ARC4M como Software Engineer", en: "Co-founds ARC4M as Software Engineer" } },
  { year: "2024", text: { es: "Backend Developer Junior en Domotes S.A.S.", en: "Backend Developer Junior at Domotes S.A.S." } },
  { year: "2024–26", text: { es: "Certificaciones en Django, Docker, FastAPI, Laravel, DevOps, IA, OAuth, OWASP", en: "Certifications in Django, Docker, FastAPI, Laravel, DevOps, AI, OAuth, OWASP" } },
  { year: "NOW", text: { es: "Construyendo sistemas backend reales", en: "Building real backend systems" } },
]

const HUBS = [
  { slug: "lang", color: "oklch(0.75 0.14 150)", label: { es: "LENGUAJES", en: "LANGUAGES" }, items: [
    { name: "Python", years: "5+", level: { es: "Avanzado", en: "Advanced" } },
    { name: "JavaScript", years: "3+", level: { es: "Intermedio", en: "Intermediate" } },
    { name: "PHP", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
  ] },
  { slug: "fw", color: "oklch(0.74 0.14 300)", label: { es: "FRAMEWORKS", en: "FRAMEWORKS" }, items: [
    { name: "Node.js", years: "4+", level: { es: "Avanzado", en: "Advanced" } },
    { name: "Express", years: "4+", level: { es: "Avanzado", en: "Advanced" } },
    { name: "Django", years: "3+", level: { es: "Avanzado", en: "Advanced" } },
    { name: "Flask", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
    { name: "FastAPI", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
    { name: "Laravel", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
  ] },
  { slug: "db", color: "oklch(0.78 0.12 200)", label: { es: "BASES DE DATOS", en: "DATABASES" }, items: [
    { name: "PostgreSQL", years: "3+", level: { es: "Avanzado", en: "Advanced" } },
    { name: "MySQL", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
    { name: "SQLite", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
  ] },
  { slug: "tools", color: "oklch(0.72 0.14 250)", label: { es: "HERRAMIENTAS", en: "TOOLS" }, items: [
    { name: "Docker", years: "3+", level: { es: "Avanzado", en: "Advanced" } },
    { name: "Azure DevOps", years: "2+", level: { es: "Intermedio", en: "Intermediate" } },
    { name: "AWS", years: "1", level: { es: "Básico", en: "Basic" } },
    { name: "Git", years: "5+", level: { es: "Avanzado", en: "Advanced" } },
  ] },
]

const CREDENTIALS = [
  { imageUrl: "/django.png", name: { es: "Django", en: "Django" } },
  { imageUrl: "/django_rest.png", name: { es: "Django REST", en: "Django REST" } },
  { imageUrl: "/laravel.png", name: { es: "Laravel", en: "Laravel" } },
  { imageUrl: "/laravel_rest.png", name: { es: "Laravel REST", en: "Laravel REST" } },
  { imageUrl: "/docker.png", name: { es: "Docker", en: "Docker" } },
  { imageUrl: "/fastapi.png", name: { es: "FastAPI", en: "FastAPI" } },
  { imageUrl: "/devops.png", name: { es: "DevOps", en: "DevOps" } },
  { imageUrl: "/ia.png", name: { es: "Inteligencia Artificial", en: "Artificial Intelligence" } },
  { imageUrl: "/oauth.png", name: { es: "OAuth", en: "OAuth" } },
  { imageUrl: "/owasp.png", name: { es: "OWASP", en: "OWASP" } },
]

const PROJECTS = [
  { code: "SYS-01", title: "Benichi's Blog", githubUrl: "https://github.com/IngBenichi/Blog-Benichi", demoUrl: "https://my-blog-app-django.onrender.com/", imageUrl: "/blog.png", tech: ["Django", "PostgreSQL", "Google Cloud", "Docker"],
    role: { es: "Desarrollador Backend Líder", en: "Lead Backend Developer" },
    description: { es: "Plataforma de blog personal enfocada en rendimiento y SEO, usando renderizado del lado del servidor y generación de sitios estáticos.", en: "Personal blog platform focused on performance and SEO, using server-side rendering and static site generation." } },
  { code: "SYS-02", title: "YTMediaConverter", githubUrl: "https://github.com/IngBenichi/YTMediaConverter", demoUrl: null, imageUrl: "/yt.JPG", tech: ["Python"],
    role: { es: "Ingeniero Backend", en: "Backend Engineer" },
    description: { es: "Aplicación para descargar y convertir videos de YouTube en MP3 o MP4, con interfaz gráfica intuitiva y barra de progreso en tiempo real.", en: "App to download and convert YouTube videos to MP3 or MP4, with an intuitive GUI and real-time progress bar." } },
  { code: "SYS-03", title: "Crypto Dashboard", githubUrl: "https://github.com/IngBenichi/crypto-dashboard", demoUrl: "https://v0-crypto-dashboard-mu-tawny.vercel.app/", imageUrl: "/crypto.png", tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    role: { es: "Desarrollador Frontend", en: "Frontend Developer" },
    description: { es: "Dashboard interactivo para visualizar datos de criptomonedas en tiempo real con gráficos y estadísticas detalladas.", en: "Interactive dashboard for real-time cryptocurrency data with charts and detailed stats." } },
  { code: "SYS-04", title: "Auction Product Page", githubUrl: "https://github.com/IngBenichi/auction-product-page", demoUrl: "https://v0-auction-product-page.vercel.app/", imageUrl: "/auction.png", tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    role: { es: "Desarrollador Frontend", en: "Frontend Developer" },
    description: { es: "Página de producto de subasta con diseño moderno y funcionalidades interactivas para una experiencia de usuario optimizada.", en: "Auction product page with modern design and interactive features for an optimized user experience." } },
  { code: "SYS-05", title: "Benichi Dev Studio", githubUrl: "https://github.com/IngBenichi/benichi-dev-studio-landing-page", demoUrl: "https://v0-benichi-dev-studio-landing-page.vercel.app/", imageUrl: "/benichi-dev.png", tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    role: { es: "Desarrollador Frontend", en: "Frontend Developer" },
    description: { es: "Landing page profesional para estudio de desarrollo, con diseño moderno y secciones informativas sobre servicios y proyectos.", en: "Professional landing page for a dev studio, with modern design and informative service/project sections." } },
  { code: "SYS-06", title: "Battle Zone Landing", githubUrl: "https://github.com/IngBenichi/battle-zone-landing-page", demoUrl: "https://v0-battle-zone-landing-page.vercel.app/", imageUrl: "/battle.png", tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    role: { es: "Desarrollador Frontend", en: "Frontend Developer" },
    description: { es: "Landing page temática para zona de batalla, con diseño impactante y elementos visuales dinámicos.", en: "Themed battle-zone landing page with bold design and dynamic visual elements." } },
]

const EXPERIENCES = [
  { company: "Domotes S.A.S", logoUrl: "/domotes_ltda_logo.jpeg", period: "Dec 2024 — Present",
    position: { es: "Backend Developer Junior", en: "Backend Developer Junior" },
    location: { es: "Barranquilla, Colombia · Presencial", en: "Barranquilla, Colombia · On-site" },
    description: { es: "Desarrollo y mantengo sistemas backend escalables utilizando Laravel y microservicios basados en Python, siguiendo buenas prácticas y patrones arquitectónicos para asegurar mantenibilidad y rendimiento.", en: "I develop and maintain scalable backend systems using Laravel and Python-based microservices, following best practices and architectural patterns for maintainability and performance." },
    achievements: {
      es: [
        "Desarrollé y mantuve sistemas backend escalables usando Laravel y microservicios en Python",
        "Construí y gestioné pipelines de CI/CD aprovechando Microsoft Azure",
        "Trabajé con contenedores Docker para crear entornos consistentes y optimizar despliegues",
        "Administré y optimicé bases de datos, asegurando alto rendimiento y confiabilidad",
        "Diseñé e implementé APIs RESTful siguiendo las mejores prácticas",
        "Contribuí a mantener una arquitectura de sistema robusta, escalable y de alta calidad",
      ],
      en: [
        "Developed and maintained scalable backend systems using Laravel and Python microservices",
        "Built and managed CI/CD pipelines leveraging Microsoft Azure",
        "Worked with Docker containers to create consistent environments and optimize deployments",
        "Managed and optimized databases, ensuring high performance and reliability",
        "Designed and implemented RESTful APIs following best practices",
        "Contributed to maintaining a robust, scalable, high-quality system architecture",
      ],
    } },
  { company: "ARC4M", logoUrl: "/arc4m_logo.jpeg", period: "Jan 2024 — Present",
    position: { es: "Co-Fundador & Software Engineer", en: "Co-Founder & Software Engineer" },
    location: { es: "Barranquilla, Colombia · Remoto", en: "Barranquilla, Colombia · Remote" },
    description: { es: "Como cofundador y software engineer, lidero el desarrollo de soluciones tecnológicas, participando en decisiones estratégicas y en la implementación de arquitecturas robustas para nuestros productos.", en: "As co-founder and software engineer, I lead the development of technology solutions, taking part in strategic decisions and implementing robust architectures for our products." },
    achievements: {
      es: [
        "Cofundé la empresa y participé en la definición de la visión tecnológica",
        "Diseñé e implementé arquitecturas escalables para productos SaaS",
        "Lideré equipos de desarrollo en proyectos de software a medida",
        "Implementé prácticas de DevOps y despliegue continuo",
        "Colaboré con clientes para entender y resolver necesidades técnicas complejas",
      ],
      en: [
        "Co-founded the company and helped shape its technology vision",
        "Designed and implemented scalable architectures for SaaS products",
        "Led development teams on custom software projects",
        "Implemented DevOps practices and continuous deployment",
        "Collaborated with clients to understand and solve complex technical needs",
      ],
    } },
]

const CONTACT_LINKS = [
  { label: "$ open mailto:djangobenichi@gmail.com", href: "mailto:djangobenichi@gmail.com" },
  { label: "$ open github.com/IngBenichi", href: "https://github.com/IngBenichi" },
  { label: "$ open linkedin.com/in/benichidev", href: "https://www.linkedin.com/in/benichidev" },
]

async function main() {
  await prisma.siteContent.upsert({ where: { id: 1 }, update: {}, create: SITE })

  if ((await prisma.timelineItem.count()) === 0)
    await prisma.timelineItem.createMany({ data: TIMELINE.map((t, i) => ({ ...t, sortOrder: i })) })

  if ((await prisma.skillHub.count()) === 0) {
    for (const [i, hub] of HUBS.entries()) {
      await prisma.skillHub.create({
        data: {
          slug: hub.slug, label: hub.label, color: hub.color, sortOrder: i,
          items: { create: hub.items.map((it, j) => ({ ...it, sortOrder: j })) },
        },
      })
    }
  }

  if ((await prisma.credential.count()) === 0)
    await prisma.credential.createMany({ data: CREDENTIALS.map((c, i) => ({ ...c, sortOrder: i })) })

  if ((await prisma.project.count()) === 0)
    await prisma.project.createMany({ data: PROJECTS.map((p, i) => ({ ...p, sortOrder: i })) })

  if ((await prisma.experience.count()) === 0)
    await prisma.experience.createMany({ data: EXPERIENCES.map((e, i) => ({ ...e, sortOrder: i })) })

  if ((await prisma.contactLink.count()) === 0)
    await prisma.contactLink.createMany({ data: CONTACT_LINKS.map((c, i) => ({ ...c, sortOrder: i })) })

  console.log("seed: ok")
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("seed: failed", e)
    await prisma.$disconnect()
    process.exit(1)
  })
