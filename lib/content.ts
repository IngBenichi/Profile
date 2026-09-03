import { prisma } from "@/lib/prisma"

export type Lang = "es" | "en"
export type Loc = { es: string; en: string }
export type LocList = { es: string[]; en: string[] }

export const pick = (v: Loc, lang: Lang) => v?.[lang] ?? v?.es ?? ""
export const pickList = (v: LocList, lang: Lang) => v?.[lang] ?? v?.es ?? []

export type LandingContent = {
  site: {
    heroName: string
    heroRealName: string
    eduInstitution: string
    heroBadge: Loc
    heroTitle: Loc
    heroCopy: Loc
    aboutEyebrow: Loc
    aboutP1: Loc
    aboutP2: Loc
    timelineTitle: Loc
    stackEyebrow: Loc
    stackIntro: Loc
    credEyebrow: Loc
    workEyebrow: Loc
    workIntro: Loc
    expEyebrow: Loc
    eduTitle: Loc
    eduDegree: Loc
    eduPeriod: Loc
    contactEyebrow: Loc
    contactTitle: Loc
    contactCopy: Loc
    footer: Loc
  }
  timeline: { id: number; year: string; text: Loc }[]
  hubs: { id: number; slug: string; label: Loc; color: string; items: { id: number; name: string; years: string; level: Loc }[] }[]
  credentials: { id: number; name: Loc; imageUrl: string }[]
  projects: {
    id: number
    code: string
    title: string
    imageUrl: string
    githubUrl: string
    demoUrl: string | null
    role: Loc
    description: Loc
    tech: string[]
  }[]
  experiences: {
    id: number
    company: string
    logoUrl: string
    period: string
    position: Loc
    location: Loc
    description: Loc
    achievements: LocList
  }[]
  contactLinks: { id: number; label: string; href: string }[]
}

const L = (v: unknown): Loc => {
  const o = (v ?? {}) as Partial<Loc>
  return { es: o.es ?? "", en: o.en ?? o.es ?? "" }
}
const LL = (v: unknown): LocList => {
  const o = (v ?? {}) as Partial<LocList>
  return { es: o.es ?? [], en: o.en ?? o.es ?? [] }
}

export async function getLandingContent(): Promise<LandingContent> {
  const [site, timeline, hubs, credentials, projects, experiences, contactLinks] = await Promise.all([
    prisma.siteContent.findUnique({ where: { id: 1 } }),
    prisma.timelineItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.skillHub.findMany({ orderBy: { sortOrder: "asc" }, include: { items: { orderBy: { sortOrder: "asc" } } } }),
    prisma.credential.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.project.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.experience.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.contactLink.findMany({ orderBy: { sortOrder: "asc" } }),
  ])

  if (!site) throw new Error("SiteContent not seeded — run prisma db seed")

  return {
    site: {
      heroName: site.heroName,
      heroRealName: site.heroRealName,
      eduInstitution: site.eduInstitution,
      heroBadge: L(site.heroBadge),
      heroTitle: L(site.heroTitle),
      heroCopy: L(site.heroCopy),
      aboutEyebrow: L(site.aboutEyebrow),
      aboutP1: L(site.aboutP1),
      aboutP2: L(site.aboutP2),
      timelineTitle: L(site.timelineTitle),
      stackEyebrow: L(site.stackEyebrow),
      stackIntro: L(site.stackIntro),
      credEyebrow: L(site.credEyebrow),
      workEyebrow: L(site.workEyebrow),
      workIntro: L(site.workIntro),
      expEyebrow: L(site.expEyebrow),
      eduTitle: L(site.eduTitle),
      eduDegree: L(site.eduDegree),
      eduPeriod: L(site.eduPeriod),
      contactEyebrow: L(site.contactEyebrow),
      contactTitle: L(site.contactTitle),
      contactCopy: L(site.contactCopy),
      footer: L(site.footer),
    },
    timeline: timeline.map((t) => ({ id: t.id, year: t.year, text: L(t.text) })),
    hubs: hubs.map((h) => ({
      id: h.id,
      slug: h.slug,
      label: L(h.label),
      color: h.color,
      items: h.items.map((it) => ({ id: it.id, name: it.name, years: it.years, level: L(it.level) })),
    })),
    credentials: credentials.map((c) => ({ id: c.id, name: L(c.name), imageUrl: c.imageUrl })),
    projects: projects.map((p) => ({
      id: p.id,
      code: p.code,
      title: p.title,
      imageUrl: p.imageUrl,
      githubUrl: p.githubUrl,
      demoUrl: p.demoUrl,
      role: L(p.role),
      description: L(p.description),
      tech: p.tech,
    })),
    experiences: experiences.map((e) => ({
      id: e.id,
      company: e.company,
      logoUrl: e.logoUrl,
      period: e.period,
      position: L(e.position),
      location: L(e.location),
      description: L(e.description),
      achievements: LL(e.achievements),
    })),
    contactLinks: contactLinks.map((c) => ({ id: c.id, label: c.label, href: c.href })),
  }
}
